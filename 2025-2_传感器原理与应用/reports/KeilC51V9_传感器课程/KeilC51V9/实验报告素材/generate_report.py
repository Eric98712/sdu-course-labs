"""
生成传感器原理与应用实验报告 Word 文档
参考格式：通信3班--.docx
"""
from docx import Document
from docx.shared import Pt, Inches, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os
import re

# ══════════════════════════════════════════════════════════
# C 语言语法高亮颜色方案
# ══════════════════════════════════════════════════════════
COLOR_KEYWORD      = RGBColor(0x00, 0x00, 0xFF)  # 蓝色
COLOR_PREPROCESSOR = RGBColor(0x00, 0x00, 0x80)  # 深蓝
COLOR_COMMENT      = RGBColor(0x00, 0x80, 0x00)  # 绿色
COLOR_STRING       = RGBColor(0xA3, 0x15, 0x15)  # 红棕色
COLOR_NUMBER       = RGBColor(0x09, 0x86, 0x58)  # 青绿色
COLOR_DEFAULT      = RGBColor(0x00, 0x00, 0x00)  # 黑色

C_KEYWORDS = {
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default',
    'do', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto',
    'if', 'int', 'long', 'register', 'return', 'short', 'signed',
    'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
    'unsigned', 'void', 'volatile', 'while',
    # C51 扩展关键字
    'sbit', 'sfr', 'sfr16', 'bit', 'idata', 'xdata', 'code', 'bdata',
    'pdata', 'data', 'interrupt', 'using', 'reentrant', '_nop_',
    '_crol_', '_cror_', '_iror_', '_irol_', '_lror_', '_lrol_',
    '_testbit_', '_push_', '_pop_',
}

def tokenize_c_line(line, in_block_comment):
    """将一行 C 代码拆分为 (token_text, token_type) 列表"""
    tokens = []
    pos = 0
    n = len(line)

    if in_block_comment:
        end = line.find('*/')
        if end != -1:
            tokens.append((line[:end + 2], 'comment'))
            in_block_comment = False
            pos = end + 2
        else:
            tokens.append((line, 'comment'))
            return tokens, True

    while pos < n:
        # 块注释 /* */
        if pos + 1 < n and line[pos] == '/' and line[pos + 1] == '*':
            end = line.find('*/', pos + 2)
            if end != -1:
                tokens.append((line[pos:end + 2], 'comment'))
                pos = end + 2
            else:
                tokens.append((line[pos:], 'comment'))
                return tokens, True
            continue

        # 行注释 //
        if pos + 1 < n and line[pos] == '/' and line[pos + 1] == '/':
            tokens.append((line[pos:], 'comment'))
            break

        # 预处理指令 #
        if pos == 0 and line[pos] == '#':
            # 找到行注释前的内容
            comment_start = line.find('//', pos)
            if comment_start == -1:
                tokens.append((line[pos:], 'preprocessor'))
                pos = n
            else:
                tokens.append((line[pos:comment_start], 'preprocessor'))
                pos = comment_start
            continue

        # 字符串 ""
        if line[pos] == '"':
            end = pos + 1
            while end < n:
                if line[end] == '\\':
                    end += 2
                elif line[end] == '"':
                    end += 1
                    break
                else:
                    end += 1
            tokens.append((line[pos:end], 'string'))
            pos = end
            continue

        # 字符 ''
        if line[pos] == '\'':
            end = pos + 1
            while end < n and line[end] != '\'':
                if line[end] == '\\':
                    end += 1
                end += 1
            if end < n:
                end += 1
            tokens.append((line[pos:end], 'string'))
            pos = end
            continue

        # 数字（十六进制 0x...、十进制、浮点）
        num_match = re.match(r'0[xX][0-9a-fA-F]+|\d+\.?\d*[eE]?[+-]?\d*', line[pos:])
        if num_match:
            num_text = num_match.group()
            tokens.append((num_text, 'number'))
            pos += len(num_text)
            continue

        # 标识符 / 关键字
        ident_match = re.match(r'[a-zA-Z_][a-zA-Z0-9_]*', line[pos:])
        if ident_match:
            word = ident_match.group()
            if word in C_KEYWORDS:
                tokens.append((word, 'keyword'))
            else:
                tokens.append((word, 'plain'))
            pos += len(word)
            continue

        # 运算符 / 分隔符 / 空白
        if line[pos] in ' \t':
            end = pos
            while end < n and line[end] in ' \t':
                end += 1
            tokens.append((line[pos:end], 'space'))
            pos = end
            continue

        # 其他单字符（标点、运算符）
        tokens.append((line[pos], 'plain'))
        pos += 1

    # 合并连续的同类 token
    merged = []
    for text, ttype in tokens:
        if merged and merged[-1][1] == ttype:
            merged[-1] = (merged[-1][0] + text, ttype)
        else:
            merged.append((text, ttype))
    return merged, False

