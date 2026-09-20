#include<reg51.h>
#include<stdio.h>
#include "LCD16.H"

void LCD_Delay(void)
{
	unsigned char i, j;

	i = 2;
	j = 239;
	do
	{
		while (--j);
	} while (--i);
}

void LCD_WriteCommand(unsigned char Command){
	LCD_RS = 0;
	LCD_RW = 0;
	LCD_EN = 0;
	LCD_DataPort=Command;
	LCD_Delay();
	LCD_EN = 1;
	LCD_Delay();
	LCD_EN = 0;
}

void LCD_WriteData(unsigned char data_l){
	LCD_RS = 1;
	LCD_RW = 0;
	LCD_EN = 0;
	LCD_DataPort=data_l;
	LCD_Delay();
	LCD_EN = 1;
	LCD_Delay();
	LCD_EN = 0;
}

void LCD_Init(void){
	LCD_WriteCommand(0x38);
	Delay(5);
	LCD_WriteCommand(0x0C);
	Delay(5);
	LCD_WriteCommand(0x06);
	Delay(5);
	LCD_WriteCommand(0x01);
	Delay(5);
}

void LCD_ShowStr(unsigned char *str){
	while(*str != '\0')
		LCD_WriteData(*str++);
}

void LCD_GOXY(int line,int column){
	if(line == 0)
		LCD_WriteCommand(0x80+column);
	if(line == 1)
		LCD_WriteCommand(0x80+0x40+column);
}

void Delay(unsigned int n)	//@12.000MHz
{
	unsigned char data i, j,k=0;
	for(k=0;k<n;k++){
		i = 12;
		j = 169;
		do
		{
			while (--j);
		} while (--i);
	}
}