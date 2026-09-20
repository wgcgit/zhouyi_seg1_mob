# 八字推盘移动端适配实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `zhouyi_seg1` 项目改造为移动端Web应用，保存到 `zhouyi_seg1_mob`，保留全部功能。

**Architecture:** 完全独立部署，前端移动端专属，后端直接复用原项目接口。前端采用原生 HTML/CSS/JS + Tailwind CSS，顶部 Tab 导航，四柱纵向展示。

**Tech Stack:** 原生 HTML/CSS/JavaScript, Tailwind CSS (CDN), Material Symbols Icons (Google Fonts)

## Global Constraints

- 设计风格：简约国风，与原项目保持一致
- 颜色系统：`#715b3e` (主色), `#fff8f5` (背景), `#ffffff` (卡片)
- 字体：Source Serif 4 (标题), Manrope (正文), Be Vietnam Pro (标签)
- 移动端视口：375px - 428px
- 间距系统：8px 基础单位
- 圆角：12px (卡片), 阴影：`0px 4px 20px rgba(139, 115, 85, 0.08)`

---

## 文件结构

```
zhouyi_seg1_mob/
├── backend/                              # 从原项目复制，不做任何修改
│   ├── server.js
│   ├── routes/paipan.js
│   ├── LunarCalendar.js
│   ├── prompts/SYSTEM_PROMPT.md
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html                        # 创建：移动端信息录入页
│   ├── result.html                       # 创建：移动端结果展示页
│   └── shared/
│       └── cities.js                     # 从原项目复制
├── skills/                               # 复制：推盘所需的知识库（运行时依赖）
│   └── bazi-tuipan/                      # advanced模式后端读取此目录
└── docs/
    └── superpowers/
        ├── specs/2026-09-20-bazi-tuipan-mobile-design.md
        └── plans/2026-09-20-bazi-tuipan-mobile-implementation.md
```

---

## 任务分解

### Task 1: 项目初始化 - 复制后端、共享资源和技能库

**Files:**
- Copy: `D:/Software/ClaudeCodeProject/zhouyi_seg1/backend/` → `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/backend/`
- Copy: `D:/Software/ClaudeCodeProject/zhouyi_seg1/frontend/shared/cities.js` → `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/shared/cities.js`
- Copy: `D:/Software/ClaudeCodeProject/zhouyi_seg1/skills/bazi-tuipan/` → `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/skills/bazi-tuipan/`
- Create: `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/shared/` (目录)

**Interfaces:**
- Produces: 可直接运行的后端服务，端口 3000，支持 basic 和 advanced 两种推盘模式

- [ ] **Step 1: 创建目录结构**

```bash
mkdir -p "D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/shared"
mkdir -p "D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/backend/routes"
mkdir -p "D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/backend/prompts"
mkdir -p "D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/skills/bazi-tuipan"
```

- [ ] **Step 2: 复制后端文件**

从 `D:/Software/ClaudeCodeProject/zhouyi_seg1/backend/` 复制所有文件到 `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/backend/`

需要复制的文件：
- `server.js`
- `LunarCalendar.js`
- `routes/paipan.js`
- `prompts/SYSTEM_PROMPT.md`
- `package.json`
- `.env`

- [ ] **Step 3: 复制前端共享资源**

```bash
cp "D:/Software/ClaudeCodeProject/zhouyi_seg1/frontend/shared/cities.js" "D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/shared/cities.js"
```

- [ ] **Step 4: 复制技能库（推盘知识库，运行时依赖）**

```bash
cp -r "D:/Software/ClaudeCodeProject/zhouyi_seg1/skills/bazi-tuipan/"* "D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/skills/bazi-tuipan/"
```

需要复制的子目录和文件：
- `tuipan-master.skill.md`
- `八字完整推盘输出通用规范.skill.md`
- `xi-ji-quyong.skill.md`
- `paipan-jichu/`
- `tiangan-wuhe/`
- `dizhi-liuhe/`
- `dizhi-liuchong/`
- `dizhi-liuchuan/`
- `dizhi-xiangxing/`
- `dizhi-sanhe/`
- `dizhi-sanhui/`
- `dizhi-banhe/`
- `shishen-jichu/`
- `shengshuai-panbie/`
- `geshi-dingxing/`
- `shier-changsheng/`
- `shishen-zuhe/`
- `wuxing-shengke/`
- `dayun-fenxi/`
- 以及其他辅助文件

- [ ] **Step 5: 提交**

