#ifndef _DHT11_H_
#define _DHT11_H_

#include <typedef.h>


 sbit  DHT11_OUT = P1^3;

extern uchar T_data_H;
extern uchar RH_data_H;

void RH(void);



#endif




