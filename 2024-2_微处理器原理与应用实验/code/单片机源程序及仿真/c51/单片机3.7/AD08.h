#ifndef _AD08_H_
#define _AD08_H_

#include<reg51.h>
#include<stdio.h>

sbit CS =P2^7;
sbit EOC=P3^0;
sbit WR =P3^6;
sbit RD =P3^7;
sbit CLK=P3^1;
#define DataPort P0 
#define ShowPort P1
#define ContPort P2

void delay(unsigned int x);



#endif