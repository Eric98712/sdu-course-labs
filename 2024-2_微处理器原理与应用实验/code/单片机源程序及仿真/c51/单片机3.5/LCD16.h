#ifndef _LCD16_H_
#define _LCD16_H_

sbit LCD_RS=P2^0;
sbit LCD_RW=P2^1;
sbit LCD_EN=P2^2;
#define LCD_DataPort P0


void LCD_Delay(void);
void LCD_WriteCommand(unsigned char Command);
void LCD_WriteData(unsigned char data_l);
void LCD_Init(void);
void LCD_ShowStr(unsigned char *str);
void LCD_GOXY(int line,int column);
void Delay(unsigned int n);

#endif
