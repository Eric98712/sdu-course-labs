#ifndef __LCD1602_H__
#define __LCD1602_H__

#define uchar unsigned char
#define uint  unsigned int

/*lcd1602 Control Interface*/
#define DATA_BUS  	P0
 
sbit E  = P1^5;
sbit RW = P1^6;
sbit RS = P1^7;					  

void write_command(uchar com);	                           // Write a command

void write_data(uchar wdata);	                           // Write Data

void lcd_init(void);                                       // Initialize LCD controller

void lcd_display_str(uchar x,uchar y, uchar *s);	               // Display a string		

void lcd_1602_display_char(uchar x, uchar y,uchar dat);	   // Display a char

void lcd_1602_display_num(uchar x,uchar y,uchar num);      // Display a number

void lcd_1602_display_number(uchar x,uchar y,uchar num);   // 显示一个多位数字

void lcd_clear(void);                                      // Clear lcd

#endif