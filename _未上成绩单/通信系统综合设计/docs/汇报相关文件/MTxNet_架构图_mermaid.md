# MTxNet 网络架构图（Mermaid 格式）

将以下代码复制到支持 Mermaid 的编辑器（如 Typora, Notion, GitHub, Obsidian 等）中即可渲染：

````mermaid
flowchart TB
    subgraph Input["输入层"]
        I[("128×128×3<br/>RGB Normalized")]
    end

    subgraph Block0["Block0: 初始卷积"]
        B0["Conv2D 3×3 (32) + BN + ReLU<br/>→ Conv2D 3×3 (16) s=2 + BN<br/>128×128×32 → 64×64×16"]
    end

    subgraph Block1["Block1: Inverted Residual"]
        B1["Expand ×6 → DWConv 3×3 → Project (24)<br/>32×32×24<br/>Params: ~12K"]
    end

    subgraph Block2["Block2: Inverted Residual"]
        B2["Expand ×6 → DWConv 3×3 → Project (36)<br/>16×16×36<br/>Params: ~26K"]
    end

    subgraph Block3["Block3: Inverted Residual"]
        B3["Expand ×6 → DWConv 3×3 → Project (54)<br/>8×8×54<br/>Params: ~58K"]
    end

    subgraph Block4["Block4: Inverted Residual"]
        B4["Expand ×6 → DWConv 3×3 → Project (81)<br/>4×4×81<br/>Params: ~97K"]
    end

    subgraph Head["Head: 分类头"]
        H["Conv2D 3×3 (256) + BN + ReLU<br/>→ GlobalAvgPool<br/>→ Dropout(0.4)<br/>→ Dense(256 → 3)"]
    end

    subgraph Output["输出层"]
        O["Fresh / Half-Fresh / Rotten<br/>+ Confidence Score"]
    end

    I --> B0
    B0 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> H
    H --> O

    subgraph IRDetail["Inverted Residual Block 内部结构"]
        direction TB
        IR_IN["Input (C channels)"]
        IR_EX["Conv 1×1 (Expand ×6)<br/>BN + ReLU"]
        IR_DW["DWConv 3×3<br/>Depthwise, BN + ReLU"]
        IR_PR["Conv 1×1 (Project)<br/>Linear (No ReLU)"]
        IR_SC["+ Shortcut<br/>(if stride=1 & ch match)"]
        IR_OUT["Output<br/>(project_dim channels)"]
        IR_IN --> IR_EX --> IR_DW --> IR_PR --> IR_SC --> IR_OUT
    end

    B1 -.-> IRDetail
    B2 -.-> IRDetail
    B3 -.-> IRDetail
    B4 -.-> IRDetail
````

---

## PNG 图片文件

同时已生成 **`MTxNet_架构图.png`**（581KB，200dpi，横向布局），可直接插入报告或PPT。

### 图片布局说明

```
Input(128×128×3) → Block0(Conv2D 64×64×16)
    → Block1(32×32×24) → Block2(16×16×36) → Block3(8×8×54) → Block4(4×4×81)
    → Head(分类头) → Output(新鲜/半鲜/腐败)
```

- **颜色编码**：蓝色=输入 / 橙色=Conv2D / 绿色=Inverted Residual / 紫色=分类头 / 红色=输出
- **右侧**：Inverted Residual Block 内部结构详解（Expand → DWConv → Project → Shortcut）
- **底部**：设计特点说明（深度可分离卷积、倒残差瓶颈、通道扩展策略、ONNX部署）
