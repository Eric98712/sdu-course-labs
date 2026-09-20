# RF-GPT Presentation - Design Spec

> Human-readable design narrative — rationale, audience, style, color choices, content outline.

## I. Project Information

| Item | Value |
| ---- | ----- |
| **Project Name** | RF-GPT Presentation |
| **Canvas Format** | PPT 16:9 (1280×720) |
| **Page Count** | 14 pages |
| **Design Style** | General Versatile — Academic Tech |
| **Target Audience** | IoT Engineering students/peers; basic wireless knowledge, not RF experts |
| **Use Case** | Academic paper presentation / lab group meeting |
| **Created Date** | 2026-05-03 |

---

## II. Canvas Specification

| Property | Value |
| -------- | ----- |
| **Format** | PPT 16:9 |
| **Dimensions** | 1280×720 |
| **viewBox** | `0 0 1280 720` |
| **Margins** | Left/right 60px, top/bottom 50px |
| **Content Area** | 1160×620 (from (60,50) to (1220,670)) |

---

## III. Visual Theme

### Theme Style

- **Style**: General Versatile — Academic
- **Theme**: Light theme
- **Tone**: Professional, tech-oriented, clean, data-driven

### Color Scheme

| Role | HEX | Purpose |
| ---- | --- | ------- |
| **Background** | `#FFFFFF` | Page background |
| **Secondary bg** | `#F5F7FA` | Card background, section background |
| **Primary** | `#1565C0` | Title decorations, key sections, icons |
| **Accent** | `#FF6F00` | Data highlights, key numbers, emphasis |
| **Secondary accent** | `#0D47A1` | Secondary emphasis, gradient transitions |
| **Body text** | `#263238` | Main body text |
| **Secondary text** | `#546E7A` | Captions, annotations |
| **Tertiary text** | `#90A4AE` | Supplementary info, footers |
| **Border/divider** | `#E0E0E0` | Card borders, divider lines |
| **Success** | `#2E7D32` | Positive indicators (RF-GPT high scores) |
| **Warning** | `#C62828` | Issue markers (general VLM failures) |

### Gradient Scheme

```xml
<!-- Title gradient -->
<linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#1565C0"/>
  <stop offset="100%" stop-color="#0D47A1"/>
</linearGradient>

<!-- Background decorative gradient -->
<radialGradient id="bgDecor" cx="85%" cy="15%" r="60%">
  <stop offset="0%" stop-color="#1565C0" stop-opacity="0.08"/>
  <stop offset="100%" stop-color="#1565C0" stop-opacity="0"/>
</radialGradient>

<!-- Accent gradient -->
<linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="#FF6F00"/>
  <stop offset="100%" stop-color="#FFA000"/>
</linearGradient>
```

---

## IV. Typography System

**Typography direction**: Modern CJK sans-serif — clean, professional academic look.

| Role | Chinese | English | Fallback tail |
| ---- | ------- | ------- | ------------- |
| **Title** | `"Microsoft YaHei", "PingFang SC"` | `Arial` | `sans-serif` |
| **Body** | `"Microsoft YaHei", "PingFang SC"` | `Arial` | `sans-serif` |
| **Emphasis** | `"Microsoft YaHei", "PingFang SC"` | `Arial` | `sans-serif` |
| **Code** | — | `Consolas, "Courier New"` | `monospace` |

**Per-role font stacks**:

- Title: `Arial, "Microsoft YaHei", "PingFang SC", sans-serif`
- Body: `Arial, "Microsoft YaHei", "PingFang SC", sans-serif`
- Emphasis: *same as Body*
- Code: `Consolas, "Courier New", monospace`

### Font Size Hierarchy

**Baseline**: Body font size = 22px

| Purpose | Ratio to body | Size @ body=22 | Weight |
| ------- | ------------- | -------------- | ------ |
| Cover title | 3.5x | 77px | Bold |
| Section title (page title) | 1.8x | 40px | Bold |
| Subtitle / section label | 1.3x | 29px | SemiBold |
| **Body content** | **1x** | **22px** | Regular |
| Bullet point | 0.95x | 21px | Regular |
| Annotation / caption | 0.75x | 16px | Regular |
| Page number / footnote | 0.55x | 12px | Regular |
| Hero number (KPI) | 2.5x | 55px | Bold |

---

## V. Layout Principles

### Page Structure

- **Header area**: 0-60px top — page title bar with primary-color left accent bar + title text
- **Content area**: 60-650px — main content with cards, text, data
- **Footer area**: 650-720px — page number, subtle divider line

### Layout Pattern Library (selected for this deck)

| Pattern | Suitable Scenarios |
| ------- | ----------------- |
| **Single column centered** | Cover, concluding page, Q&A |
| **Top-bottom split** | Architecture diagram + explanation |
| **Three-column cards** | Feature lists, comparison items |
| **Asymmetric split (3:7)** | Data chart + key takeaway |
| **Matrix grid (2×2)** | Quadrant comparison, related works |
| **Full-bleed + floating text** | Section dividers / chapter openers |