```bash
cp "D:/Software/ClaudeCodeProject/zhouyi_seg1/frontend/shared/cities.js" "D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/shared/cities.js"
```

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "chore: initialize project structure with backend and shared resources"
```

---

### Task 2: 创建移动端信息录入页 (index.html)

**Files:**
- Create: `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/index.html`

**Interfaces:**
- Consumes: `/api/paipan` POST 接口 (来自后端)
- Produces: 表单提交后跳转 result.html，数据存储在 sessionStorage

- [ ] **Step 1: 创建 index.html 基础结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
  <title>八字推盘信息录入 - 周易之易</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=beVietnamPro:wght@100..900&family=manrope:wght@100..900&family=sourceSerif4:wght@100..900&display=swap" rel="stylesheet"/>
  <!-- Tailwind config and styles inline -->
</head>
<body class="bg-surface text-on-surface min-h-screen flex flex-col">
  <!-- TopNavBar -->
  <nav class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md flex justify-center items-center h-14 border-b border-outline-variant/10">
    <span class="font-headline-lg text-headline-lg text-primary tracking-tight">周易之易</span>
  </nav>

  <!-- Main Content -->
  <main class="flex-grow pt-14 pb-20 px-5">
    <!-- Header -->
    <div class="text-center py-6">
      <h1 class="font-display-lg text-display-lg text-primary mb-2">开启您的命理探索</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant">请输入您的基础出生信息，获取深度命盘解析</p>
    </div>

    <!-- Form Card -->
    <div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
      <form id="paipan-form" class="flex flex-col gap-5">
        <!-- 姓名输入 -->
        <div class="flex flex-col gap-1.5">
          <label class="font-title-md text-title-md text-primary flex items-center gap-1" for="name">
            姓名 <span class="text-error">*</span>
          </label>
          <input class="w-full bg-white border-b-2 border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3.5 rounded-t-lg text-body-md transition-colors placeholder:text-on-surface-variant/50" 
                 id="name" maxlength="10" name="name" placeholder="请输入汉字姓名（最多10字）" type="text" value="李明"/>
        </div>

        <!-- 性别选择 -->
        <div class="flex flex-col gap-1.5">
          <label class="font-title-md text-title-md text-primary">性别 <span class="text-error">*</span></label>
          <div class="flex bg-surface-container-low rounded-lg p-1 w-full max-w-[160px]">
            <input type="radio" id="gender-male" name="gender" value="男" class="hidden peer/male" checked=""/>
            <label for="gender-male" class="flex-1 py-2.5 text-center rounded-lg cursor-pointer font-label-sm text-label-sm font-bold transition-all peer-checked/male:bg-white peer-checked/male:text-primary peer-checked/male:shadow-sm hover:text-primary">男</label>
            <input type="radio" id="gender-female" name="gender" value="女" class="hidden peer/female"/>
            <label for="gender-female" class="flex-1 py-2.5 text-center rounded-lg cursor-pointer font-label-sm text-label-sm transition-all peer-checked/female:bg-white peer-checked/female:text-primary hover:text-primary">女</label>
          </div>
        </div>

        <!-- 出生时间 -->
        <div class="flex flex-col gap-1.5">
          <label class="font-title-md text-title-md text-primary">出生时间 <span class="text-error">*</span></label>
          <div class="grid grid-cols-2 gap-3">
            <input class="w-full bg-white border-b-2 border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3.5 rounded-t-lg text-body-md transition-colors appearance-none" 
                   id="birth_date" name="birth_date" type="date"/>
            <input class="w-full bg-white border-b-2 border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3.5 rounded-t-lg text-body-md transition-colors appearance-none" 
                   id="birth_time" name="birth_time" type="time"/>
          </div>
          <p class="font-label-sm text-label-sm text-on-surface-variant/70 flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">info</span> 若无精准分钟，可选择00分
          </p>
        </div>

        <!-- 出生地点 -->
        <div class="flex flex-col gap-1.5">
          <label class="font-title-md text-title-md text-primary">出生地点 <span class="text-error">*</span></label>
          <div class="grid grid-cols-2 gap-3">
            <select id="province" class="w-full bg-white border-b-2 border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3.5 rounded-t-lg text-body-md transition-colors appearance-none" name="province">
              <option disabled="" selected="" value="">请选择省份</option>
            </select>
            <select id="city" class="w-full bg-white border-b-2 border-outline-variant/50 focus:border-primary focus:ring-0 px-4 py-3.5 rounded-t-lg text-body-md transition-colors appearance-none" name="city" disabled>
              <option disabled="" selected="" value="">请选择城市</option>
            </select>
          </div>
        </div>

        <!-- 高级分析开关 -->
        <div class="flex items-center justify-between py-3 px-1 border-t border-outline-variant/10">
          <div class="flex flex-col">
            <span class="font-title-md text-title-md text-on-surface">高级分析</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">包含更详细的命理推演解读</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="advanced-mode" class="sr-only peer">
            <div class="w-11 h-6 bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
          </label>
        </div>
      </form>
    </div>
  </main>

  <!-- Fixed Submit Button -->
  <div class="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-md border-t border-outline-variant/10">
    <button id="submit-btn" class="w-full bg-primary-container text-on-primary disabled:opacity-60 disabled:cursor-not-allowed hover:disabled:bg-primary-container py-4 rounded-xl font-title-md text-title-md font-bold shadow-md shadow-primary-container/20 flex items-center justify-center gap-2" type="submit" form="paipan-form">
      <span id="btn-text">开始排盘</span>
      <span class="material-symbols-outlined" id="btn-icon">arrow_forward</span>
    </button>
  </div>

  <script src="shared/cities.js"></script>
  <script>
    // Tailwind config
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            surface: "#fff8f5",
            "surface-container-lowest": "#ffffff",
            "surface-container-low": "#fbf2ed",
            "surface-container": "#f5ece7",
            "on-surface": "#1e1b18",
            "on-surface-variant": "#4d453c",
            "primary": "#715b3e",
            "primary-container": "#8b7355",
            "on-primary": "#ffffff",
            "on-primary-container": "#0a0400",
            "outline-variant": "#d1c4b9",
            error: "#ba1a1a",
            "on-error": "#ffffff"
          },
          fontFamily: {
            "body-md": ["manrope"],
            "title-md": ["manrope"],
            "label-sm": ["beVietnamPro"],
            "display-lg": ["sourceSerif4"],
            "headline-lg": ["sourceSerif4"]
          },
          fontSize: {
            "body-md": ["16px", { lineHeight: "1.7", fontWeight: "400" }],
            "body-lg": ["18px", { lineHeight: "1.8", fontWeight: "400" }],
            "title-md": ["20px", { lineHeight: "1.5", fontWeight: "600" }],
            "label-sm": ["13px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
            "display-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
            "headline-lg": ["24px", { lineHeight: "1.3", fontWeight: "600" }]
          }
        }
      }
    };

    // Set default date and time
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('birth_date').value = '1990-01-15';
      document.getElementById('birth_time').value = '10:30';

      // Populate provinces
      const provinceSelect = document.getElementById('province');
      for (const province in citiesData) {
        const opt = document.createElement('option');
        opt.value = province;
        opt.textContent = province;
        provinceSelect.appendChild(opt);
      }

      // Province-city linkage
      const citySelect = document.getElementById('city');
      provinceSelect.addEventListener('change', () => {
        const cities = citiesData[provinceSelect.value] || [];
        citySelect.innerHTML = '<option value="">请选择城市</option>';
        cities.forEach(city => {
          const opt = document.createElement('option');
          opt.value = city;
          opt.textContent = city;
          citySelect.appendChild(opt);
        });
        citySelect.disabled = !cities.length;
      });

      // Default: 北京市 -> 东城区
      provinceSelect.value = '北京市';
      provinceSelect.dispatchEvent(new Event('change'));
      citySelect.value = '东城区';
    });

    // Form submission
    const form = document.getElementById('paipan-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const gender = document.querySelector('input[name="gender"]:checked')?.value;
      const birthDate = document.getElementById('birth_date').value;
      const birthTime = document.getElementById('birth_time').value;
      const province = document.getElementById('province').value;
      const city = document.getElementById('city').value;

      if (!name || !gender || !birthDate || !birthTime || !province || !city) {
        alert('请填写完整信息');
        return;
      }

      submitBtn.disabled = true;
      btnText.textContent = '正在生成排盘，请稍后';
      btnIcon.style.display = 'none';

      try {
        const response = await fetch('/api/paipan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            gender,
            birthTime: `${birthDate} ${birthTime}`,
            province,
            city,
            advanced: document.getElementById('advanced-mode').checked
          })
        });

        const result = await response.json();

        if (!result.success) {
          alert('生成失败：' + result.error);
          submitBtn.disabled = false;
          btnText.textContent = '开始排盘';
          btnIcon.style.display = 'inline';
          return;
        }

        sessionStorage.setItem('paipanResult', JSON.stringify(result.data));
        window.location.href = 'result.html';

      } catch (err) {
        alert('网络错误：' + err.message);
        submitBtn.disabled = false;
        btnText.textContent = '开始排盘';
        btnIcon.style.display = 'inline';
      }
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: 验证文件创建成功**

确认 `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/index.html` 已创建

- [ ] **Step 3: 提交**

```bash
git add frontend/index.html
git commit -m "feat: create mobile index.html with input form"
```

---

### Task 3: 创建移动端结果展示页基础结构 (result.html)

**Files:**
- Create: `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/result.html`

**Interfaces:**
- Consumes: `sessionStorage.getItem('paipanResult')` 数据
- Produces: 渲染后的命盘分析结果

- [ ] **Step 1: 创建 result.html 基础结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
  <title>命盘解析结果 - 周易之易</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=beVietnamPro:wght@100..900&family=manrope:wght@100..900&family=sourceSerif4:wght@100..900&display=swap" rel="stylesheet"/>
</head>
<body class="antialiased min-h-screen flex flex-col font-body-md text-body-md bg-surface">
  <!-- TopNavBar -->
  <header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md flex justify-center items-center h-14 border-b border-outline-variant/10">
    <a class="font-headline-lg text-headline-lg text-primary tracking-tight" href="index.html">周易之易</a>
  </header>

  <!-- Top Tab Navigation -->
  <nav class="fixed top-14 left-0 w-full z-40 bg-surface border-b border-outline-variant/10 overflow-x-auto no-scrollbar">
    <div class="flex min-w-max px-2">
      <button class="tab-btn flex-shrink-0 px-4 py-3 font-label-sm text-label-sm text-primary font-bold border-b-2 border-primary" data-tab="1">
        命盘解析
      </button>
      <button class="tab-btn flex-shrink-0 px-4 py-3 font-label-sm text-label-sm text-on-surface-variant border-b-2 border-transparent hover:text-primary" data-tab="2">
        旺衰用神
      </button>
      <button class="tab-btn flex-shrink-0 px-4 py-3 font-label-sm text-label-sm text-on-surface-variant border-b-2 border-transparent hover:text-primary" data-tab="3">
        性格运势
      </button>
      <button class="tab-btn flex-shrink-0 px-4 py-3 font-label-sm text-label-sm text-on-surface-variant border-b-2 border-transparent hover:text-primary" data-tab="4">
        六亲婚恋
      </button>
      <button class="tab-btn flex-shrink-0 px-4 py-3 font-label-sm text-label-sm text-on-surface-variant border-b-2 border-transparent hover:text-primary" data-tab="5">
        健康总结
      </button>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="flex-1 pt-28 pb-6 px-5 flex flex-col gap-5">
    <!-- User Info Section -->
    <section class="flex flex-col items-center gap-3 py-4 border-b border-primary/10">
      <div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
        <span class="material-symbols-outlined text-3xl text-on-surface-variant">person</span>
      </div>
      <h2 class="font-title-md text-title-md text-on-surface" id="sidebar-name">李明</h2>
      <p class="font-label-sm text-label-sm text-on-surface-variant" id="sidebar-pillar">乾造：庚午 己丑 癸巳 乙卯</p>
    </section>

    <!-- Four Pillars Vertical Display -->
    <section class="bg-surface-container-lowest rounded-xl overflow-hidden border border-secondary/20">
      <div id="four-pillars-container" class="divide-y divide-outline-variant/20">
        <!-- Dynamic content: 4 rows for 年柱/月柱/日柱/时柱 -->
      </div>
    </section>

    <!-- Summary Card -->
    <section class="bg-surface-container-lowest rounded-xl p-5 border border-secondary/20">
      <h2 class="font-title-md text-title-md text-on-surface mb-3 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">insights</span> 全局定性
      </h2>
      <p id="pattern-summary" class="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed">--</p>
      <div class="flex flex-wrap gap-3 pt-3 border-t border-primary/10">
        <div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
          <span class="font-label-sm text-label-sm text-on-surface-variant">用神：</span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/60 border border-emerald-700/30"></span>
          <span id="yongshen-list" class="font-body-md text-body-md text-on-surface"></span>
        </div>
        <div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
          <span class="font-label-sm text-label-sm text-on-surface-variant">忌神：</span>
          <span class="w-2.5 h-2.5 rounded-full bg-orange-500/60 border border-orange-700/30"></span>
          <span id="jishen-list" class="font-body-md text-body-md text-on-surface"></span>
        </div>
      </div>
    </section>

    <!-- Tab 1 Content: 命盘解析 -->
    <div id="tab-1" class="tab-content flex flex-col gap-4">
      <!-- 四柱十神 & 原局关键组合 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">dataset_linked</span>
            <h3 class="font-title-md text-title-md text-on-surface">四柱十神 & 原局关键组合</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module1-content" class="flex flex-col gap-4 mt-2">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 地支刑冲合害 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">timeline</span>
            <h3 class="font-title-md text-title-md text-on-surface">地支刑冲合害拆解</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module2-content" class="flex flex-col gap-4 mt-2">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2 Content: 旺衰用神 -->
    <div id="tab-2" class="tab-content flex flex-col gap-4" style="display:none;">
      <!-- 日主旺衰综合判断 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">troubleshoot</span>
            <h3 class="font-title-md text-title-md text-on-surface">日主旺衰综合判断</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module3-wangshuai" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 用神忌神解析 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">insights</span>
            <h3 class="font-title-md text-title-md text-on-surface">用神忌神解析</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module3-yongshen" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 十二长生 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">vital_signs</span>
            <h3 class="font-title-md text-title-md text-on-surface">十二长生旺衰全解</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module4-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3 Content: 性格与人生运势 -->
    <div id="tab-3" class="tab-content flex flex-col gap-4" style="display:none;">
      <!-- 性格心性全面解读 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">psychology</span>
            <h3 class="font-title-md text-title-md text-on-surface">性格心性全面解读</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module5-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 事业财运详解 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">monetization_on</span>
            <h3 class="font-title-md text-title-md text-on-surface">事业财运详解</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module6-caiyun" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 大运走势 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">trending_up</span>
            <h3 class="font-title-md text-title-md text-on-surface">大运走势逻辑</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module9-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 4 Content: 六亲与婚恋子女 -->
    <div id="tab-4" class="tab-content flex flex-col gap-4" style="display:none;">
      <!-- 婚姻家庭 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">favorite</span>
            <h3 class="font-title-md text-title-md text-on-surface">婚姻家庭解读</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module7-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 父母关系 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">escalator_warning</span>
            <h3 class="font-title-md text-title-md text-on-surface">父母关系分析</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module11-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 子女关系 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">child_care</span>
            <h3 class="font-title-md text-title-md text-on-surface">子女关系分析</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module12-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 5 Content: 健康与全局总结 -->
    <div id="tab-5" class="tab-content flex flex-col gap-4" style="display:none;">
      <!-- 健康提示 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">monitor_heart</span>
            <h3 class="font-title-md text-title-md text-on-surface">身体健康重点提示</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module8-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 命局格局 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 class="font-title-md text-title-md text-on-surface">命局格局深度解析</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module13-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
      <!-- 全局总结 -->
      <div class="card">
        <div class="card-header" onclick="toggleCard(this)">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">lightbulb</span>
            <h3 class="font-title-md text-title-md text-on-surface">全局总结 & 现实建议</h3>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant card-icon">expand_more</span>
        </div>
        <div class="card-content">
          <div id="module10-content" class="flex flex-col gap-4">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    </div>
  </main>

  <style>
    /* Tailwind config inline - same as index.html */
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            surface: "#fff8f5",
            "surface-container-lowest": "#ffffff",
            "surface-container-low": "#fbf2ed",
            "surface-container-high": "#efe6e2",
            "surface-container-highest": "#e9e1dc",
            "on-surface": "#1e1b18",
            "on-surface-variant": "#4d453c",
            "primary": "#715b3e",
            "primary-container": "#8b7355",
            "on-primary": "#ffffff",
            "on-primary-container": "#0a0400",
            "secondary": "#725a3d",
            "secondary-container": "#fbdab5",
            "on-secondary-container": "#765f41",
            "outline-variant": "#d1c4b9",
            error: "#ba1a1a",
            "on-error": "#ffffff",
            "error-container": "#ffdad6",
            "on-error-container": "#93000a"
          },
          fontFamily: {
            "body-md": ["manrope"],
            "title-md": ["manrope"],
            "label-sm": ["beVietnamPro"],
            "display-lg": ["sourceSerif4"],
            "headline-lg": ["sourceSerif4"]
          },
          fontSize: {
            "body-md": ["16px", { lineHeight: "1.7", fontWeight: "400" }],
            "body-lg": ["18px", { lineHeight: "1.8", fontWeight: "400" }],
            "title-md": ["20px", { lineHeight: "1.5", fontWeight: "600" }],
            "label-sm": ["13px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
            "display-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
            "headline-lg": ["24px", { lineHeight: "1.3", fontWeight: "600" }]
          }
        }
      }
    };

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .card {
      background-color: #ffffff;
      border: 1px solid rgba(166, 139, 106, 0.2);
      border-radius: 0.75rem;
      overflow: hidden;
    }
    .card-header {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: #f5ece7;
      transition: background-color 0.2s;
    }
    .card-header:hover { background-color: #efe6e2; }
    .card-content {
      padding: 1rem;
      border-top: 1px solid rgba(209, 196, 185, 0.4);
    }
    .card.collapsed .card-content { display: none; }
    .card.collapsed .card-icon { transform: rotate(-90deg); }
    .card-icon { transition: transform 0.3s ease; }
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .tag-green {
      background-color: #e8f5e9;
      color: #1b5e20;
      border: 1px solid #a5d6a7;
    }
    .tag-red {
      background-color: #fbe9e7;
      color: #bf360c;
      border: 1px solid #ffccbc;
    }
  </style>

  <script>
    // Tab switching
    function switchTab(tabNum) {
      window.scrollTo(0, 0);

      document.querySelectorAll('.tab-btn').forEach(b => {
        if (parseInt(b.dataset.tab) === tabNum) {
          b.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
          b.classList.remove('text-on-surface-variant', 'border-transparent');
        } else {
          b.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
          b.classList.add('text-on-surface-variant', 'border-transparent');
        }
      });

      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = content.id === `tab-${tabNum}` ? 'flex' : 'none';
      });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(parseInt(btn.dataset.tab)));
    });

    // Card collapse/expand
    function toggleCard(header) {
      const card = header.parentElement;
      card.classList.toggle('collapsed');
    }

    // (All data rendering functions from original result.html will be added in Task 4)
  </script>
</body>
</html>
```

