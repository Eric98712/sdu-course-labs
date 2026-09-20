#include <reg51.h>
#include <intrins.h>
#include "DHT11.H"

uchar  Flag;
uchar  Temp;
uchar  T_data_H,T_data_L,RH_data_H,RH_data_L,Checkdata;
uchar  T_data_H_temp,T_data_L_temp,RH_data_H_temp,RH_data_L_temp,Checkdata_temp;
uchar  Comdata;	   
/************************************************************************
                        延时程序
************************************************************************/
void Delay20ms()		//@11.0592MHz
{
	unsigned char i, j, k;

	i = 1;
	j = 216;
	k = 35;
	do
	{
		do
		{
			while (--k);
		} while (--j);
	} while (--i);
}
void Delay_10us()		//@11.0592MHz
{
	unsigned char i;

	_nop_();
	_nop_();
	_nop_();
	i = 24;
	while (--i);
}
/*******************************************************************	
                         通讯
*******************************************************************/
void DHT11_REV(void)
{
   uchar i;
   for(i=0;i<8;i++)	   
	 {
	    Flag=2;	
	   	while((!DHT11_OUT)&&Flag++);
	    Delay_10us();
		Delay_10us();
	    Delay_10us();
		Delay_10us();
	  	Temp=0;
	    if(DHT11_OUT)Temp=1;
		   Flag=2;
		while((DHT11_OUT)&&Flag++);     	//超时则跳出for循环		  
	   	if(Flag==1)break;                   //判断数据位是0还是1	  
		                                    //如果高电平高过预定0高电平值则数据位为1	   	 
		   Comdata<<=1;
	   	   Comdata|=Temp;        
	  }  
}
/********************************************************************
			    	温度读取子程序
********************************************************************/
void RH(void)
{
  DHT11_OUT=0;
  Delay20ms();
  DHT11_OUT=1;
  Delay_10us();
  Delay_10us();
  Delay_10us();
  Delay_10us(); 
  Delay_10us();
  Delay_10us();
  DHT11_OUT=1;
  if(!DHT11_OUT)		 	  
	{
	   Flag=2;	 
	   while((!DHT11_OUT)&&Flag++);
	   Flag=2;
	   while((DHT11_OUT)&&Flag++);	 
	   DHT11_REV();
	   RH_data_H_temp=Comdata;
	   DHT11_REV();
	   RH_data_L_temp=Comdata;
	   DHT11_REV();
	   T_data_H_temp=Comdata;
	   DHT11_REV();
	   T_data_L_temp=Comdata;
	   DHT11_REV();
	   Checkdata_temp=Comdata;
	   DHT11_OUT=1;
	   Temp=(T_data_H_temp+T_data_L_temp+RH_data_H_temp+RH_data_L_temp);
	   if(Temp==Checkdata_temp)
	   {
	   	  RH_data_H=RH_data_H_temp;
	   	  RH_data_L=RH_data_L_temp;
		  T_data_H=T_data_H_temp;
	   	  T_data_L=T_data_L_temp;
	   	  Checkdata=Checkdata_temp;
	   }
    }
}