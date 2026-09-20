#include<reg51.h>
#include<stdio.h>
#include "AD08.H"


unsigned char num[]={'0','1','2','3','4','5','6','7','8','9'};
unsigned char dot = '.';

void Timer0_Init(void)	//1毫秒@11.0592MHz
{
	TMOD &= 0xF0;		//设置定时器模式
	TMOD |= 0x01;		//设置定时器模式
	TL0 = 0xD8;		//设置定时初始值
	TH0 = 0xFE;		//设置定时初始值
	TF0 = 0;		//清除TF0标志
	TR0 = 1;		//定时器0开始计时
	EA = 1;
	ET0 = 1;
	PT0 = 0;
}


void Timer0_ISR() interrupt 1 {
    TH0 = 0xD8;       // 重装初值（模式1需手动重载）
    TL0 = 0xFE;
    // 用户自定义操作（如翻转LED）
    CLK = 0x01;       // P1.0电平翻转
}



void main()
{
	unsigned char data_r;
	unsigned int data_buf[4],con_buf=0xFE;
	unsigned int i;
	Timer0_Init();
	CS = 0;
	while (1)
	{
		WR = 1;
		WR = 0;
		WR = 1;
		while(EOC == 0);
		RD = 0;
		data_r = DataPort;
		data_r = data_r/255*500;
		for(i=0 ; i<4; i++){
			data_buf[i] = data_r%10;
			data_r = data_r/10;
		}
		
		for(i=0 ; i<4; i++){
			ShowPort =0xFF;
			ShowPort = num[data_buf[i]];
			if(i == 1){
				ShowPort = ShowPort&0x7F;
			}
			con_buf =con_buf >> 1;
			if(con_buf == 8)
				con_buf = 0xFE;
			ContPort = con_buf;
			delay(1);
		}
	}
}