COLOR_MAP = {
    'keyword':      COLOR_KEYWORD,
    'preprocessor': COLOR_PREPROCESSOR,
    'comment':      COLOR_COMMENT,
    'string':       COLOR_STRING,
    'number':       COLOR_NUMBER,
    'plain':        COLOR_DEFAULT,
    'space':        COLOR_DEFAULT,
}

BASE = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(BASE, "传感器原理与应用实验报告.docx")
# 如果旧文件被占用则换名
if os.path.exists(OUTPUT):
    try:
        open(OUTPUT, 'a').close()
    except PermissionError:
        import time
        OUTPUT = os.path.join(BASE, f"传感器原理与应用实验报告_{int(time.time())}.docx")

doc = Document()

# ── 页面设置 ──
for section in doc.sections:
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

style = doc.styles['Normal']
font = style.font
font.name = '宋体'
font.size = Pt(12)
style.element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
pf = style.paragraph_format
pf.line_spacing = 1.5

# ══════════════════════════════════════════════════════════
# 封面页
# ══════════════════════════════════════════════════════════

def add_center_para(text, size=Pt(12), bold=False, font_name='宋体', spacing_after=Pt(6)):
    """添加居中对齐段落"""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = spacing_after
    run = p.add_run(text)
    run.font.size = size
    run.font.name = font_name
    run._element.rPr.rFonts.set(qn('w:eastAsia'), font_name)
    run.bold = bold
    return p

def add_cover_line(label, value):
    """添加封面的下划线信息行"""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    # label
    run = p.add_run(label)
    run.font.size = Pt(14)
    run.font.name = '宋体'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
    run.bold = True
    # value
    run2 = p.add_run(value)
    run2.font.size = Pt(14)
    run2.font.name = '宋体'
    run2._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
    run2.underline = True
    return p

# 空行调整封面顶部间距
for _ in range(4):
    add_center_para('', Pt(12))

add_center_para('信息科学与工程学院', Pt(22), bold=True, spacing_after=Pt(10))
add_center_para('2024－2025学年第二学期', Pt(16), bold=False, spacing_after=Pt(20))
add_center_para('实 验 报 告', Pt(26), bold=True, spacing_after=Pt(30))

# 封面信息表单（左对齐带下划线）
add_cover_line('课程名称：', '    传感器原理与应用')
add_cover_line('实验名称：', '    基于DHT11与HX711的传感器应用系统设计')
add_cover_line('专 业 班 级    ', '    （请填写）')
add_cover_line('学 生 学 号    ', '    （请填写）')
add_cover_line('学 生 姓 名    ', '    （请填写）')
add_cover_line('实 验 时 间    ', '    2026年    月    日')
add_cover_line('指 导 教 师    ', '    （请填写）')

# 分页 → 目录页
doc.add_page_break()

# ══════════════════════════════════════════════════════════
# 目录页
# ══════════════════════════════════════════════════════════
add_center_para('目  录', Pt(18), bold=True, spacing_after=Pt(20))

toc_items = [
    ('一、实验目的', 3),
    ('二、器件简介', 4),
    ('  2.1 DHT11 温湿度传感模块', 4),
    ('  2.2 HX711 电子秤专用A/D转换器芯片', 6),
    ('三、实验内容——补充 main.c 代码注释', 8),
    ('  3.1 实验一：基于DHT11的温湿度传感系统', 8),
    ('  3.2 实验二：基于HX711的电子秤系统', 9),
    ('四、实验心得', 12),
    ('五、参考资料', 13),
]
for item, page in toc_items:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.8
    run = p.add_run(item)
    run.font.size = Pt(14)
    run.font.name = '宋体'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')

doc.add_page_break()

# ══════════════════════════════════════════════════════════
# 正文辅助函数
# ══════════════════════════════════════════════════════════

def add_heading_styled(text, level=1):
    """添加带格式的标题"""
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        run.font.name = '黑体'
        run._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
    return h

def add_body(text):
    """添加正文段落（首行缩进2字符）"""
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = Pt(24)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.size = Pt(12)
    run.font.name = '宋体'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
    return p

