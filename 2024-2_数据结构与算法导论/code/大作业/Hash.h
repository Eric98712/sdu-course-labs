#ifndef _Hash_h_
#define _Hash_h_

#define INITIAL_CAPACITY 7
#define LOAD_FACTOR 0.7

int isPrime(int n);
int nextPrime(int n);
int hash(char* isbn, int capacity);
struct HashTable* createHashTable(int initialCapacity);
void resize(struct HashTable* table);
void hashInsert(char* isbn, int index);
int hashSearch(char* isbn);
void hashDelete(char* isbn);

#endif 
