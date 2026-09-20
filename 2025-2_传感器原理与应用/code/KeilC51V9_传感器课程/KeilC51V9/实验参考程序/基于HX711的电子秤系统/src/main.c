#include "main.h"
#include "1602.h"
#include "HX711.h"
#include "delay.h"
#include "uart.h"

unsigned long HX711_Buffer = 0;
unsigned long Weight_Maopi = 0,Weight_Shiwu = 0;


void Get_Maopi(void)
{
	HX711_Buffer = HX711_Read();
	Weight_Maopi = HX711_Buffer/100;		
} 


void Get_Weight(void)
{
	HX711_Buffer = HX711_Read();
	HX711_Buffer = HX711_Buffer/100;
	if(HX711_Buffer >= Weight_Maopi)			
	{
		Weight_Shiwu = HX711_Buffer;
		Weight_Shiwu = Weight_Shiwu - Weight_Maopi;			        
	
		Weight_Shiwu = (unsigned int)((float)Weight_Shiwu/3.95+0.05); 	
																		
																		
																		
																		
																		
	}	
}



void main()
{							   
	uart_init();
	lcd_init();									         

	lcd_display_str(0,1,"Welcome to use! ");		  	   
	delay_ms(1000);	                         			 

	lcd_clear();						                 
	lcd_display_str(0,1,"WEIGHT:         ");
	
	Get_Maopi();			    	                     
//	delay_ms(1);

	while(1)
	{
		Get_Weight();			                         
//		send_data((Weight_Shiwu*100)>>16);
//		send_data((Weight_Shiwu*100)>>8);
//		send_data(Weight_Shiwu*100);

		
		write_command(0x80+0x40);						 
		write_data(' ');
		write_data(' ');
		write_data(' ');
		write_data(' ');
		write_data(' ');
		write_data(' ');
		write_data(' ');
		write_command(0x80+0x40);	
		if(Weight_Shiwu/10000!=0)                        
			write_data(Weight_Shiwu/10000 + 0x30);       
		if(Weight_Shiwu/1000!=0)                         
		  write_data((Weight_Shiwu%10000)/1000 + 0x30);  
		//write_data('.');
		if(Weight_Shiwu/100!=0)                          
		  write_data(((Weight_Shiwu%10000)%1000)/100 + 0x30);
		if(Weight_Shiwu/10!=0)                           
		  write_data((((Weight_Shiwu%10000)%1000)%100)/10 + 0x30);
		write_data((((Weight_Shiwu%10000)%1000)%100)%10 + 0x30);  
		write_data(' ');	
		//write_data('K');
		write_data('g'); 
    }
 }

