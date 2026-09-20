#ifndef _ADT_H
#define _ADT_H

typedef struct Node {
    int data;
    struct Node* next;
} Node;

typedef struct {
    Node* head;
    int size;
} List;
void initList(List* list);//链表初始化
int isEmpty_L(List* list); //是否非空
int getElement(List* list, int i, int* element);//遍历链表至第i个元素
int insertAt(List* list, int i, int data);//插入操作
int deleteAt(List* list, int i);//删除操作
void destroyList(List* list);//删除链表

#endif
