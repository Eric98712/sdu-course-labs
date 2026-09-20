#ifndef __UART_H__
#define __UART_H__

#define uchar unsigned char
#define uint  unsigned int

#define FOSC  11059200L
#define BAUD  9600	

/*----------------------------
Initial UART 
------------------------------*/
void uart_init(void);

/*-----------------------
send ont byte data to PC
input : data(UART data)
output: нч
--------------------------*/
void send_data(unsigned char dat);

#endif