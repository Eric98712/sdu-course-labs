#include <stdio.h>
#include <stdlib.h>
#include "ADT.h"
#include "Queue.h"

void initQue(Queue* Queue){
	initList(&Queue->list);
}

int isEmpty_Q(Queue* Queue){
	return isEmpty_L(&Queue->list);
}

void enQue(Queue* Queue,int data){
	if(Queue->list.size == 0){
		insertAt(&Queue->list , 1 , data);
		return ;
	}
	insertAt(&Queue->list ,(Queue->list.size)+1, data);
	return ;
}

void deQue(Queue* Queue,int *element){
	 if (isEmpty_Q(Queue)) {
	 	printf("Error");
        return ;
    }
	getElement(&Queue->list, 1 , element);
	deleteAt(&Queue->list, 1);
	return;
}

void del_Queue(Queue* Queue)
{
	destroyList(&Queue->list);
}
