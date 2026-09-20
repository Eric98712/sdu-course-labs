#include <stdio.h>
#include <stdlib.h>

/* 链表节点结构体 
 * 包含数据域和指向下一个节点的指针 */
typedef struct Node {
    int data;           // 节点存储的数据
    struct Node* next;  // 指向下一个节点的指针
} Node;

/* 链表结构体 
 * 包含链表头指针和记录链表长度的size */
typedef struct {
    Node* head;  // 指向链表第一个节点的指针
    int size;    // 记录链表当前节点数量
} List;

/* 初始化链表 
 * 将链表头指针置空，size置0 
 * 参数：list-要初始化的链表指针 */
void initList(List* list) {
    list->head = NULL;
    list->size = 0;
}

/* 判断链表是否为空 
 * 参数：list-链表指针 
 * 返回值：1表示空表，0表示非空表 */
int isEmpty(List* list) {
    return list->size == 0;
}

/* 获取链表中第i个元素的值（i从1开始计数）
 * 参数：list-链表指针，i-元素位置，element-用于存储获取值的指针
 * 返回值：1成功获取，0获取失败（i越界） */
int getElement(List* list, int i, int* element) {
    // 检查位置有效性（1 ≤ i ≤ size）
    if (i < 1 || i > list->size) {
        return 0;
    }
    
    // 从头节点开始遍历到第i个节点
    Node* current = list->head;
    for (int pos = 1; pos < i; pos++) {
        current = current->next;
    }
    
    *element = current->data;  // 通过指针参数返回元素值
    return 1;
}

/* 在链表第i个位置插入新节点（i从1开始，允许插入到size+1位置）
 * 参数：list-链表指针，i-插入位置，data-插入的数据
 * 返回值：1插入成功，0插入失败（i越界或内存分配失败） */
int insertAt(List* list, int i, int data) {
    // 检查位置有效性（1 ≤ i ≤ size+1）
    if (i < 1 || i > list->size + 1) {
        return 0;
    }
    
    // 创建新节点并分配内存
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (!newNode) {
        return 0;  // 内存分配失败
    }
    newNode->data = data;
    
    if (i == 1) {  // 插入到链表头部
        newNode->next = list->head;
        list->head = newNode;
    } else {       // 插入到中间或尾部
        // 找到第i-1个节点作为前驱节点
        Node* prev = list->head;
        for (int pos = 1; pos < i - 1; pos++) {
            prev = prev->next;
        }
        // 将新节点插入到前驱节点之后
        newNode->next = prev->next;
        prev->next = newNode;
    }
    
    list->size++;  // 更新链表长度
    return 1;
}

/* 删除链表中第i个节点（i从1开始）
 * 参数：list-链表指针，i-要删除的位置
 * 返回值：1删除成功，0删除失败（i越界） */
int deleteAt(List* list, int i) {
    // 检查位置有效性（1 ≤ i ≤ size）
    if (i < 1 || i > list->size) {
        return 0;
    }
    
    Node* temp;  // 用于保存要删除的节点指针
    if (i == 1) {  // 删除头节点
        temp = list->head;
        list->head = temp->next;  // 更新头指针
    } else {
        // 找到第i-1个节点作为前驱节点
        Node* prev = list->head;
        for (int pos = 1; pos < i - 1; pos++) {
            prev = prev->next;
        }
        temp = prev->next;        // 保存要删除的节点
        prev->next = temp->next;  // 前驱节点指向被删节点的下一个
    }
    
    free(temp);     // 释放被删除节点的内存
    list->size--;   // 更新链表长度
    return 1;
}

/* 销毁链表，释放所有节点内存 
 * 参数：list-链表指针 */
void deleteList(List* list) {
    Node* current = list->head;
    // 遍历链表逐个释放节点内存
    while (current != NULL) {
        Node* temp = current;     // 保存当前节点指针
        current = current->next;  // 移动到下一个节点
        free(temp);               // 释放当前节点内存
    }
    // 重置链表状态
    list->head = NULL;
    list->size = 0;
}