def add_code_block(code_text):
    """添加代码块（灰色底纹、Consolas字体、C语法高亮）"""
    lines = code_text.strip().split('\n')
    in_block_comment = False

    for line in lines:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.2
        p.paragraph_format.left_indent = Cm(0.5)

        # 灰色底纹
        shd = OxmlElement('w:shd')
        shd.set(qn('w:fill'), 'F5F5F5')
        shd.set(qn('w:val'), 'clear')
        p.paragraph_format.element.get_or_add_pPr().append(shd)

        if not line:
            # 空行
            run = p.add_run(' ')
            run.font.size = Pt(8)
            run.font.name = 'Consolas'
            run._element.rPr.rFonts.set(qn('w:eastAsia'), 'Consolas')
            continue

        # 语法高亮 tokenize
        tokens, in_block_comment = tokenize_c_line(line, in_block_comment)

        for text, ttype in tokens:
            run = p.add_run(text)
            run.font.size = Pt(8)
            run.font.name = 'Consolas'
            run._element.rPr.rFonts.set(qn('w:eastAsia'), 'Consolas')
            color = COLOR_MAP.get(ttype, COLOR_DEFAULT)
            run.font.color.rgb = color
            # 注释加斜体
            if ttype == 'comment':
                run.italic = True
            # 关键字加粗
            if ttype == 'keyword':
                run.bold = True

    # 代码块后加空行
    doc.add_paragraph()

# ══════════════════════════════════════════════════════════
# 一、实验目的
# ══════════════════════════════════════════════════════════
add_heading_styled('一、实验目的', level=2)

purposes = [
    '独立理解两个51单片机编程实验的工程代码，掌握Keil C51开发环境下的工程搭建与编译调试过程；',
    '掌握DHT11温湿度传感模块和HX711电子秤A/D转换器芯片与51单片机的硬件电路连接与通信方式；',
    '深入理解单总线（1-Wire）协议和类SPI串行通信协议的软件实现方法，了解24位Σ-Δ ADC的数据格式和补码转换原理；',
    '巩固《传感器原理与应用》理论课所学相关知识，将传感器工作原理、信号调理、模数转换、数据校准等理论知识付诸工程实践。',
]
for i, text in enumerate(purposes, 1):
    add_body(f'{i}. {text}')

# ══════════════════════════════════════════════════════════
# 二、器件简介
# ══════════════════════════════════════════════════════════
add_heading_styled('二、器件简介', level=2)

# ---- DHT11 ----
add_heading_styled('2.1 DHT11 温湿度传感模块', level=3)

add_heading_styled('产品概述', level=4)
add_body(
    'DHT11是一款含有已校准数字信号输出的温湿度复合传感器，由广州奥松电子有限公司生产。'
    '它将一个电阻式感湿元件和一个NTC测温元件集成在同一模块上，并与一个高性能8位单片机（MCU）相连接。'
    '传感器内部完成了模拟信号的调理、A/D转换和数字校准，最终通过单总线（1-Wire）数字接口对外输出，'
    '无需用户进行复杂的模拟电路设计和校准补偿。'
)
add_body(
    '模块采用4引脚单排直插封装（SIP-4），引脚定义分别为VCC（电源正，3.3V–5.5V）、'
    'DATA（串行数据，单总线双向通信）、NC（空脚，悬空）、GND（电源地）。模块上集成了上拉电阻和滤波电容，'
    '用户只需将DATA引脚连接到单片机的任意I/O口即可实现数据读取，硬件电路极为简洁。'
)
add_body(
    'DHT11的通信协议为单总线协议，一次完整的数据传输为40位（5字节），依次为：'
    '湿度整数数据（8位）、湿度小数数据（8位）、温度整数数据（8位）、温度小数数据（8位）、'
    '校验和（8位，前4字节之和的低8位）。通信由主机（单片机）发起起始信号后，'
    'DHT11从低功耗模式切换到高速模式并返回响应信号，随后送出40位数据。'
    '每位数据以低电平起始、高电平持续时间区分"0"和"1"——高电平持续26–28μs表示"0"，持续70μs表示"1"。'
    '单次通信时间约4ms，采样周期建议不小于1秒。'
)

add_heading_styled('主要参数', level=4)
add_body(
    'DHT11的工作电压范围为3.3V至5.5V，典型工作电压为5V。在5V供电条件下，测量期间平均电流约为0.5mA，'
    '待机电流约100μA–150μA，功耗极低，适合电池供电的便携设备。'
)
add_body(
    '湿度测量范围为20%RH–90%RH，分辨率为1%RH（即8位精度），测量精度在25°C时为±5%RH。'
    '温度测量范围为0°C–50°C，分辨率为1°C（即8位精度），测量精度为±2°C。'
    '采样周期方面，DHT11的推荐采样间隔不小于1秒，若连续两次读取间隔过短，'
    '传感器内部MCU无法完成新一轮的采集和校准，将导致数据不准确或通信失败。'
)
add_body(
    '模块的工作温度范围为-20°C至+60°C，存储温度范围为-40°C至+80°C。'
    '物理尺寸约为32mm × 17mm × 8mm（长×宽×高，含PCB和外壳），重量约3g，小巧轻便，便于嵌入各类设备中。'
)

