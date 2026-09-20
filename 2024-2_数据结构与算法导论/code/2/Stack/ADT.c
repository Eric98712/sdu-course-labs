#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

typedef struct {
    Node* head;
    int size;
} List;

// 初始化链表
void initList(List* list) {
    list->head = NULL;
    list->size = 0;
}

// 判断表是否为空
int isEmpty_L(List* list) {
    return list->size == 0;
}

// 获取第i个元素（i从1开始）
int getElement(List* list, int i, int* element) {
    if (i < 1 || i > list->size) {
        return 0;
    }
    Node* current = list->head;
    int pos;
    for (pos = 1; pos < i; pos++) {
        current = current->next;
    }
    *element = current->data;
    return 1;
}

// 在第i个位置插入元素
int insertAt(List* list, int i, int data) {
    if (i < 1 || i > list->size + 1) {
        return 0;
    }
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (!newNode) {
        return 0;
    }
    newNode->data = data;
    
    if (i == 1) {
        newNode->next = list->head;
        list->head = newNode;
    } else {
        Node* prev = list->head;
        int pos;
        for (pos = 1; pos < i - 1; pos++) {
            prev = prev->next;
        }
        newNode->next = prev->next;
        prev->next = newNode;
    }
    list->size++;
    return 1;
}

// 删除第i个元素
int deleteAt(List* list, int i) {
    if (i < 1 || i > list->size) {
        return 0;
    }
    Node* temp;
    if (i == 1) {
        temp = list->head;
        list->head = temp->next;
    } else {
        Node* prev = list->head;
        int pos;
        for (pos = 1; pos < i - 1; pos++) {
            prev = prev->next;
        }
        temp = prev->next;
        prev->next = temp->next;
    }
    free(temp);
    list->size--;
    return 1;
}

// 销毁链表，释放内存
void destroyList(List* list) {
    Node* current = list->head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
    list->head = NULL;
    list->size = 0;
}


