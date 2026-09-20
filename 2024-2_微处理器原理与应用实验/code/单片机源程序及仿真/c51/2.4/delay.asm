?PR?_DELAY SEGMENT CODE; // 作用是在程序存储区中定义段，段名为
; // _DELAY，?PR? 表示段位于程序存储区内。
PUBLIC _DELAY; //声明函数为公共函数
RSEG ?PR?_DELAY; //表示函数可被连接器放置在任何地方，RSEG 是段名的属性。
_DELAY:
MOV A,R7; //只有一个参数，R7
MOV R2,A
DL1:MOV R1,#48
DL2:DJNZ R1,DL2
NOP
DJNZ R2,DL1
RET
END