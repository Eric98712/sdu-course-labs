#include <reg52.h>
#include <absacc.h>
#include "LCD1602.h"


#define DATABUS P0 //XBYTE[0x7FFF] 

void delayus(uchar utime)
{
  uchar i;
  for(i=utime;i>0;i--);
}

void delayms(uint mtime)
{
 uint i,j;
 for(i=mtime;i>0;i--)
 for(j=0;j<1000;j++);
}

//void Busy_Check()
//{
//  uint temp;
//  DATABUS = 0XFF; 
//  RS = 0;
//  RW = 1;
//  E = 1;
//  do
//  {
//    temp = DATABUS;
//  }
//  while(temp&0X80);
//  E = 0;
//}

void Write_Command(uchar COM)
{
  //Busy_Check();
  E = 0;
  RS = 0;
  RW = 0;
  DATABUS = COM;
  delayus(5);
  E = 1;
  delayus(5);
  E = 0;
  delayms(10);
}
void Write_Data(uchar WDATA)
{
  //Busy_Check();
  E = 0;
  RS = 1;
  RW = 0;
  DATABUS = WDATA;
  delayus(5);
  E = 1;
  delayus(5);
  E = 0;
  delayms(10);
}

void Write_Char(uchar ad,uchar dat)
{
  Write_Command(ad);
  Write_Data(dat);
}

void Write_String(uchar ad,uchar *s)
{
  Write_Command(ad);
  while(*s>0)
  {
    Write_Data(*s++);
    delayus(10);
  }
}

void Lcd_Init(void)
{
  delayms(100);
  Write_Command(0x38); 
  Write_Command(0x0c);
  Write_Command(0x06);
  Write_Command(0x01);
  Write_Command(0x38);
  delayms(100);
}