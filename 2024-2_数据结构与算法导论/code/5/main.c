#include<stdio.h>
#include<stdlib.h>
#include "Hash.h"



int main() {
    // 创建初始容量为11的哈希表
    HashTable* table = createHashTable(5);
    
    // 插入测试数据
    insert(table, 10);
    insert(table, 20);
    insert(table, 30);
    insert(table, 40);
    insert(table, 50);

    // 查找测试
    int position;
    printf("Search 20: %s\n", search(table, 20, &position) ? "Found" : "Not found");
    printf("Search 60: %s\n", search(table, 60, &position) ? "Found" : "Not found");

    // 打印哈希表当前状态
    printHashTable(table);

    // 释放内存
    free(table->data);
    free(table->status);
    free(table);
    return 0;
}

