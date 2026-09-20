#include<reg51.h>
#include<stdio.h>
#include "LCD12.H"

void main()
{
	unsigned int i;
	LCD_init();
	
	while(1)
	{
			SetStartLine(0);
			Display(0,0,0*16,0); 
			Display(0,0,1*16,1); 
			Display(0,0,2*16,2); 
			Display(0,0,3*16,3); 
			Display(1,0,4*16,4); 
			Display(1,0,5*16,5); 
			Display(1,0,6*16,6); 
			Display(1,0,7*16,7); 
			LCD_SelectScreen(0);
			LCD_Delay1ms(50);
	}
	return;
}
