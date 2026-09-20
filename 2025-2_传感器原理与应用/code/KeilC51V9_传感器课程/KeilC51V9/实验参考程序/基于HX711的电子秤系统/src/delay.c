#include <reg51.h>
#include "intrins.h"
#include "delay.h"

#define uchar unsigned char
#define uint  unsigned int

/*----------------------------
Software delay 1 ms
------------------------------*/
void delay_ms(uint n)
 {
         uint x;

         while(n--)
         {
                 x=570;
                 while(x--);
         }
 }