- [ ] **Step 2: 验证文件创建成功**

确认 `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/result.html` 已创建

- [ ] **Step 3: 提交**

```bash
git add frontend/result.html
git commit -m "feat: create mobile result.html with tab navigation structure"
```

---

### Task 4: 实现四柱纵向展示和数据渲染

**Files:**
- Modify: `D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/frontend/result.html` (在 `<script>` 中添加四柱渲染逻辑和数据渲染函数)

**Interfaces:**
- Consumes: `sessionStorage.getItem('paipanResult')` JSON数据
- Produces: 四柱卡片HTML、全局定性、用神忌神标签

- [ ] **Step 1: 添加四柱纵向渲染函数**

在 result.html 的 `<script>` 标签末尾，在 `switchTab` 和 `toggleCard` 函数之后，添加以下代码：

```javascript
// Four Pillars Vertical Display
function renderFourPillars(data) {
  const container = document.getElementById('four-pillars-container');
  if (!container || !data) return;

  const basicInfo = data.基础信息 || {};
  const fourPillars = basicInfo.四柱 || '';
  const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
  const pillarSubtitles = ['祖上/早年', '父母/青年', '自身/中年', '子女/晚年'];

  // Parse four pillars: "庚午 己丑 癸巳 乙卯"
  const pillars = fourPillars.split(' ').filter(p => p);

  let html = '';
  pillars.forEach((pillar, index) => {
    const tiangan = pillar.charAt(0);
    const dizhi = pillar.charAt(1);

    // Get related info from modules
    let shishen = '';
    let wangshuai = '';

    const mod1 = data.模块一 || {};
    const tianganList = mod1.天干十神 || [];
    const found = tianganList.find(t => t.天干 === tiangan);
    if (found) shishen = found.十神 || '';

    const mod3 = data.模块三 || {};
    const geju = mod3.格局定性 || '';

    html += `
      <div class="flex items-center justify-between p-4">
        <div class="flex flex-col gap-1">
          <span class="font-label-sm text-label-sm text-primary">${pillarNames[index]}</span>
          <span class="font-headline-lg text-headline-lg text-on-surface font-semibold">${pillar}</span>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="tag tag-green text-xs">${shishen || '—'}</span>
          <span class="font-label-sm text-label-sm text-on-surface-variant">${pillarSubtitles[index]}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Render data from sessionStorage
