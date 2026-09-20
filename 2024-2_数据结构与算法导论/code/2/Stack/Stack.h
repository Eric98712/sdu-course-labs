#ifndef _STACK_H
#define _STACK_H

typedef struct 
{
	List list;
}Stack;

void initStack(Stack* Stack);
int isEmpty_S(Stack* Stack);
int Push(Stack* Stack,int data);
int Pop(Stack* Stack,int *element);
void del_Stack(Stack* Stack);
#endif
