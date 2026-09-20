#include<stdio.H>
#include "Hash.h" 
#include<stdlib.h>

/* 判断是否为质数的函数
 * 参数：n - 要判断的数字
 * 返回值：true-是质数，false-不是质数
 */
int isPrime(int n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;  // 2和3是质数
    // 排除能被2或3整除的数
    if (n % 2 == 0 || n % 3 == 0) return 0;
    // 检查6k±1形式的因数
    for (int i = 5; i * i <= n; i += 6)
        if (n % i == 0 || n % (i + 2) == 0) return 0;
    return 1;
}

/* 获取下一个质数的函数
 * 参数：n - 起始数字
 * 返回值：大于n的最小质数
 */
int nextPrime(int n) {
    if (n <= 1) return 2;
    while (!isPrime(++n)); // 循环查找直到找到质数
    return n;
}

/* 哈希函数（除留余数法）
 * 参数：key - 键值，capacity - 当前哈希表容量
 * 返回值：计算得到的哈希值
 */
int hash(int key, int capacity) {
    return key % capacity;  // 对容量取模
}

/* 创建哈希表
 * 参数：initialCapacity - 初始容量
 * 返回值：初始化好的哈希表指针
 */
HashTable* createHashTable(int initialCapacity) {
    HashTable* table = (HashTable*)malloc(sizeof(HashTable));
    // 将容量设置为比初始容量大的最小质数
    table->capacity = initialCapacity;
    if(isPrime(initialCapacity) == 0)
    	table->capacity = nextPrime(initialCapacity);
    table->size = 0;
    	// 分配存储空间
    table->data = (int*)malloc(table->capacity * sizeof(int));
    table->status = (int*)malloc(table->capacity * sizeof(int));
    // 初始化所有槽位状态为空
    for (int i = 0; i < table->capacity; i++)
        table->status[i] = 0;
    return table;
}

/* 再散列 
 * 参数：table - 哈希表指针，newCapacity - 新容量
 */
void resize(HashTable* table, int newCapacity) {
    // 创建新数组
    int* newData = (int*)malloc(newCapacity * sizeof(int));
    int* newStatus = (int*)malloc(newCapacity * sizeof(int));
    for (int i = 0; i < newCapacity; i++)
        newStatus[i] = 0;  // 初始化新状态数组

    // 保存旧数据指针
    int oldCapacity = table->capacity;
    int* oldData = table->data;
    int* oldStatus = table->status;

    // 更新表属性
    table->capacity = newCapacity;
    table->data = newData;
    table->status = newStatus;
    table->size = 0;  // 重置大小，插入时会重新计数

    // 重新插入所有有效元素
    for (int i = 0; i < oldCapacity; i++) {
        if (oldStatus[i] == 1) {  // 只处理有效元素
            int key = oldData[i];
            int idx = hash(key, newCapacity);
            // 处理新表中的冲突
            while (table->status[idx] == 1)
                idx = (idx + 1) % newCapacity;
            table->data[idx] = key;
            table->status[idx] = 1;
            table->size++;
        }
    }

    // 释放旧空间
    free(oldData);
    free(oldStatus);
}

/* 插入元素到哈希表
 * 参数：table - 哈希表指针，key - 要插入的键值
 * 返回值：true-插入成功，false-键已存在
 */
int insert(HashTable* table, int key) {
    // 检查负载因子，超过0.7时扩容
    if (table->size * 10 >= table->capacity * 7) {
        resize(table, nextPrime(table->capacity * 2));
    }

    int idx = hash(key, table->capacity);
    int firstDeleted = -1;  // 记录遇到的第一个已删除位置

    // 线性探测查找可用槽位
    for (int i = 0; i < table->capacity; i++) {
        int current = (idx + i) % table->capacity;
        
        if (table->status[current] == 1) {  // 槽位已用
            if (table->data[current] == key)
                return 0;  // 键已存在
        } 
        else if (table->status[current] == 2) {  // 槽位已删除
            if (firstDeleted == -1)  // 记录第一个可复用的位置
                firstDeleted = current;
        } 
        else {  // 找到空槽位
            if (firstDeleted != -1)  // 优先使用已删除的位置
                current = firstDeleted;
            table->data[current] = key;
            table->status[current] = 1;
            table->size++;
            return 1;
        }
    }


}

/* 查找元素
 * 参数：table - 哈希表指针，key - 查找键值，pos - 用于返回位置
 * 返回值：true-找到，false-未找到
 */
int search(HashTable* table, int key, int* pos) {
    int idx = hash(key, table->capacity);
    for (int i = 0; i < table->capacity; i++) {
        int current = (idx + i) % table->capacity;
        if (table->status[current] == 0) {  // 遇到空槽位停止查找
            *pos = -1;
            return 0;
        }
        if (table->status[current] == 1 && table->data[current] == key) {
            *pos = current;
            return 1;
        }
    }
    *pos = -1;
    return 0;
}

/* 打印哈希表状态
 * 参数：table - 哈希表指针
 */
void printHashTable(HashTable* table) {
    printf("Capacity: %d\nSize: %d\n", table->capacity, table->size);
    for (int i = 0; i < table->capacity; i++) {
        printf("Index %d: ", i);
        if (table->status[i] == 1)
            printf("%d\n", table->data[i]);
        else
            printf("%s\n", table->status[i] == 2 ? "Deleted" : "Empty");
    }
}