function renderData(raw) {
  if (!raw) return;

  // Normalize field names (reusing logic from original)
  const data = normalizeAdvancedData(raw);
  normalizeModuleFormats(data);

  // Basic info
  const basicInfo = data.基础信息 || {};
  document.getElementById('sidebar-name').textContent = basicInfo.姓名 || basicInfo.日主 || '用户';
  document.getElementById('sidebar-pillar').textContent = `${basicInfo.乾造坤造 || '乾造'}：${basicInfo.四柱 || ''}`;

  // Four pillars
  renderFourPillars(data);

  // Pattern summary
  const core = data.核心速览 || {};
  document.getElementById('pattern-summary').textContent = core.一句话总结 || core.格局定性 || '';

  // Yongshen tags
  const yongshenList = document.getElementById('yongshen-list');
  yongshenList.innerHTML = '';
  (core.用神 || []).forEach(v => {
    const tag = document.createElement('span');
    tag.className = 'tag tag-green mr-1';
    tag.textContent = v;
    yongshenList.appendChild(tag);
  });

  // Jishen tags
  const jishenList = document.getElementById('jishen-list');
  jishenList.innerHTML = '';
  (core.忌神 || []).forEach(v => {
    const tag = document.createElement('span');
    tag.className = 'tag tag-red mr-1';
    tag.textContent = v;
    jishenList.appendChild(tag);
  });

  // Module rendering calls (simplified for mobile)
  renderModule1(data);
  renderModule2(data);
  renderModule3(data);
  renderModule4(data);
  renderModule5(data);
  renderModule6(data);
  renderModule7(data);
  renderModule8(data);
  renderModule9(data);
  renderModule10(data);
  renderModule11(data);
  renderModule12(data);
  renderModule13(data);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  try {
    const dataStr = sessionStorage.getItem('paipanResult');
    const data = dataStr ? JSON.parse(dataStr) : null;
    renderData(data);
  } catch (e) {
    console.warn('Failed to parse paipanResult:', e);
  }
});
```

- [ ] **Step 2: 添加模块渲染函数（简化版，移动端适配）**

在同一个 `<script>` 标签中，添加以下简化版渲染函数：

```javascript
// Simplified module renderers for mobile

