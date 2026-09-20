#include<stdio.h>
#include<stdlib.h>
#include <string.h>
#include "Hash.H"

struct HashTable* hashTable; 

struct HashEntry {
    char isbn[20];
    int index;
    struct HashEntry* next;
};

struct HashTable {
    int capacity;
    int size;
    struct HashEntry** entries;
};

int isPrime(int n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    for (int i = 5; i * i <= n; i += 6)
        if (n % i == 0 || n % (i + 2) == 0) return 0;
    return 1;
}

int nextPrime(int n) {
    if (n <= 1) return 2;
    while (!isPrime(++n));
    return n;
}

/* 哈希函数 */
int hash(char* isbn, int capacity) {
    unsigned long hash_val = 0;
    while (*isbn) {
        hash_val = hash_val * 31 + *isbn++;
    }
    return hash_val % capacity;
}

/* 创建哈希表 */
struct HashTable* createHashTable(int initialCapacity) {
    struct HashTable* table = (struct HashTable*)malloc(sizeof(struct HashTable));
    table->capacity = isPrime(initialCapacity) ? initialCapacity : nextPrime(initialCapacity);
    table->size = 0;
    table->entries = (struct HashEntry**)calloc(table->capacity, sizeof(struct HashEntry*));
    return table;
}

/* 扩容重组哈希表 */
void resize(struct HashTable* table) {
    int newCapacity = nextPrime(table->capacity * 2);
    struct HashEntry** newEntries = (struct HashEntry**)calloc(newCapacity, sizeof(struct HashEntry*));
    
    // 重新哈希所有条目
    for (int i = 0; i < table->capacity; i++) {
        struct HashEntry* entry = table->entries[i];
        while (entry != NULL) {
            struct HashEntry* next = entry->next;
            int newIndex = hash(entry->isbn, newCapacity);
            entry->next = newEntries[newIndex];
            newEntries[newIndex] = entry;
            entry = next;
        }
    }
    
    free(table->entries);
    table->entries = newEntries;
    table->capacity = newCapacity;
}

/* 哈希表插入 */
void hashInsert(char* isbn, int index) {
    // 检查负载因子
    if ((float)hashTable->size / hashTable->capacity > LOAD_FACTOR) {
        resize(hashTable);
    }
    
    int hashVal = hash(isbn, hashTable->capacity);
    struct HashEntry* newEntry = (struct HashEntry*)malloc(sizeof(struct HashEntry));
    strcpy(newEntry->isbn, isbn);
    newEntry->index = index;
    newEntry->next = hashTable->entries[hashVal];
    hashTable->entries[hashVal] = newEntry;
    hashTable->size++;
}

/* 哈希表查找 */
int hashSearch(char* isbn) {
    int hashVal = hash(isbn, hashTable->capacity);
    struct HashEntry* entry = hashTable->entries[hashVal];
    
    while (entry != NULL) {
        if (strcmp(entry->isbn, isbn) == 0) {
            return entry->index;
        }
        entry = entry->next;
    }
    return -1;
}

/* 哈希表删除 */
void hashDelete(char* isbn) {
    int hashVal = hash(isbn, hashTable->capacity);
    struct HashEntry** prev = &hashTable->entries[hashVal];
    struct HashEntry* current = hashTable->entries[hashVal];
    
    while (current != NULL) {
        if (strcmp(current->isbn, isbn) == 0) {
            *prev = current->next;
            free(current);
            hashTable->size--;
            return;
        }
        prev = &(current->next);
        current = current->next;
    }
}

