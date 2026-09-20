#ifndef _Queue_H
#define _Queue_H

#include <stdio.h>
#include <stdlib.h>
#include "ADT.h"
	
typedef struct{
	List list;
}Queue;

void initQue(Queue* Queue);
int isEmpty_Q(Queue* Queue);
int enQue(Queue* Queue,int data);
int deQue(Queue* Queue,int *element);
void del_Queue(Queue* Queue);

#endif