add_heading_styled('应用范围', level=4)
add_body(
    'DHT11以其低成本、低功耗、接口简单的特点，广泛应用于需要基础环境温湿度监测的场景，主要包括：'
    '（1）智能家居：室内温湿度监测、空调恒温控制、加湿器/除湿器自动控制、智能窗帘联动系统等；'
    '（2）农业温室：大棚蔬菜种植、花卉培育、食用菌栽培等场景的环境参数监测，帮助实现科学种植管理；'
    '（3）工业环境：电子车间、仓储物流、数据中心机房等对环境温湿度有一定要求场所的在线监测；'
    '（4）消费电子：便携气象站、电子万年历、智能闹钟等带环境显示功能的消费类产品；'
    '（5）教学实验：各类单片机/嵌入式系统课程的传感器实验教学，是学习单总线协议和传感器编程的理想入门器件。'
    '需要指出的是，DHT11在精度和量程上不及DHT22（AM2302），在高端应用中（如高精度实验室、医疗设备）建议选用DHT22或SHT系列传感器。'
)

# ---- HX711 ----
add_heading_styled('2.2 HX711 电子秤专用 A/D 转换器芯片', level=3)

add_heading_styled('产品概述', level=4)
add_body(
    'HX711是一款专为高精度电子秤设计的24位A/D转换器芯片，由海芯科技（AVIA Semiconductor）生产。'
    '与同类型芯片相比，HX711内部集成了低噪声可编程增益放大器（PGA，增益可选64倍或128倍）、'
    '24位Σ-Δ（Sigma-Delta）模数转换器、片上稳压电源、片内时钟振荡器等电路，'
    '仅需极少的外围元件（通常只需一个参考电阻和一个滤波电容）即可构成完整的称重数据采集前端，'
    '极大简化了电子秤的电路设计。'
)
add_body(
    'HX711采用SOP-16封装，与电子秤专用应变式传感器（称重传感器，通常为惠斯通电桥结构）配套使用。'
    '称重传感器的差分模拟信号输出直接接入HX711的差分输入端（通道A或通道B），'
    '芯片内部PGA将微弱的毫伏级信号放大后送入24位Σ-Δ ADC进行高精度转换，'
    '转换结果通过串行接口（类似于SPI，但仅需2根线：数据线DOUT和时钟线SCK）输出给单片机。'
    '通信速率由外部MCU控制时钟频率决定，典型时钟频率在10kHz–40kHz之间。'
    '芯片输出24位二进制补码数据，最高位为符号位，当差分输入为负值时（传感器反接），'
    '输出二进制补码表示负值，用户需通过异或运算转换为原码后使用。'
)
add_body(
    'HX711内置了通道选择功能：通道A增益为64或128（可编程选择），通道B固定增益为32。'
    '电子秤应用通常选用通道A、增益128，以获得最高的信号分辨能力。'
    '芯片的输入噪声典型值在10Hz输出速率下仅为50nV（RMS），数据输出速率可选10SPS或80SPS'
    '（通过外部引脚RATE控制），10SPS时精度最优，80SPS时响应更快。'
)

add_heading_styled('主要参数', level=4)
add_body(
    'HX711的工作电压范围为2.6V至5.5V，典型供电为5V（与单片机共用电源）。'
    '芯片内部集成的模拟电源稳压器（AVDD）输出电压为4.3V–4.8V，'
    '可为外部称重传感器提供稳定的激励电压（典型值为4.3V左右），避免了使用外部稳压器，降低了系统成本。'
    'PGA增益方面，通道A可编程为64或128，通道B固定为32，'
    '差分输入电压范围在PGA增益为128、AVDD=4.3V时为±20mV，'
    '对应称重传感器满量程输出（通常1mV/V–2mV/V灵敏度）。'
)
add_body(
    '精度方面，24位Σ-Δ ADC理论分辨率约为2²⁴ = 16,777,216个码值，'
    '实际无噪声有效位数（ENOB）在10SPS输出速率、增益128时约19–20位，'
    '可满足千分之一甚至万分之一精度的称重需求。'
    '工作温度范围-40°C至+85°C，满足工业级温度要求。'
    '封装为SOP-16（窄体），引脚间距1.27mm，体积约10mm × 6mm × 1.75mm，适合自动化贴片生产。'
)

