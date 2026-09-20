#ifndef	__LCD1602_H__
#define __LCD1602_H__

#include "typedef.h"
sbit RS	= P1^0;
sbit RW = P1^1;
sbit E = P1^2; 


void delayms(uint mtime);

void Write_String(uchar ad,uchar *s);
void Lcd_Init(void);
void Write_Char(uchar ad,uchar dat);

#endif