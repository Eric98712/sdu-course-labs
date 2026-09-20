
#include <reg51.h>
#include "typedef.h"
#include "LCD1602.H"
#include "DHT11.H"


void main()
{
 Lcd_Init();                         
 while(1)                             
 {
    RH();                             
	Write_String(0x80,"humidity:");   
	Write_Char(0x89,RH_data_H/10+48); 
	Write_Char(0x8a,RH_data_H%10+48); 
	Write_String(0x8b,"%rh");         

	Write_String(0xc0,"temperature:");
	Write_Char(0xcc,T_data_H/10+48);  
	Write_Char(0xcd,T_data_H%10+48);  
	Write_Char(0xce,0xdf);            
	Write_Char(0xcf,'C');             
 }
}