add_heading_styled('应用范围', level=4)
add_body(
    'HX711作为电子秤领域的事实标准A/D芯片，在以下领域广泛应用：'
    '（1）商用衡器：超市电子计价秤、台秤、平台秤、计数秤等商用衡器设备，直接对接4线或6线称重传感器；'
    '（2）工业称重：配料控制系统、料位检测、皮带秤、定量包装机等工业自动化场景中的在线重量检测；'
    '（3）智能硬件：智能货架、智能药盒、智能垃圾桶、宠物喂食器等物联网设备；'
    '（4）健康医疗：人体电子秤、厨房营养秤、婴儿秤、体脂秤等家用健康管理设备；'
    '（5）压力/力检测：通过应变式传感器间接测量压力、拉力、扭矩等物理量，扩展应用于力学实验设备、材料试验机等领域；'
    '（6）教学实验：不仅是单片机课程中A/D转换和传感器应用的经典案例，也是学习Σ-Δ ADC原理、校准算法（去皮、标定、线性化）的理想实践平台。'
)
add_body(
    'HX711的核心优势在于：与称重传感器的桥式输出天然匹配、外围电路极其精简、成本极低、'
    '开发资料丰富（中文数据手册、大量开源Arduino/51例程），且有国产兼容芯片（如TM7711）可无缝替代。'
    '主要缺点是输出速率较低（最高80SPS），不适合快速动态称重场景。'
)

# ══════════════════════════════════════════════════════════
# 三、实验内容
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_heading_styled('三、实验内容——补充 main.c 代码注释', level=2)

# ---- 3.1 DHT11 ----
add_heading_styled('3.1 实验一：基于DHT11的温湿度传感系统', level=3)
add_body(
    'main.c文件位于工程目录source/MIAN.C，负责系统初始化、传感器数据读取和LCD1602显示刷新。'
    '以下为补充完整注释后的代码：'
)

dht11_code = r'''#include <reg51.h>      /* 包含8051特殊功能寄存器定义（P0/P1/P2/P3、定时器等）    */
#include "typedef.h"    /* 自定义类型定义：uchar = unsigned char, uint = unsigned int  */
#include "LCD1602.H"    /* LCD1602液晶显示驱动头文件（含Lcd_Init、Write_String等）       */
#include "DHT11.H"      /* DHT11温湿度传感器驱动头文件（含RH()函数、全局变量声明）        */

/*******************************************************************************
 * 主函数
 * 功能：初始化LCD1602后进入无限循环，不断读取DHT11数据并刷新显示
 * LCD1602显示布局：
 *   第一行（0x80起）："humidity: XX%rh"
 *   第二行（0xC0起）："temperature: XX°C"
 *******************************************************************************/
void main()
{
    Lcd_Init();         /* 初始化LCD1602液晶模块                                   */
                        /* 内部执行：设置8位数据接口、2行显示、5×7点阵、            */
                        /* 开显示无光标、自动递增、清屏                              */

    while(1)            /* 主循环：不断读取传感器数据并更新LCD显示                   */
    {
        RH();           /* 调用DHT11读取函数，触发一次完整的温湿度采集                */
                        /* 通信完成后的全局变量：                                     */
                        /*   T_data_H  — 温度整数部分（单位：°C）                    */
                        /*   RH_data_H — 湿度整数部分（单位：%RH）                   */

        /* ---- LCD第一行：显示湿度 ---- */
        Write_String(0x80, "humidity:");
                        /* 从LCD第一行首地址0x80（DDRAM地址）写入字符串              */
                        /* 0x80是LCD1602第一行第1列的DDRAM地址                      */

        Write_Char(0x89, RH_data_H / 10 + 48);
                        /* 在第一行第10列（0x89 = 0x80 + 9）显示湿度十位数字         */
                        /* RH_data_H/10取出十位数，+48转换为ASCII码                  */
                        /* ASCII码中'0'=48，数字d的ASCII码 = d + 48                 */

        Write_Char(0x8A, RH_data_H % 10 + 48);
                        /* 在第一行第11列（0x8A）显示湿度个位数字                    */
                        /* RH_data_H%10取出个位数，+48转换为ASCII码                  */

        Write_String(0x8B, "%rh");
                        /* 在第一行第12列（0x8B）显示湿度单位"%rh"                   */

        /* ---- LCD第二行：显示温度 ---- */
        Write_String(0xC0, "temperature:");
                        /* 从LCD第二行首地址0xC0（DDRAM地址）写入字符串              */
                        /* 0xC0 = 0x80 + 0x40，0x40是第二行的地址偏移量              */

        Write_Char(0xCC, T_data_H / 10 + 48);
                        /* 在第二行第13列（0xCC = 0xC0 + 12）显示温度十位数字        */

        Write_Char(0xCD, T_data_H % 10 + 48);
                        /* 在第二行第14列（0xCD）显示温度个位数字                    */

        Write_Char(0xCE, 0xDF);
                        /* 在第二行第15列（0xCE）显示摄氏度符号"°"                  */
                        /* 0xDF是LCD1602字符发生器中"°"符号的编码                   */

        Write_Char(0xCF, 'C');
                        /* 在第二行第16列（0xCF）显示字母'C'，组成"°C"              */
    }
}'''

