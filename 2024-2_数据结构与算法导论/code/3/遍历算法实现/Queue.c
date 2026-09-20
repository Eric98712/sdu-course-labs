#include <stdio.h>
#include <stdlib.h>
#include "ADT.h"
#include "Queue.h"
#include "bitree.h"

void initQue(Queue* Queue){
	initList(&Queue->list);
}

int isEmpty_Q(Queue* Queue){
	return isEmpty_L(&Queue->list);
}

int enQue(Queue* Queue,int data){
	if(Queue->list.size == 0){
		insertAt(&Queue->list ,1, data);
	}	
	insertAt(&Queue->list ,Queue->list.size, data);
	return 1;
}

int deQue(Queue* Queue,int *element){
	 if (isEmpty_Q(Queue)) {
        return 0;
    }
	getElement(&Queue->list, 1 , element);
	deleteAt(&Queue->list, 1);
}

void del_Queue(Queue* Queue)
{
	destroyList(&Queue->list);
}

