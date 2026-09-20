#include<reg51.h>
#include<stdio.h>
#include "LCD16.H"

void main()
{
	unsigned char *str1 = "WINDWAY";
	unsigned char *str2 = "A GOOD NEWS";

	LCD_Init();
	while(1){
		LCD_GOXY(0,0);
		LCD_ShowStr(str1);
		LCD_GOXY(1,0);
		LCD_ShowStr(str2);
		Delay(20);
//		LCD_Init();
		Delay(5);
	}
	return;
}
