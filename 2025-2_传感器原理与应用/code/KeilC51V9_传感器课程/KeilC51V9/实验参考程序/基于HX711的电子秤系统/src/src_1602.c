#include <reg52.h>
#include "1602.h"
#include "delay.h"

#define uchar unsigned char
#define uint  unsigned int

// Write a command
void write_command(uchar com)
{ 
	E = 0;
	RS = 0;
	RW = 0;
	DATA_BUS = com;
	delay_ms(1);
	E = 1;
	delay_ms(1);
	E = 0;
}

// Write Data
void write_data(uchar wdata)
{ 
	E = 0;
	RS = 1;
	RW = 0;
	DATA_BUS = wdata;

	E = 1;
	delay_ms(1);
	E = 0;   
}

// Initialize LCD controller
void lcd_init(void)
{ 
	write_command(0x38);                        // 8-bits, 2 lines, 7x5 dots
	write_command(0x0C);                        // no cursor, no blink, enable display
	write_command(0x06);                        // auto-increment on
	write_command(0x01);                        // clear screen
}

// Display a string
void lcd_display_str(uchar x,uchar y, uchar *s)
{ 
	if(y ==1)
		write_command(0x80+x);
	else
		write_command(0xc0+x);
			
	while(*s>0)
	{ 
		write_data(*s++);
	}
}

void lcd_1602_display_char(uchar x, uchar y,uchar dat)
{
	if(y ==1)
		write_command(0x80+x);
	else
		write_command(0xc0+x);
			
	write_data(dat);
}

void lcd_1602_display_num(uchar x,uchar y,uchar num)
{
	if(y == 1)
		write_command(0x80+x);
	else
		write_command(0xc0+x);

	write_data(0x30+num);
}

void lcd_1602_display_number(uchar x,uchar y,uchar num)
{
	uchar bai = 0;
	uchar shi = 0;
	uchar ge  = 0;
				
	if(num>99)
	{
		ge  = num%10;
		shi = num%100/10;
		bai = num/100; 

		lcd_1602_display_num(x,y,bai);
		lcd_1602_display_num(x+1,y,shi);
		lcd_1602_display_num(x+2,y,ge);
	}
	else if(num>9)
	{
		ge  = num%10;
		shi = num/10;

		lcd_1602_display_num(x,y,shi);
		lcd_1602_display_num(x+1,y,ge);
	}
	else
	{
		ge = num;
		lcd_1602_display_num(x,y,ge);
	}
}

void lcd_clear(void)
{
	write_command(0x01);                             // clear screen
}

