#include <reg51.h>
#include "intrins.h"
#include "uart.h"

#define uchar unsigned char
#define uint  unsigned int

//#define  FOSC  11059200L
//#define  BAUD  9600

/*----------------------------
Initial UART 
------------------------------*/
void uart_init(void)
{
    SCON = 0x5a;                              //8-bit data,no parity bit
	TMOD = 0x20;                              //I1 as 8-bit auto reload
	TH1 = TL1 = -(FOSC/12/32/BAUD);           //set UART baudrate
	TR1 = 1;                                  // T1 start running
}

/*-----------------------
send ont byte data to PC
input : data(UART data)
output: нч
--------------------------*/
void send_data(unsigned char dat)
{
    while(!TI);                          //wait for the previous data is sent
	TI = 0;
	SBUF = dat;                          //send current data
}