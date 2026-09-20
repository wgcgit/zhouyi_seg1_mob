const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// 引入 LunarCalendar.js（八字转换核心库）
const LunarCalendar = require('../LunarCalendar');

const SYSTEM_PROMPT_BASIC_PATH = path.join(__dirname, '../prompts/SYSTEM_PROMPT.md');
const ADVANCED_PROMPT_PATH = path.join(__dirname, '../../skills/bazi-tuipan');

// 按 tuipan-master.skill 规定的顺序拼接所有子 skill
const SKILL_CALL_ORDER = [
  'paipan-jichu/SKILL.md',
  'tiangan-wuhe/SKILL.md',
  'dizhi-liuhe/SKILL.md',
  'dizhi-liuchong/SKILL.md',
  'dizhi-liuchuan/SKILL.md',
  'dizhi-xiangxing/SKILL.md',
  'dizhi-sanhe/SKILL.md',
  'dizhi-sanhui/SKILL.md',
  'dizhi-banhe/SKILL.md',
  'shishen-jichu/SKILL.md',
  'shengshuai-panbie/SKILL.md',
  'geshi-dingxing/SKILL.md',
  'shier-changsheng/SKILL.md',
  'shishen-zuhe/SKILL.md',
  'wuxing-shengke/SKILL.md',
  'dayun-fenxi/SKILL.md',
];

function buildAdvancedPrompt() {
  const master = fs.readFileSync(path.join(ADVANCED_PROMPT_PATH, 'tuipan-master.skill.md'), 'utf-8');
  const format = fs.readFileSync(path.join(ADVANCED_PROMPT_PATH, '八字完整推盘输出通用规范.skill.md'), 'utf-8');
  const xijiquyong = fs.readFileSync(path.join(ADVANCED_PROMPT_PATH, 'xi-ji-quyong.skill.md'), 'utf-8');
  const systemPromptBasic = fs.readFileSync(SYSTEM_PROMPT_BASIC_PATH, 'utf-8');

  // 提取 SYSTEM_PROMPT.md 中 JSON Schema 部分（第113-279行）作为强制输出格式
  const schemaMatch = systemPromptBasic.match(/## JSON输出格式\n([\s\S]+?)\n## 知识库/);
  const jsonSchema = schemaMatch ? schemaMatch[0].replace(/## 知识库\/.*$/, '').trim() : '';

  let skills = '\n\n## 子 Skill 知识库\n\n';
  for (const f of SKILL_CALL_ORDER) {
    const content = fs.readFileSync(path.join(ADVANCED_PROMPT_PATH, f), 'utf-8');
    // 去掉 frontmatter 和 skill 自身元信息，只留正文
    const body = content.replace(/^---[\s\S]*?---\n/, '');
    skills += `### ${f.split('/')[0]}\n${body}\n\n`;
  }
  // 把主 skill 的输出规范 + 子 skill 知识库 + JSON Schema 拼接
  // JSON Schema 放最后，确保 LLM 优先遵循文字规范，输出格式严格按 Schema
  return master + '\n\n---\n\n## 输出格式规范\n\n' + format + '\n\n' + xijiquyong + '\n\n' + jsonSchema + '\n\n' + skills;
}

async function callMiniMax(messages) {
  const response = await axios.post(
    'https://api.minimax.chat/v1/text/chatcompletion_v2',
    {
      model: 'MiniMax-Text-01',
      messages,
      max_tokens: 8192,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 120000
    }
  );
  console.error('MiniMax raw response:', JSON.stringify(response.data, null, 2));
  if (!response.data.choices || response.data.choices.length === 0) {
    throw new Error(`MiniMax API returned no choices. base_resp: ${JSON.stringify(response.data.base_resp)}`);
  }
  return response.data.choices[0].message.content;
}

router.post('/paipan', async (req, res) => {
  try {
    const { name, gender, birthTime, province, city, advanced } = req.body;

    // 校验参数
    if (!name || !gender || !birthTime || !province || !city) {
      return res.status(400).json({ success: false, error: '缺少必要参数' });
    }

    // 解析公历出生时间
    const birthDateTime = new Date(birthTime);
    if (isNaN(birthDateTime.getTime())) {
      return res.status(400).json({ success: false, error: '出生时间格式错误' });
    }
    const year = birthDateTime.getFullYear();
    const month = birthDateTime.getMonth() + 1;
    const day = birthDateTime.getDate();
    const hour = birthDateTime.getHours();

    // 调用 LunarCalendar.getBazi() 获取八字信息
    let bazi;
    try {
      bazi = LunarCalendar.getBazi(year, month, day, hour);
    } catch (e) {
      return res.status(400).json({ success: false, error: '八字转换失败：' + e.message });
    }

    // 校验八字转换结果
    if (!bazi || !bazi.yearGanZhi || !bazi.monthGanZhi || !bazi.dayGanZhi || !bazi.hourGanZhi) {
      return res.status(400).json({ success: false, error: '八字转换结果无效，可能是日期超出范围（1891-2100）' });
    }

    // 构建八字信息字符串
    const baziInfo = `四柱八字：
  年柱：${bazi.yearGanZhi}
  月柱：${bazi.monthGanZhi}
  日柱：${bazi.dayGanZhi}
  时柱：${bazi.hourGanZhi}
农历信息：
  农历年：${bazi.lunarYear}年
  农历月：${bazi.lunarMonthName}月
  农历日：${bazi.lunarDayName}
  生肖：${bazi.zodiac}`;

    // 选择 basic 或 advanced system prompt
    let systemPrompt;
    if (advanced) {
      systemPrompt = buildAdvancedPrompt();
    } else {
      systemPrompt = fs.readFileSync(SYSTEM_PROMPT_BASIC_PATH, 'utf-8');
      // basic 模式：替换用户信息占位符
      systemPrompt = systemPrompt
        .replace(/\{name\}/g, name)
        .replace(/\{gender\}/g, gender)
        .replace(/\{birthTime\}/g, birthTime)
        .replace(/\{province\}/g, province)
        .replace(/\{city\}/g, city)
        .replace(/\{baziInfo\}/g, baziInfo);
    }

    // 调用 MiniMax
    const userContent = advanced
      ? `用户信息：姓名：${name}，性别：${gender}，出生时间（公历）：${birthTime}，出生省份：${province}，出生城市：${city}。\n${baziInfo}\n请严格按上述输出格式规范中的 JSON Schema 输出八字命盘分析，直接返回纯 JSON 对象，不要用 markdown 代码块包裹，不要有任何额外解释文字。`
      : `用户信息：姓名：${name}，性别：${gender}，出生时间（公历）：${birthTime}，出生省份：${province}，出生城市：${city}。\n${baziInfo}\n请严格按上述 JSON Schema 输出八字命盘分析，直接返回纯 JSON 对象，不要用 markdown 代码块包裹，不要有任何额外解释文字。`;
    const result = await callMiniMax([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ]);

    // 解析 JSON（去除 markdown code block wrapper）
    let data;
    try {
      let jsonStr = result.trim();
      // 去掉 ```json ... ``` 包装
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/i, '');
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.replace(/\s*```$/, '');
      }
      data = JSON.parse(jsonStr.trim());
    } catch (e) {
      return res.status(500).json({ success: false, error: 'LLM返回格式错误：' + e.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('LLM调用失败:', error.message);
    res.status(500).json({ success: false, error: 'LLM调用失败：' + error.message });
  }
});

module.exports = router;
