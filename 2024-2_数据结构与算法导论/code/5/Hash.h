#ifndef _Hash_H
#define _Hash_H

// 哈希表结构定义
typedef struct HashTable {
    int *data;      // 存储数据的数组
    int *status;    // 槽位状态数组：0-空 1-已用 2-已删除
    int capacity;   // 哈希表总容量（始终保持为质数）
    int size;       // 当前存储元素数量
} HashTable;

int hash(int key, int capacity);
HashTable* createHashTable(int initialCapacity);
void resize(HashTable* table, int newCapacity);
int insert(HashTable* table, int key);
int search(HashTable* table, int key, int* pos);
void printHashTable(HashTable* table);

#endif