### Spacing Specification

**Universal**:
| Element | Value |
| ------- | ----- |
| Safe margin from canvas edge | 60px |
| Content block gap | 32px |
| Icon-text gap | 12px |

**Card-based layouts**:
| Element | Value |
| ------- | ----- |
| Card gap | 24px |
| Card padding | 24px |
| Card border radius | 10px |
| Single-row card height | 540px |
| Three-column card width | 360px |

---

## VI. Icon Usage Specification

### Source

- **Built-in icon library**: `templates/icons/` — use `chunk-filled` family for consistency

### Recommended Icon List

| Purpose | Icon Path | Page |
| ------- | --------- | ---- |
| AI / Brain | `chunk-filled/ai-brain` | Cover, Slide 02 |
| Wireless signal | `chunk-filled/wireless-signal` | Slide 03, 04 |
| Architecture | `chunk-filled/layers` | Slide 05 |
| Data / Chart | `chunk-filled/data-chart` | Slide 10, 11 |
| Comparison | `chunk-filled/comparison` | Slide 12 |
| Future / Arrow | `chunk-filled/arrow-forward` | Slide 13 |

---

## VII. Visualization Reference List

No data charts (bar/line/pie) needed — results are presented as formatted tables and KPI hero numbers. Runners-up considered: grouped_bar_chart (rejected: benchmark accuracy data fits table format better for side-by-side comparison with baselines).

---

## VIII. Image Resource List

| Filename | Dimensions | Ratio | Purpose | Type | Status | Description |
| -------- | --------- | ----- | ------- | ---- | ------ | ----------- |
| cover_bg.png | 1280×720 | 16:9 | Cover background | Background | Placeholder | Abstract wireless signal visualization, blue tech style |
| architecture.png | 800×500 | 16:10 | RF-GPT architecture diagram | Diagram | Placeholder | RF-GPT three-component architecture figure |
| results_wbmc.png | 800×450 | 16:9 | WBMC benchmark results | Diagram | Placeholder | Bar chart comparing RF-GPT vs baselines on WBMC |
| results_wbod.png | 800×450 | 16:9 | WBOD benchmark results | Diagram | Placeholder | Bar chart comparing RF-GPT vs baselines on WBOD |
| results_wtr.png | 800×450 | 16:9 | WTR confusion matrix | Diagram | Placeholder | Confusion matrix for wireless tech recognition |

---

## IX. Content Outline

### Part 1: Introduction & Motivation

#### Slide 01 — Cover

- **Layout**: Full canvas background + centered text
- **Title**: RF-GPT: Teaching AI to See the Wireless World
- **Subtitle**: 射频大模型——让AI"看懂"无线电
- **Info**: Hang Zou et al. | arXiv:2602.14833 | 2026

#### Slide 02 — 汇报提纲

- **Layout**: Card grid (3 columns)
- **Title**: 汇报提纲
- **Content**:
  - 01 背景：为什么需要"会看频谱"的AI？
  - 02 RF-GPT 核心思路
  - 03 数据合成：没有真实标注怎么办？
  - 04 实验评估
  - 05 相关工作对比
  - 06 总结与展望

### Part 2: Background

#### Slide 03 — 大模型的成功与射频信号的缺席

- **Layout**: Three-column cards
- **Title**: 大模型的成功与缺失的一环
- **Content**:
  - Card 1: LLM 成就 — GPT-4o, Gemini, LLaMA (文本/代码/推理)
  - Card 2: 多模态扩展 — VLM"看懂"图像, Whisper"听懂"音频
  - Card 3: RF 缺席 — 无线通信物理层尚未被任何大模型原生支持

#### Slide 04 — 传统射频智能的四重困境

- **Layout**: 2×2 matrix grid
- **Title**: 传统射频智能的困境
- **Content**:
  - Quadrant 1: 任务特定模型 — 每任务需独立架构/数据/训练
  - Quadrant 2: 数据标注昂贵 — 需专家+硬件+长时间采集
  - Quadrant 3: 缺乏泛化 — 换SNR/信道环境就失效
  - Quadrant 4: 无交互界面 — 只输出标签，无法解释"为什么"

### Part 3: RF-GPT Core

#### Slide 05 — RF-GPT 核心架构

- **Layout**: Top-bottom split (top: architecture, bottom: explanation)
- **Title**: RF-GPT 核心架构
- **Content**:
  - Top: 三大组件示意图 — RF编码器 → RF适配器 → Decoder-only LLM
  - Bottom: 关键洞察 — 把RF信号转为频谱图，利用VLM视觉编码能力处理
  - 类比：就像医生看心电图诊断，RF-GPT将无线电波转为频谱图"诊断"无线环境

#### Slide 06 — 为什么选频谱图而非原始IQ？

