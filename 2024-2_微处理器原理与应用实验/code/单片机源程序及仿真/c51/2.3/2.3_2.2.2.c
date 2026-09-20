#include<reg51.h>
#include<stdio.h>
#define uchar unsigned char
#define uint unsigned int
uchar data a[32] _at_ 0x30; //Éè¶¨Êı×éa µÄÆğÊ¼µØÖ·Îª30H
uint i _at_ 0x20; //½«±äÁ¿i ·ÅÔÚµØÖ·55H
uint j _at_ 0x22; //½«±äÁ¿iÅÔÚµØÖ·55H
uint k _at_ 0x24;
uint ad _at_ 0x26;
uint temp _at_ 0x28;
uchar table[32] = {1,3,9,2,17,4,11,6,5,20,100,64,21,14,79,35,92,7,91,23,65,16,13,18,18,73,65,101,27,19,62,69};


//Ö÷³ÌĞò
void main()
{
	SP=0x60; //Éè¶¨¶ÑÕ»Ö¸ÕëÎ»ÖÃ
	
	for(i=0;i<32;i++)
		a[i] = table[i];
	k = a[0];
	for(i=0;i<32;i++)
	{
		k=0;
		for(j=0;j<32-i;j++)
		{
			if(a[j]>k){
				k=a[j];
				ad = j;
			}
		}
		temp = a[31-i];
		a[31-i] = a[ad];
		a[ad] = temp;
	}
while(1);
}
