#ifndef _LCD12_H
#define _LCD12_H

#include<reg51.h>
#include<stdio.h>

sbit RST=P2^0;
sbit CS2=P2^6;
sbit CS1=P2^5;
sbit RS =P2^4;
sbit RW =P2^3;
sbit EN =P2^2;
#define LCD_DataPort P0

extern unsigned char code Hzk[];

void LCD_Delay1ms(unsigned int c);
void LCD_Writecmd(unsigned char cmd);
void LCD_WriteData(unsigned char data_l);
void LCD_SelectScreen(unsigned int cs);
void LCD_init(void);
void SetLine(unsigned char page);
void SetColumn(unsigned char column);
void Display(unsigned char ss,unsigned char page,unsigned char column,unsigned char number);
void SetStartLine(unsigned char startline);

#endif