function renderModule1(data) {
  const container = document.getElementById('module1-content');
  if (!container) return;
  const mod1 = data.模块一 || {};

  let html = '';

  // 天干十神
  const tiangan = mod1.天干十神 || [];
  if (tiangan.length > 0) {
    html += '<div class="mb-4"><h4 class="font-label-sm text-label-sm text-primary mb-2">天干十神</h4><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-outline-variant"><th class="py-2 pr-3 text-left text-on-surface-variant">干位</th><th class="py-2 pr-3 text-left text-on-surface-variant">天干</th><th class="py-2 pr-3 text-left text-on-surface-variant">十神</th><th class="py-2 text-left text-on-surface-variant">说明</th></tr></thead><tbody>';
    tiangan.forEach(t => {
      html += `<tr class="border-b border-outline-variant/30"><td class="py-2 pr-3 text-on-surface">${t.干位 || ''}</td><td class="py-2 pr-3 text-on-surface">${t.天干 || ''}</td><td class="py-2 pr-3"><span class="tag tag-green text-xs">${t.十神 || ''}</span></td><td class="py-2 text-on-surface-variant text-xs">${t.说明 || ''}</td></tr>`;
    });
    html += '</tbody></table></div></div>';
  }

  // 原局核心组合
  const combos = mod1.原局核心组合 || [];
  if (combos.length > 0) {
    html += '<div><h4 class="font-label-sm text-label-sm text-primary mb-2">原局核心组合</h4><div class="flex flex-col gap-2">';
    combos.forEach((combo, i) => {
      html += `<div class="p-3 bg-surface-container-low rounded-lg"><div class="flex items-center gap-2 mb-1"><span class="font-label-sm text-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded">组合${i+1}</span><span class="font-label-sm text-label-sm text-on-surface-variant">${combo.组合类型 || ''}</span></div><div class="font-body-md text-body-md text-on-surface font-medium text-sm">${combo.组合名称 || ''}</div><div class="font-body-md text-body-md text-on-surface-variant text-xs mt-1">${combo.象义 || combo.描述 || ''}</div></div>`;
    });
    html += '</div></div>';
  }

  container.innerHTML = html || '<p class="text-on-surface-variant text-sm">暂无数据</p>';
}

function renderModule2(data) {
  const container = document.getElementById('module2-content');
  if (!container) return;
  const mod2 = data.模块二 || {};
  const conflicts = mod2.刑冲合害列表 || [];

  if (conflicts.length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm">暂无数据</p>';
    return;
  }

  let html = '';
  conflicts.forEach(conf => {
    html += `<div class="relative pl-6 mb-4"><div class="absolute left-0 top-1 w-5 h-5 rounded-full bg-surface border-2 border-primary flex items-center justify-center"><div class="w-1.5 h-1.5 rounded-full bg-primary"></div></div><h4 class="font-title-md text-title-md text-on-surface mb-1 text-sm">${conf.名称 || ''} <span class="text-xs text-on-surface-variant">(${conf.类型 || ''})</span></h4>${conf.核心定义 ? `<p class="font-body-md text-body-md text-on-surface font-medium text-xs mb-1">${conf.核心定义}</p>` : ''}${conf.人事心性象义 ? `<p class="font-body-md text-body-md text-on-surface-variant text-xs">${conf.人事心性象义}</p>` : ''}</div>`;
  });

  if (mod2.模块小结) {
    html += `<div class="bg-primary/5 border border-primary/20 p-3 rounded-lg mt-4"><h4 class="font-label-sm text-label-sm text-primary mb-1">地支总结</h4><p class="font-body-md text-body-md text-on-surface-variant text-xs">${mod2.模块小结}</p></div>`;
  }

  container.innerHTML = html;
}

function renderModule3(data) {
  const wangshuaiContainer = document.getElementById('module3-wangshuai');
  const yongshenContainer = document.getElementById('module3-yongshen');
  const mod3 = data.模块三 || {};

  // 旺衰判断
  if (wangshuaiContainer) {
    const wangshuai = mod3.旺衰判断 || {};
    let html = '';
    if (Object.keys(wangshuai).length > 0) {
      html += '<div class="mb-4"><h4 class="font-label-sm text-label-sm text-primary mb-2">旺衰判断</h4><div class="flex flex-col gap-2">';
      if (wangshuai.得令) html += `<div class="bg-surface-container-low p-3 rounded-lg border-l-2 border-emerald-500"><div class="font-label-sm text-label-sm text-emerald-600 mb-1">得令</div><p class="font-body-md text-body-md text-on-surface-variant text-xs">${wangshuai.得令}</p></div>`;
      if (wangshuai.得地) html += `<div class="bg-surface-container-low p-3 rounded-lg border-l-2 border-blue-500"><div class="font-label-sm text-label-sm text-blue-600 mb-1">得地</div><p class="font-body-md text-body-md text-on-surface-variant text-xs">${wangshuai.得地}</p></div>`;
      if (wangshuai.得势) html += `<div class="bg-surface-container-low p-3 rounded-lg border-l-2 border-amber-500"><div class="font-label-sm text-label-sm text-amber-600 mb-1">得势</div><p class="font-body-md text-body-md text-on-surface-variant text-xs">${wangshuai.得势}</p></div>`;
      html += '</div></div>';
    }
    if (mod3.格局定性) {
      html += `<div class="bg-surface-container-low p-3 rounded-lg"><span class="font-label-sm text-label-sm text-on-surface-variant">格局定性：</span><span class="font-body-md text-body-md text-on-surface font-medium text-sm">${mod3.格局定性}</span></div>`;
    }
    wangshuaiContainer.innerHTML = html || '<p class="text-on-surface-variant text-sm">暂无数据</p>';
  }

  // 用神忌神
  if (yongshenContainer) {
    const yongshenData = mod3.喜忌用神 || {};
    const firstGod = yongshenData.第一用神 || '';
    const avoidGod = yongshenData.忌神 || '';
    const logic = yongshenData.取用逻辑 || '';

    let html = '<div class="flex flex-col gap-3">';
    if (firstGod) html += `<div class="bg-surface-container-low p-3 rounded-lg border-l-2 border-emerald-500"><div class="flex items-center gap-2 mb-1"><span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span><h4 class="font-label-sm text-label-sm text-emerald-600">用神</h4></div><span class="tag tag-green text-sm">${firstGod}</span></div>`;
    if (avoidGod) html += `<div class="bg-surface-container-low p-3 rounded-lg border-l-2 border-red-500"><div class="flex items-center gap-2 mb-1"><span class="material-symbols-outlined text-red-600 text-sm">cancel</span><h4 class="font-label-sm text-label-sm text-red-600">忌神</h4></div><span class="tag tag-red text-sm">${avoidGod}</span></div>`;
    if (logic) html += `<div class="bg-surface-container-low p-3 rounded-lg border-l-2 border-primary"><h4 class="font-label-sm text-label-sm text-primary mb-1">取用逻辑</h4><p class="font-body-md text-body-md text-on-surface-variant text-xs">${logic}</p></div>`;
    html += '</div>';
    yongshenContainer.innerHTML = html || '<p class="text-on-surface-variant text-sm">暂无数据</p>';
  }
}

