?PR?_ASMSIN SEGMENT CODE; // 在程序存储区中定义段
PUBLIC _ASMSIN; //声明函数
EXTRN CODE(_SIN); //声明为外部函数，来自于C 库函数
RSEG ?PR?_ASMSIN; //函数可被连接器放置在任何地方
_ASMSIN:
LCALL _SIN ; //调用C 库函数中的正弦函数y=sin(x),这里的参数是通过R4-R7
RET
END
