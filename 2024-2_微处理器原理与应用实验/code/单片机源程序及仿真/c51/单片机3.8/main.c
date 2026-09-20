#include<reg51.h>
#include<stdio.h>

sbit CS = P2^7;
sbit WR_D = P3^6;
#define DataPort P0

void delay(unsigned int x)
{
	unsigned int i, j;
	for (i = 0; i < x; i++)
		for (j = 0; j < 120; j++);
}


void main()
{
	unsigned int i;
	CS = 0;
	WR_D = 1;
	while(1){
		for(i=0;i<256;i++){
			DataPort = i;
			WR_D = 0;
			delay(1);
			WR_D = 1;
			delay(1);
			
		}
	}
}

 