- **Layout**: Asymmetric split (3:7)
- **Title**: 为什么选频谱图？
- **Content**:
  - Left: 频谱图优势列表: (1) IQ采样率过高, (2) 频谱图是天然时频表示, (3) 可复用预训练视觉编码器
  - Right: 六种无线技术频谱图示例展示 (5G NR, LTE, UMTS, WLAN, DVB-S2, Bluetooth)

### Part 4: Data Pipeline

#### Slide 07 — 合成数据生成：六种无线技术

- **Layout**: Card grid (3 columns × 2 rows)
- **Title**: 合成数据：六种无线技术
- **Content**:
  - Row 1: 5G NR / LTE / UMTS
  - Row 2: WLAN (802.11ax/be) / DVB-S2 / Bluetooth
  - Bottom note: ~12,000 RF场景, ~625,000 指令-答案对, 零人工标注

#### Slide 08 — 自动化标注与指令合成管线

- **Layout**: Top-bottom split
- **Title**: 自动化标注管线
- **Content**:
  - Top: Pipeline 流程图 — 波形生成 → 确定性标注(元数据) → 结构化描述 → LLM指令合成
  - Bottom: 5个信息层级 — 摘要 / 全局视觉 / 全局上下文 / 信号视觉 / 信号上下文

### Part 5: Experiments

#### Slide 09 — 通用VLM毫无RF先验

- **Layout**: Asymmetric split (3:7)
- **Title**: 通用VLM毫无RF先验
- **Content**:
  - Left: Qwen2.5-VL vs RF-GPT 回答对比 (一句话总结差距)
  - Right: 五大基准任务概述 — WBMC / WBOD / WTR / WNUC / NRIE

#### Slide 10 — WBMC & WBOD 基准结果

- **Layout**: Top-bottom split (two panels)
- **Title**: 调制分类与重叠检测结果
- **Content**:
  - Top (WBMC): 表格 — RF-GPT-7B Easy 82.4% / Medium 74.2% / Hard 47.8% vs 通用VLM <7%
  - Bottom (WBOD): 表格 — RF-GPT-7B Easy 91.5% / Medium 87.6% / Hard 71.7%

#### Slide 11 — WTR / WNUC / NRIE 结果

- **Layout**: Three-column cards
- **Title**: 技术识别 / 用户计数 / NR信息提取
- **Content**:
  - Card 1 (WTR): 99.64% 联合准确率，近乎完美区分6种技术
  - Card 2 (WNUC): 70.17% vs 通用VLM ~23%
  - Card 3 (NRIE): SCS 99.1%, SSB 98.2%, UE计数等

#### Slide 12 — 消融实验

- **Layout**: Three-column cards
- **Title**: 消融实验要点
- **Content**:
  - Card 1: 鲁棒性 — 对CFO/PA/TDL鲁棒, IQ不平衡最具破坏性
  - Card 2: vs CNN/Transformer — RF-GPT-7B (3 epoch) 超越 ViT-H (30 epoch)
  - Card 3: 分辨率影响 — 224→512 带来 ~9pp 增益

### Part 6: Related Work & Conclusion

#### Slide 13 — 与相关工作对比

- **Layout**: Three-column cards
- **Title**: 与相关工作对比
- **Content**:
  - Card 1: RF基础模型 (WFM/LWM/WirelessGPT) — 每任务仍需单独微调
  - Card 2: Telecom LLMs (TelecomGPT) — 文本中心，无法处理物理层
  - Card 3: VLA模型启示 — 都利用预训练VLM+轻量适配器注入新模态

#### Slide 14 — 局限、展望与总结

- **Layout**: Top-bottom split
- **Title**: 总结与展望
- **Content**:
  - Top: 三大贡献 — (1) RFLM概念提出 (2) 合成数据管线 (3) 全面超越通用VLM
  - Bottom: 未来方向 — 真实空口数据 / MIMO扩展 / 细粒度3GPP / 6G集成

#### Slide 15 — Q&A

- **Layout**: Full canvas centered
- **Title**: Thank You / Q&A
- **Content**: 联系方式 + 论文信息

---

## X. Speaker Notes Requirements

Speaker notes per page, saved to `notes/`:
- Filename matches SVG name (e.g., `01_cover.md`, `02_outline.md`)
- Content: key talking points, timing cues, transition phrases

---

## XI. Technical Constraints Reminder

1. viewBox: `0 0 1280 720`
2. Background uses `<rect>` elements
3. Text wrapping uses `<tspan>` (`<foreignObject>` FORBIDDEN)
4. Transparency uses `fill-opacity` / `stroke-opacity`; `rgba()` FORBIDDEN
5. FORBIDDEN: `mask`, `<style>`, `class`, `foreignObject`
6. FORBIDDEN: `textPath`, `animate*`, `script`
7. `<g opacity="...">` FORBIDDEN — set opacity on each child element individually
8. Inline styles only; external CSS FORBIDDEN