function renderModule4(data) {
  const container = document.getElementById('module4-content');
  if (!container) return;
  const mod4 = data.模块四 || {};
  const pillarAnalysis = mod4.逐柱分析 || {};

  if (Object.keys(pillarAnalysis).length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm">暂无数据</p>';
    return;
  }

  const pillarNames = { '年支': '年柱', '月支': '月柱', '日支': '日支', '时支': '时支' };
  const pillarSubtitles = { '年支': '祖上/早年', '月支': '父母/青年', '日支': '自身/中年', '时支': '子女/晚年' };

  let html = '<div class="grid grid-cols-2 gap-3">';
  Object.keys(pillarAnalysis).forEach(key => {
    const val = pillarAnalysis[key] || {};
    html += `<div class="bg-surface border border-outline-variant/20 rounded-lg p-3 text-center"><span class="font-label-sm text-label-sm text-outline block">${pillarNames[key] || key}</span><span class="font-label-sm text-label-sm text-on-surface-variant block mb-2">${pillarSubtitles[key] || ''}</span><div class="bg-surface-container-low rounded-lg p-2 mb-1"><span class="font-body-md text-body-md text-primary font-medium text-sm">${val.理法 || val.状态 || '—'}</span></div><span class="font-body-sm text-on-surface-variant text-xs">${val.象法 || '—'}</span></div>`;
  });
  html += '</div>';

  if (mod4.总结) html += `<div class="mt-3 p-3 bg-surface-container-low rounded-lg"><p class="font-body-md text-body-md text-on-surface-variant text-xs">${mod4.总结}</p></div>`;

  container.innerHTML = html;
}

function renderModule5(data) {
  const container = document.getElementById('module5-content');
  if (!container) return;
  const mod5 = data.模块五 || {};

  let html = '';
  if (mod5.性格优点) html += `<div class="flex gap-3 bg-surface-container-low p-3 rounded-lg"><span class="material-symbols-outlined text-emerald-600">thumb_up</span><div><strong class="block mb-1 text-emerald-600 text-sm">性格优点</strong><p class="text-on-surface-variant text-xs">${mod5.性格优点}</p></div></div>`;
  if (mod5.性格短板) html += `<div class="flex gap-3 bg-surface-container-low p-3 rounded-lg mt-2"><span class="material-symbols-outlined text-red-600">thumb_down</span><div><strong class="block mb-1 text-red-600 text-sm">性格短板</strong><p class="text-on-surface-variant text-xs">${mod5.性格短板}</p></div></div>`;
  if (mod5.核心心性痛点) html += `<div class="flex gap-3 bg-surface-container-low p-3 rounded-lg mt-2"><span class="material-symbols-outlined text-blue-600">warning</span><div><strong class="block mb-1 text-blue-600 text-sm">核心心性痛点</strong><p class="text-on-surface-variant text-xs">${mod5.核心心性痛点}</p></div></div>`;

  container.innerHTML = html || '<p class="text-on-surface-variant text-sm">暂无数据</p>';
}

function renderModule6(data) {
  const container = document.getElementById('module6-caiyun');
  if (!container) return;
  const mod6 = data.模块六 || {};

  const items = [
    { icon: 'work_history', title: '财运格局', content: mod6.财运格局 },
    { icon: 'trending_up', title: '求财特质', content: mod6.求财特质 },
    { icon: 'savings', title: '守财建议', content: mod6.守财建议 },
    { icon: 'domain', title: '事业方向', content: mod6.事业方向 }
  ].filter(i => i.content);

  if (items.length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm">暂无数据</p>';
    return;
  }

  let html = '';
  items.forEach((item, idx) => {
    if (idx > 0) html += '<div class="h-px w-full bg-outline-variant/30 my-3"></div>';
    html += `<div class="flex items-start gap-3"><div class="bg-primary-container/20 p-2 rounded-lg text-primary shrink-0"><span class="material-symbols-outlined text-sm">${item.icon}</span></div><div><strong class="block text-secondary mb-1 text-sm">${item.title}</strong><p class="text-on-surface-variant text-xs">${item.content}</p></div></div>`;
  });

  container.innerHTML = html;
}

function renderModule7(data) {
  const container = document.getElementById('module7-content');
  if (!container) return;
  const mod7 = data.模块七 || {};

  const items = [
    { icon: 'home', title: '夫妻宫状态', content: mod7.夫妻宫状态 },
    { icon: 'person', title: '配偶特质', content: mod7.配偶特质 },
    { icon: 'heart_minus', title: '感情核心问题', content: mod7.感情核心问题 },
    { icon: 'favorite', title: '情缘特点', content: mod7.情缘特点 }
  ].filter(i => i.content);

  if (items.length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm">暂无数据</p>';
    return;
  }

  let html = '';
  items.forEach(item => {
    html += `<div class="flex gap-3 bg-surface-container-low p-3 rounded-lg"><span class="material-symbols-outlined text-primary shrink-0">${item.icon}</span><div><strong class="block mb-1 text-secondary text-sm">${item.title}</strong><p class="text-on-surface-variant text-xs">${item.content}</p></div></div>`;
  });

  container.innerHTML = html;
}

function renderModule8(data) {
  const container = document.getElementById('module8-content');
  if (!container) return;
  const mod8 = data.模块八 || {};
  const healthData = mod8.健康隐患 || mod8;

  let sections = [];
  if (Array.isArray(healthData)) {
    sections = healthData.map(item => ({ title: item.部位 || item.系统 || '健康', content: item.提示 || item.建议 || '' }));
  } else if (healthData && typeof healthData === 'object') {
    if (healthData.重点养护部位) sections.push({ title: '重点养护部位', content: healthData.重点养护部位 });
    if (healthData.先天体质隐患) sections.push({ title: '先天体质隐患', content: healthData.先天体质隐患 });
    if (healthData.高发问题) sections.push({ title: '高发问题', content: healthData.高发问题 });
    if (healthData.养生建议) sections.push({ title: '养生建议', content: healthData.养生建议 });
  }

  if (sections.length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm">暂无数据</p>';
    return;
  }

  let html = '<div class="grid grid-cols-2 gap-3">';
  sections.forEach(section => {
    html += `<div class="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20"><h3 class="font-label-sm text-label-sm text-secondary mb-1">${section.title}</h3><p class="font-body-md text-body-md text-on-surface text-xs">${section.content}</p></div>`;
  });
  html += '</div>';

  container.innerHTML = html;
}