add_code_block(dht11_code)

add_body(
    '程序流程说明：该工程采用典型的"初始化→循环采集→显示刷新"架构。'
    'Lcd_Init()将LCD1602配置为8位并行数据接口、2行显示模式。'
    '主循环中RH()函数通过单总线协议与DHT11进行一次完整的40位数据通信'
    '（含起始信号发送、响应信号检测、5字节数据接收、校验和验证），'
    '验证通过后更新全局变量T_data_H和RH_data_H。LCD显示部分利用DDRAM地址映射，'
    '将温湿度数值按位拆分后分别写入指定列位置。温度显示使用了LCD1602内置的'
    '自定义字符0xDF（即"°"符号），配合字母"C"组成完整的"°C"单位。'
)

# ---- 3.2 HX711 ----
add_heading_styled('3.2 实验二：基于HX711的电子秤系统', level=3)
add_body(
    'main.c文件位于工程目录src/main.c，负责外设初始化、去皮校准和循环称重显示。'
    '以下为补充完整注释后的代码：'
)

hx711_code = r'''#include "main.h"       /* 主程序头文件（含reg52.h及函数声明）                       */
#include "1602.h"       /* LCD1602液晶显示驱动头文件（含lcd_init、write_data等）            */
#include "HX711.h"      /* HX711称重传感器驱动头文件（含HX711_Read、引脚定义）               */
#include "delay.h"      /* 延时函数头文件（含delay_ms毫秒级软件延时）                        */
#include "uart.h"       /* 串口通信头文件（含uart_init、send_data，用于调试输出）             */

/*==============================================================================
 * 全局变量定义
 *==============================================================================*/
unsigned long HX711_Buffer = 0;          /* HX711读取缓冲区，存储原始ADC读数               */
unsigned long Weight_Maopi = 0;          /* 毛皮重量 — 空秤时的ADC基准值                   */
unsigned long Weight_Shiwu = 0;          /* 实物重量 — 去皮后的净重值                       */

/*==============================================================================
 * 函数名称：Get_Maopi
 * 功能描述：获取毛皮重量（去皮操作）
 * 参数说明：无
 * 返 回 值：无（通过全局变量Weight_Maopi返回）
 * 说    明：在空秤状态下调用，读取当前HX711数据并记录为零点基准。
 *           后续称重时，实测值减去此基准即为物品净重。
 *==============================================================================*/
void Get_Maopi(void)
{
    HX711_Buffer = HX711_Read();         /* 从HX711读取24位原始ADC数据                     */
    Weight_Maopi = HX711_Buffer / 100;   /* 除以100得到毛皮重量基准值                       */
                                         /* 缩放与Get_Weight保持一致，确保可比较             */
}

/*==============================================================================
 * 函数名称：Get_Weight
 * 功能描述：获取实物净重
 * 参数说明：无
 * 返 回 值：无（通过全局变量Weight_Shiwu返回）
 * 说    明：读取HX711数据，减去毛皮基准后通过校准系数换算为实际克数。
 *           校准系数3.95由砝码标定实验得出：放置已知质量的砝码，记录
 *           ADC差值，计算每克对应的ADC变化量（≈3.95 ADC/g）。
 *==============================================================================*/
void Get_Weight(void)
{
    HX711_Buffer = HX711_Read();         /* 从HX711读取当前24位原始ADC数据                 */
    HX711_Buffer = HX711_Buffer / 100;   /* 缩放处理，与Get_Maopi保持相同缩放比             */

    if(HX711_Buffer >= Weight_Maopi)     /* 判断当前读数是否≥毛皮基准                       */
    {                                    /* 若小于，说明传感器负向漂移或未连接                */
        Weight_Shiwu = HX711_Buffer;     /* 暂存当前缩放后的ADC读数                         */
        Weight_Shiwu = Weight_Shiwu - Weight_Maopi;
                                         /* 减去毛皮基准，得到净重的ADC差值                  */

        Weight_Shiwu = (unsigned int)((float)Weight_Shiwu / 3.95 + 0.05);
                                         /* 校准换算：ADC差值 → 实际克数                     */
                                         /*   ÷ 3.95：除以标定系数（ADC/g）                  */
                                         /*   + 0.05：四舍五入到整数克（强制转整前）          */
    }
}

/*==============================================================================
 * 主函数
 * 流程：初始化外设 → 显示欢迎界面 → 去皮校准 → 循环称重并刷新LCD
 * LCD1602显示布局：
 *   第一行（DDRAM 0x00起）："WEIGHT:         "（标签行）
 *   第二行（DDRAM 0x40起）："XXXXX g"         （数值行，前导零不显示）
 *==============================================================================*/
void main()
{
    uart_init();                         /* 初始化UART串口通信                              */
                                         /* 波特率9600bps，8位数据，无校验位                  */
                                         /* 用于调试时向PC串口助手发送重量数据                */

    lcd_init();                          /* 初始化LCD1602液晶模块                           */
                                         /* 设置8位数据接口、2行显示、清屏                    */

    /* ---- 显示欢迎界面 ---- */
    lcd_display_str(0, 1, "Welcome to use! ");
                                         /* 在第一行第1列（列坐标0，行坐标1）显示欢迎信息      */

    delay_ms(1000);                      /* 延时1000ms = 1秒，让用户看清欢迎界面             */

    /* ---- 初始化称重显示界面 ---- */
    lcd_clear();                         /* 清屏，清除欢迎信息                               */
    lcd_display_str(0, 1, "WEIGHT:         ");
                                         /* 在第一行显示"WEIGHT:"标签                        */

    Get_Maopi();                         /* 获取毛皮基准（去皮操作）                         */
                                         /* 此时称重托盘应为空，记录零点ADC值                 */

    /* ---- 主循环：不断读取并显示重量 ---- */
    while(1)
    {
        Get_Weight();                    /* 获取当前实物净重（已完成去皮+校准换算）          */

        /* ---- 在LCD第二行显示重量数值 ---- */
        write_command(0x80 + 0x40);      /* 光标定位到第二行首地址                           */
                                         /* 0x80 = DDRAM基地址，+0x40 = 第二行偏移            */

        /* 写7个空格清除第二行旧数据，防止数字位数变短时残留上轮字符 */
        write_data(' '); write_data(' '); write_data(' '); write_data(' ');
        write_data(' '); write_data(' '); write_data(' ');

        write_command(0x80 + 0x40);      /* 光标重新回到第二行首地址，准备显示新数值          */

        /* ---- 逐位显示重量（前导零不显示，消除无意义的0）---- */
        if(Weight_Shiwu / 10000 != 0)    /* 若万位（10kg级）非零则显示                       */
            write_data(Weight_Shiwu / 10000 + 0x30);
                                         /* 除以10000取商，+0x30（'0'）转为ASCII             */

        if(Weight_Shiwu / 1000 != 0)     /* 若千位（1kg级）非零则显示                        */
            write_data((Weight_Shiwu % 10000) / 1000 + 0x30);
                                         /* 先取余10000去掉万位，再除以1000                  */

        if(Weight_Shiwu / 100 != 0)      /* 若百位非零则显示                                */
            write_data(((Weight_Shiwu % 10000) % 1000) / 100 + 0x30);
                                         /* 逐层取余后除以100得到百位数字                    */

        if(Weight_Shiwu / 10 != 0)       /* 若十位非零则显示                                */
            write_data((((Weight_Shiwu % 10000) % 1000) % 100) / 10 + 0x30);
                                         /* 逐层取余后除以10得到十位数字                     */

        /* 个位始终显示（即使为0），保证至少显示一位数字 */
        write_data((((Weight_Shiwu % 10000) % 1000) % 100) % 10 + 0x30);
                                         /* 最终取余10获取个位，+0x30转为ASCII               */

        write_data(' ');                 /* 数值后一个空格分隔                               */
        write_data('g');                 /* 显示重量单位"g"（克）                            */
    }
}'''

