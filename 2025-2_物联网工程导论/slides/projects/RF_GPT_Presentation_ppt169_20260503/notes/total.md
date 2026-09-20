# RF-GPT Presentation Speaker Notes

## Slide 01 — Cover
- **Intro**: 今天汇报的这篇工作来自 Khalifa University 和浙江大学合作，发表在 arXiv 上
- **Hook**: 大模型能看文字、看图片、听声音，但还不能"看"无线电波。这篇工作填补了这个空白
- **Transition**: 先来看看为什么要做这件事

## Slide 02 — 汇报提纲
- **Overview**: 整个汇报分为六个部分，从背景、方法、数据、实验到展望
- **Timing**: 大约 20 分钟

## Slide 03 — 大模型的成功与缺失的一环
- **Key point**: LLM 在文本领域取得了巨大成功，VLM 扩展到了视觉，Whisper 扩展到了音频
- **Problem**: 但无线通信的物理层信号——RF——还没有被任何主流大模型支持
- **Question**: 有人可能会问，那传统的 RF 机器学习方法不行吗？

## Slide 04 — 传统射频智能的困境
- **Four problems**: 这四重困境概括了传统方法的根本问题
- **Emphasize**: 尤其"每任务一个模型"和"没有交互界面"这两点，是促使这篇工作诞生的核心驱动力
- **Transition**: RF-GPT 就是为了解决这些问题提出的

## Slide 05 — RF-GPT 核心架构
- **Walk through**: 从 IQ 信号到频谱图，视觉编码器提取特征，线性投影到 LLM 空间，最后语言模型输出
- **Analogy**: 医生看心电图这个类比可以帮助非 RF 专业的听众理解
- **Key insight**: 核心创新点在于"复用"——不重新训练视觉编码器，而是用现成的 VLM 底座

## Slide 06 — 为什么选频谱图？
- **Three reasons**: 计算可行、天然时频表示、复用预训练
- **Note limitation**: 丢失相位信息——但本文的感知任务不依赖相位
- **Show gallery**: 这六种技术各有不同的频谱图特征

## Slide 07 — 合成数据：六种无线技术
- **Emphasize**: 关键数字——12K 场景、625K 指令对、零人工标注
- **Why synthetic**: 真实数据太贵、太不平衡、标注太难
- **Transition**: 有了数据，怎么变成训练用的指令？

## Slide 08 — 自动化标注与指令合成管线
- **Pipeline walkthrough**: 波形生成 → 元数据 → 描述 → 指令对
- **5 levels**: 注意他们设计了 5 个信息层级，当前只用了前 3 个
- **Key point**: 整个流程不需要人工介入

## Slide 09 — 通用 VLM 毫无 RF 先验
- **Comparison read**: 直接读这两个回答——左边 Qwen 的回答多么笼统，右边 RF-GPT 多么精确
- **Key finding**: 通用 VLM 在 RF 任务上≈随机猜测
- **Five benchmarks**: 然后进入正式评测

## Slide 10 — WBMC & WBOD 结果
- **Read the numbers**: 通用 VLM 个位数，RF-GPT 70-90%
- **Emphasize**: 尤其是信号数量识别 98% vs <5%，说明 RF grounding 确实学到了时频结构

## Slide 11 — WTR / WNUC / NRIE 结果
- **WTR**: 99.64%——几乎完美
- **WNUC**: 11be 优于 11ax 的原因很有意思——MU-MIMO 造成视觉重叠
- **NRIE**: SCS 和 SSB 接近完美，计数类任务还有提升空间

## Slide 12 — 消融实验
- **Robustness**: IQ 不平衡最有破坏性——它产生镜像频率
- **vs CNN/Transformer**: RF-GPT 3 epoch 超越 ViT-H 30 epoch——数据效率是亮点
- **Resolution**: 512 最佳但有成本权衡

## Slide 13 — 与相关工作对比
- **RF foundation models**: 都需要任务特定输出头
- **Telecom LLMs**: 文本中心，看不到物理层
- **VLA parallels**: 思想一脉相承——VLM + 适配器 + 新模态
- **Table**: RF-GPT 是唯一同时具备 RF感知 + 语言交互 + 统一架构 + 多任务的方案

## Slide 14 — 总结与展望
- **Contributions**: 三个核心贡献概括
- **Limitations**: 坦诚地说——合成数据、单输入、粗粒度
- **Future**: 真实数据、MIMO、6G 集成

## Slide 15 — Q&A
- **Open floor**: 欢迎提问
- **Paper reference**: 论文在 arXiv 上可查