function renderModule9(data) {
  const container = document.getElementById('module9-content');
  if (!container) return;
  const mod9 = data.模块九 || {};

  if (!mod9.大运序列 || mod9.大运序列.length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm">暂无数据</p>';
    return;
  }

  let html = '<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead><tr class="border-b border-outline-variant"><th class="py-2 pr-3 text-on-surface-variant">岁数</th><th class="py-2 pr-3 text-on-surface-variant">干支</th><th class="py-2 pr-3 text-on-surface-variant">吉凶</th><th class="py-2 text-on-surface-variant">核心利弊</th></tr></thead><tbody>';
  mod9.大运序列.forEach(d => {
    const jixiong = d.吉凶定性 || '';
    const colorClass = jixiong === '吉' ? 'text-emerald-600' : jixiong === '凶' ? 'text-red-600' : 'text-amber-600';
    html += `<tr class="border-b border-outline-variant/30"><td class="py-2 pr-3 font-medium">${d.岁数 || ''}</td><td class="py-2 pr-3">${d.天干地支 || ''}</td><td class="py-2 pr-3 ${colorClass} font-medium">${jixiong}</td><td class="py-2">${d.核心利弊 || ''}</td></tr>`;
  });
  html += '</tbody></table></div>';

  if (mod9.大运总逻辑) html += `<div class="mt-3 p-3 bg-surface-container-low rounded-lg border-l-2 border-primary"><p class="text-on-surface-variant text-xs">${mod9.大运总逻辑}</p></div>`;

  container.innerHTML = html;
}

function renderModule10(data) {
  const container = document.getElementById('module10-content');
  if (!container) return;
  const mod10 = data.模块十 || {};
  const prosCons = mod10.全局优劣势 || {};
  const landingAdvice = mod10.落地建议;

  let html = '';

  if (prosCons.最大优势) html += `<div class="mb-3"><h4 class="font-label-sm text-label-sm text-emerald-600 mb-1">最大优势</h4><p class="text-on-surface-variant text-xs">${prosCons.最大优势}</p></div>`;
  if (prosCons.核心短板) html += `<div class="mb-3"><h4 class="font-label-sm text-label-sm text-red-600 mb-1">核心短板</h4><p class="text-on-surface-variant text-xs">${prosCons.核心短板}</p></div>`;

  if (landingAdvice && typeof landingAdvice === 'object') {
    const categories = ['事业', '求财', '人际', '婚姻', '养生', '心态', '避坑'];
    const icons = { 事业: 'work', 求财: 'paid', 人际: 'people', 婚姻: 'favorite', 养生: 'spa', 心态: 'psychology', 避坑: 'warning' };
    html += '<div class="grid grid-cols-2 gap-2 mt-3">';
    categories.forEach(cat => {
      if (landingAdvice[cat]) html += `<div class="bg-surface-container-low p-2 rounded-lg"><div class="flex items-center gap-1 mb-1"><span class="material-symbols-outlined text-primary text-xs">${icons[cat]}</span><span class="font-label-sm text-label-sm text-primary">${cat}</span></div><p class="text-on-surface-variant text-xs">${landingAdvice[cat]}</p></div>`;
    });
    html += '</div>';
  }

  container.innerHTML = html || '<p class="text-on-surface-variant text-sm">暂无数据</p>';
}

function renderModule11(data) {
  const container = document.getElementById('module11-content');
  if (!container) return;
  const mod11 = data.模块十一 || {};

  let html = '';
  if (mod11.父亲) html += `<div class="bg-surface-container-low p-3 rounded-lg mb-2"><h4 class="font-label-sm text-label-sm text-primary mb-1">父亲</h4><p class="text-on-surface-variant text-xs">${typeof mod11.父亲 === 'string' ? mod11.父亲 : mod11.父亲.性格 || mod11.父亲.事业 || ''}</p></div>`;
  if (mod11.母亲) html += `<div class="bg-surface-container-low p-3 rounded-lg mb-2"><h4 class="font-label-sm text-label-sm text-primary mb-1">母亲</h4><p class="text-on-surface-variant text-xs">${typeof mod11.母亲 === 'string' ? mod11.母亲 : mod11.母亲.性格 || mod11.母亲.事业 || ''}</p></div>`;
  if (mod11.原生家庭格局) html += `<div class="bg-surface-container-low p-3 rounded-lg border-l-2 border-primary"><h4 class="font-label-sm text-label-sm text-primary mb-1">原生家庭格局</h4><p class="text-on-surface-variant text-xs">${mod11.原生家庭格局}</p></div>`;

  container.innerHTML = html || '<p class="text-on-surface-variant text-sm">暂无数据</p>';
}

function renderModule12(data) {
  const container = document.getElementById('module12-content');
  if (!container) return;
  const mod12 = data.模块十二 || {};

  const items = [
    { icon: 'schedule', title: '时机与缘分', content: mod12.子女缘分 },
    { icon: 'emoji_objects', title: '性格禀赋', content: mod12.子女性格天赋 },
    { icon: 'handshake', title: '情感羁绊', content: mod12.亲子关系 }
  ].filter(i => i.content);

  if (items.length === 0) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm">暂无数据</p>';
    return;
  }

  let html = '<div class="grid grid-cols-1 gap-3">';
  items.forEach(item => {
    html += `<div class="bg-surface-container-low p-3 rounded-lg"><div class="flex items-center gap-2 mb-1"><span class="material-symbols-outlined text-primary">${item.icon}</span><h4 class="font-label-sm text-label-sm text-primary">${item.title}</h4></div><p class="text-on-surface-variant text-xs">${item.content}</p></div>`;
  });
  html += '</div>';

  container.innerHTML = html;
}

function renderModule13(data) {
  const container = document.getElementById('module13-content');
  if (!container) return;
  const mod13 = data.模块十三 || {};

  let html = '';

  if (mod13.格局深度拆解) {
    html += '<div class="mb-3"><h4 class="font-label-sm text-label-sm text-primary mb-2">格局深度拆解</h4>';
    if (typeof mod13.格局深度拆解 === 'string') {
      html += `<p class="text-on-surface-variant text-xs">${mod13.格局深度拆解}</p>`;
    }
    html += '</div>';
  }

  if (mod13.人事终极规律 || mod13.终极规律) {
    const renshi = mod13.人事终极规律 || mod13.终极规律;
    html += '<div><h4 class="font-label-sm text-label-sm text-primary mb-2">人事终极规律</h4>';
    if (typeof renshi === 'string') {
      html += `<p class="text-on-surface-variant text-xs">${renshi}</p>`;
    }
    html += '</div>';
  }

  container.innerHTML = html || '<p class="text-on-surface-variant text-sm">暂无数据</p>';
}

