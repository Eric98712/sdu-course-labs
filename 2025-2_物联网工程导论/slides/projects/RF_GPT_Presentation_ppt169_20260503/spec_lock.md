# spec_lock.md — RF-GPT Presentation

> Machine-readable execution contract. Executor MUST `read_file` this file before each SVG page.
> All colors / fonts / icons / images come from this file — no values from memory.

## Canvas

- format: `ppt169`
- viewBox: `0 0 1280 720`
- dimensions: `1280x720`
- margins: `60` (left/right), `50` (top/bottom)
- content_area: `1160x620` (from 60,50 to 1220,670)

## Colors

| Key | HEX |
| --- | --- |
| `bg` | `#FFFFFF` |
| `secondary_bg` | `#F5F7FA` |
| `primary` | `#1565C0` |
| `accent` | `#FF6F00` |
| `secondary_accent` | `#0D47A1` |
| `body_text` | `#263238` |
| `secondary_text` | `#546E7A` |
| `tertiary_text` | `#90A4AE` |
| `border` | `#E0E0E0` |
| `success` | `#2E7D32` |
| `warning` | `#C62828` |
| `card_bg` | `#FFFFFF` |
| `divider` | `#ECEFF1` |

## Gradients

### titleGradient
```
<linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#1565C0"/>
  <stop offset="100%" stop-color="#0D47A1"/>
</linearGradient>
```

### accentGradient
```
<linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="#FF6F00"/>
  <stop offset="100%" stop-color="#FFA000"/>
</linearGradient>
```

## Typography

- `body`: `22` (baseline px)
- `cover_title`: `77`
- `page_title`: `40`
- `subtitle`: `29`
- `hero_number`: `55`
- `body_text`: `22`
- `bullet`: `21`
- `caption`: `16`
- `page_num`: `12`
- `title_family`: `Arial, "Microsoft YaHei", "PingFang SC", sans-serif`
- `body_family`: `Arial, "Microsoft YaHei", "PingFang SC", sans-serif`
- `code_family`: `Consolas, "Courier New", monospace`
- `title_weight`: `bold`
- `hero_weight`: `bold`

## Icons

- library: `chunk-filled`
- Known icons: `ai-brain`, `wireless-signal`, `layers`, `data-chart`, `comparison`, `arrow-forward`, `checkmark`, `close`

## Images (all Placeholder)

| Key | File | W | H |
| --- | ---- | - | - |
| `cover_bg` | `images/cover_bg.png` | 1280 | 720 |
| `architecture` | `images/architecture.png` | 800 | 500 |

## Page Rhythm

| Page | Key | Tag |
| ---- | --- | --- |
| 01 | cover | `anchor` |
| 02 | outline | `dense` |
| 03 | llm_success | `dense` |
| 04 | traditional_problems | `breathing` |
| 05 | architecture | `dense` |
| 06 | why_spectrogram | `dense` |
| 07 | data_synthesis | `dense` |
| 08 | annotation_pipeline | `dense` |
| 09 | general_vlm_fail | `dense` |
| 10 | wbmc_wbod | `dense` |
| 11 | wtr_wnuc_nrie | `dense` |
| 12 | ablation | `dense` |
| 13 | related_work | `dense` |
| 14 | conclusion | `dense` |
| 15 | qa | `anchor` |

## Layout Constants

- `card_gap`: `24`
- `card_padding`: `24`
- `card_radius`: `10`
- `block_gap`: `32`
- `icon_text_gap`: `12`
