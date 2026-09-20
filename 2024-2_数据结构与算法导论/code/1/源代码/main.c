#include <stdio.h>
#include <stdlib.h>
#include "ADT.h"


int main() {
    List list;
    initList(&list);

    // 插入测试
    insertAt(&list, 1, 10);  // 链表：10
    insertAt(&list, 2, 20);  // 链表：10 -> 20
    insertAt(&list, 1, 5);   // 链表：5 -> 10 -> 20

    int elem;
    if (getElement(&list, 1, &elem)) {
        printf("第一个元素：%d\n", elem);  // 输出5
    }
    if (getElement(&list, 2, &elem)) {
        printf("第二个元素：%d\n", elem);  // 输出10
    }
    if (getElement(&list, 3, &elem)) {
        printf("第三个元素：%d\n", elem);  // 输出20
    }

    // 删除测试
    deleteAt(&list, 2);      // 删除第二个元素，链表：5 -> 20
    if (getElement(&list, 2, &elem)) {
        printf("删除后的第二个元素：%d\n", elem);  // 输出20
    }

    // 判断空表
    printf("表是否为空：%s\n", isEmpty(&list) ? "是" : "否");  // 输出否

    // 清空链表
    deleteAt(&list, 1);
    deleteAt(&list, 1);
    printf("表是否为空：%s\n", isEmpty(&list) ? "是" : "否");  // 输出是

    deleteList(&list);
    return 0;
}