add_code_block(hx711_code)

add_body(
    '程序流程说明：该工程在系统初始化后首先执行去皮操作（Get_Maopi()在空秤时记录'
    'ADC零点基准值Weight_Maopi），然后进入主循环不断采集、计算并刷新显示。'
    'Get_Weight()函数每次读取HX711的24位原始ADC数据，经缩放、减去毛皮基准、'
    '校准系数换算（÷3.95）和四舍五入后得到以克为单位的净重值。'
    'LCD显示采用了"先清后写"策略——每次刷新前用7个空格覆盖第二行，避免数字位数变化时'
    '（如从100g变为50g）出现残留字符。数字采用逐位取模显示法，通过if判断消除前导零'
    '（例如显示"50"而非"0050"），个位始终显示以保证读数为0时也能看到"0 g"。'
)

# ══════════════════════════════════════════════════════════
# 四、实验心得
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_heading_styled('四、实验心得', level=2)

reflections = [
    ('一、对单总线通信协议的认识。',
     'DHT11温湿度传感器采用单总线（1-Wire）通信协议，仅用一根数据线即可完成双向数据传输，'
     '这在硬件上非常简洁，但对软件时序要求极为严格。实验中我注意到，DHT11的"0"和"1"由'
     '高电平持续时间来区分（26–28μs为"0"，70μs为"1"），而51单片机在11.0592MHz晶振下'
     '一条_nop_()约1μs，因此必须精确控制延时循环次数来匹配传感器的时序要求。'
     '如果延时不当，轻则数据校验失败，重则传感器完全无响应。这让我深刻体会到：'
     '嵌入式开发中，阅读数据手册中的时序图、理解每一位数据的传输过程，是保证通信成功的基石。'),

    ('二、HX711的数据处理与校准思想。',
     'HX711实验让我第一次完整接触到一个传感器从原始ADC数据到物理量的转换全流程。'
     '24位Σ-Δ ADC输出的原始数据并非直接可用的重量值，需要经过三个关键步骤：'
     '（1）补码转原码——芯片输出的是24位二进制补码，通过count ^ 0x800000异或运算转换；'
     '（2）去皮——记录空秤时的ADC基准值（Weight_Maopi），后续每次读数减去此基准即为净重；'
     '（3）标定——通过已知质量的砝码确定ADC变化量与克数的比例系数（本实验用3.95），'
     '实现从ADC读数到实际克数的线性映射。这套"去皮+标定"的思路不仅是称重传感器领域的'
     '通用范式，也适用于其他需要零点校准和比例换算的传感器系统。'),

    ('三、工程结构的重要性。',
     '两个实验工程都采用了模块化设计：主程序（main.c）负责逻辑流程，传感器驱动'
     '（DHT11.c/HX711.c）封装底层通信协议，显示驱动（LCD1602.c）提供统一的显示接口，'
     '类型定义（typedef.h）统一数据类型。这种分层结构使得代码可读性强、易于调试和维护。'
     '在DHT11工程中，如果湿度显示异常，可以迅速定位到DHT11_REV()函数中的时序逻辑；'
     '在HX711工程中，若称重不准，可以单独检查Get_Weight()中的校准系数或Get_Maopi()中的'
     '去皮逻辑。这让我明白，好的工程结构本身就是一种调试工具。'),

    ('四、遇到的问题与解决方法。',
     '在理解和学习代码过程中，我遇到了一些困惑：（1）DHT11的40位数据格式中，小数部分'
     '（湿度小数和温度小数）在当前版本的DHT11中实际恒为0x00，但代码仍然保留了对这些字节的'
     '读取和校验，起初不理解为何要浪费指令周期读取无效数据，后来查阅资料才知道这是为了'
     '协议的完整性和兼容DHT21/DHT22等更高精度型号；（2）HX711工程中LCD刷新前先写7个空格'
     '的操作，起初觉得多余，仔细分析后明白——当数字位数变化时（如从"100g"变为"50g"），'
     '如果不先清空旧内容，"50g"后面会残留"0g"变成"50g0g"，这是一个常见的显示缓冲区清理技巧。'),

    ('五、收获总结。',
     '通过本次实验，我完整掌握了从传感器数据采集到LCD实时显示的全链路嵌入式开发过程。'
     '具体收获包括：熟悉了单总线和类SPI串行通信协议的软件实现方法；理解了24位Σ-Δ ADC的'
     '数据格式和补码转换；掌握了传感器系统去皮校准与线性标定的基本方法；学会了LCD1602的'
     'DDRAM寻址方式和字符显示技巧；提升了对工程代码的阅读和注释能力。'
     '这次实验不止是写代码，而是从硬件手册到软件实现、从物理信号到数字显示的完整工程实践，'
     '为后续学习和工作中面对更复杂的嵌入式系统积累了宝贵的经验和信心。'),
]

for title, content in reflections:
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = Pt(24)
    p.paragraph_format.line_spacing = 1.5
    run_t = p.add_run(title)
    run_t.font.size = Pt(12)
    run_t.font.name = '宋体'
    run_t._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')
    run_t.bold = True
    run_c = p.add_run(content)
    run_c.font.size = Pt(12)
    run_c.font.name = '宋体'
    run_c._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')

# ══════════════════════════════════════════════════════════
# 五、参考资料
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_heading_styled('五、参考资料', level=2)

refs = [
    '广州奥松电子有限公司. DHT11数字温湿度传感器数据手册.',
    '海芯科技（AVIA Semiconductor）. HX711 24位模数转换器（ADC）数据手册.',
    '深圳宏晶科技（STC）. STC12LE5A60S2系列单片机器件手册.',
    'B站"江协科技"：51单片机入门教程.',
]
for ref in refs:
    add_body(ref)

# ── 保存 ──
doc.save(OUTPUT)
print(f"报告已生成：{OUTPUT}")
