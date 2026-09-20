# 八字推盘 Skill 流水线状态

## 阶段 0 — 整书理解
- [x] 完成 BOOK_OVERVIEW.md

## 阶段 1 — 并行提取
- [x] candidates/ 目录已创建

## 阶段 1.5 — 三重验证筛选
- [x] verified.md 已创建，全部单元通过

## 阶段 2 — RIA++ 构造 Skill
- [x] 主 skill tuipan-master 已创建（13模块）
- [x] 17个子 skill 全部创建完成
- [x] 新增 shier-changsheng（十二长生）
- [x] 所有 test-prompts.json 已创建

## 阶段 3 — Zettelkasten 链接
- [x] INDEX.md 已生成（含引用图和调用关系）

## 阶段 4 — 压力测试
- [ ] 待实施（test-prompts.json 已就绪）

## 阶段 5 — 交付
- [x] DIGEST.md 已生成

---

## Skill 完整清单（18个子 skill + 2个顶级 + 1个规范）

| Skill | 状态 |
|---|---|
| tuipan-master（总入口） | ✅ |
| 八字完整推盘输出通用规范 | ✅ |
| paipan-jichu | ✅ |
| tiangan-wuhe | ✅ |
| dizhi-liuhe | ✅ |
| dizhi-liuchong | ✅ |
| dizhi-liuchuan | ✅ |
| dizhi-xiangxing | ✅ |
| dizhi-sanhe | ✅ |
| dizhi-sanhui | ✅ |
| dizhi-banhe | ✅ |
| shishen-jichu | ✅ |
| shishen-zuhe | ✅ |
| shengshuai-panbie | ✅ |
| wuxing-shengke | ✅ |
| geshi-dingxing | ✅ |
| xi-ji-quyong | ✅ |
| dayun-fenxi | ✅ |
| **shier-changsheng（新增）** | ✅ |

## 激活方式

用户输入以下任一关键词时，触发 tuipan-master：
- "测一下这个人的八字"
- "排一下这个人的八字"
- "看一下命盘"
- "算一下八字"

## 新增说明

- **2026-08-27**：新增 `shier-changsheng` skill（十二长生/生旺死绝）
- 规范从12模块升级为**13模块**，新增模块四"十二长生旺衰全解"
- 十二长生核心表、阴阳顺逆规则、12状态逐位详解均已蒸馏入 skill
