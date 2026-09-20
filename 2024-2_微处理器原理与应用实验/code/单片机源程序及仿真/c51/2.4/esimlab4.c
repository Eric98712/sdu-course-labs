//该程序保存为C 语言源程序esimlab4.c
#include<reg51.h>
#include <math.h> //为使用sin 函数所以要包含该头文件
typedef unsigned char uchar;
typedef unsigned int uint;
extern void delay(char n);//在main 函数调用之前应该先将子函数void delay()
extern uint add(char c,char d);// 将汇编函数声明为外部函数。
extern float asmsin(float e);//声明一个外部汇编函数
uchar i,j,n;
uint x;
float y,z;
main()
{
//以下为C 调用有参数传递但是无返回值的汇编函数的示例
	n=100;
for(i=0;i<200;i++)
{
	for(j=0;j<250;j++)
	{
	delay(n); //无返回参数的汇编函数
	}
}
//以下为C 调用有参数传递也有返回值的汇编函数的示例
i=150;
j=200;
x=add(i,j); //有参数传递有返回值的汇编函数
//以下C 先调用汇编，汇编中又调用了C
y=3.1415926/2;
z=asmsin(y); //汇编函数asmsin 中调用了C 的库函数sin(x)
while(1);
}