// normalizeAdvancedData and normalizeModuleFormats functions from original
function normalizeAdvancedData(raw) {
  const data = {};
  const isVariantB = !!raw['模块一：四柱、藏干、十神 & 原局核心组合'];
  if (isVariantB) {
    const map = {
      '前置基础信息': '基础信息',
      '模块一：四柱、藏干、十神 & 原局核心组合': '模块一',
      '模块二：地支刑冲合害完整拆解': '模块二',
      '模块三：日主旺衰 + 格局定性 + 喜忌取用': '模块三',
      '模块四：日主十二长生旺衰全解': '模块四',
      '模块五：性格心性深度解读': '模块五',
      '模块六：事业财运专项解析': '模块六',
      '模块七：婚姻感情家庭解析': '模块七',
      '模块八：身体健康专项提示': '模块八',
      '模块九：大运整体逻辑解析': '模块九',
      '模块十：全局总结 + 现实落地建议': '模块十',
      '模块十一：父母六亲解析': '模块十一',
      '模块十二：子女六亲解析': '模块十二',
      '模块十三：命局格局深度复盘': '模块十三',
    };
    for (const [k, v] of Object.entries(raw)) {
      if (map[k]) data[map[k]] = v;
    }
    if (raw.基础信息 && typeof raw.基础信息 === 'object') {
      const jc = Object.assign({}, raw.基础信息);
      if (jc['乾造/坤造']) jc['乾造坤造'] = jc['乾造/坤造'];
      if (jc['完整四柱']) jc['四柱'] = jc['完整四柱'];
      data['基础信息'] = jc;
    }
    if (typeof raw.核心标注 === 'string') {
      data['核心速览'] = { '一句话总结': raw.基础概况 || raw.核心标注, '格局定性': '', '用神': [], '忌神': [] };
    } else if (typeof raw.核心标注 === 'object' && raw.核心标注) {
      data['核心速览'] = { '一句话总结': raw.核心标注.全局核心关键词 || '', '格局定性': '', '用神': [], '忌神': [] };
    }
    if (typeof raw.基础概况 === 'string') {
      data['基础概况'] = { '身旺/身弱/中和': '', '格局类型': '', '整体优缺点': raw.基础概况 };
    } else if (typeof raw.基础概况 === 'object' && raw.基础概况) {
      data['基础概况'] = raw.基础概况;
    }
  } else {
    if (raw.基础信息 && typeof raw.基础信息 === 'object') {
      const jc = Object.assign({}, raw.基础信息);
      if (jc['乾造/坤造']) jc['乾造坤造'] = jc['乾造/坤造'];
      if (jc['完整四柱']) jc['四柱'] = jc['完整四柱'];
      if (jc.四柱 && typeof jc.四柱 === 'object') {
        jc['四柱'] = [jc.四柱.年柱, jc.四柱.月柱, jc.四柱.日柱, jc.四柱.时柱].join(' ');
      }
      data['基础信息'] = jc;
    }
    if (raw.核心速览) data['核心速览'] = Object.assign({}, raw.核心速览);
    if (raw.基础概况) data['基础概况'] = typeof raw.基础概况 === 'string' ? { '身旺/身弱/中和': '', '格局类型': '', '整体优缺点': raw.基础概况 } : Object.assign({}, raw.基础概况);
    const moduleKeys = ['模块一','模块二','模块三','模块四','模块五','模块六','模块七','模块八','模块九','模块十','模块十一','模块十二','模块十三'];
    for (const k of moduleKeys) { if (raw[k]) data[k] = Object.assign({}, raw[k]); }
  }
  return data;
}

function normalizeModuleFormats(data) {
  if (!data || typeof data !== 'object') return data;
  const m3 = data.模块三;
  if (m3 && typeof m3 === 'object' && !Array.isArray(m3)) {
    if (m3.喜忌取用 && !m3.喜忌用神) { m3.喜忌用神 = m3.喜忌取用; delete m3.喜忌取用; }
  }
  const m5 = data.模块五;
  if (m5 && typeof m5 === 'object' && !Array.isArray(m5)) {
    if (!m5.性格优点) m5.性格优点 = m5.优点 || m5.优点特质 || '';
    if (!m5.性格短板) m5.性格短板 = m5.缺点 || m5.短板缺陷 || '';
  }
  const m7 = data.模块七;
  if (m7 && typeof m7 === 'object' && !Array.isArray(m7)) {
    if (!m7.夫妻宫状态) m7.夫妻宫状态 = m7.夫妻宫 ? m7.夫妻宫 + (m7.婚姻状态 ? '，' + m7.婚姻状态 : '') : '';
  }
  const m8 = data.模块八;
  if (m8 && typeof m8 === 'object' && !Array.isArray(m8)) {
    data.模块八 = { '健康隐患': { '重点养护部位': m8.重点部位 || '', '先天体质隐患': m8.健康隐患 || '', '高发问题': m8.高发问题 || '', '养生建议': m8.养生建议 || '' } };
  }
  return data;
}
```

- [ ] **Step 2: 验证代码添加成功**

确认 result.html 中的 `<script>` 标签包含了所有渲染函数

- [ ] **Step 3: 提交**

```bash
git add frontend/result.html
git commit -m "feat: implement four pillars vertical display and module rendering"
```

---

### Task 5: 验证与测试

**Files:**
- Modify: 确保 `backend/package.json` 中 scripts 正确

- [ ] **Step 1: 安装后端依赖**

```bash
cd D:/Software/ClaudeCodeProject/zhouyi_seg1_mob/backend
npm install
```

- [ ] **Step 2: 启动后端服务测试**

```bash
npm start
```

确认服务启动在端口 3000

- [ ] **Step 3: 使用浏览器访问前端**

打开浏览器访问 `http://localhost:3000`，验证：
1. index.html 表单页面正常显示
2. 填写表单并提交
3. 跳转 result.html 并正确渲染数据

- [ ] **Step 4: 测试移动端视口**

使用浏览器开发者工具切换到移动端视口模式（iPhone SE / Pixel 5），验证：
1. 布局正常，无横向溢出
2. 顶部Tab可正常切换
3. 卡片折叠/展开正常
4. 四柱纵向展示正常

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "test: verify mobile layout and data rendering"
```

---

## 实施检查清单

- [ ] Task 1: 项目初始化完成
- [ ] Task 2: 移动端录入页创建完成
- [ ] Task 3: 移动端结果页基础结构完成
- [ ] Task 4: 四柱展示和数据渲染完成
- [ ] Task 5: 验证测试完成

---

**文档版本**: 1.0
**创建日期**: 2026-09-20
**状态**: 等待执行
