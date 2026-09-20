#include<stdio.h>
#include<stdlib.h>
#include <string.h>
#include "Hash.h"

#define MAX_BOOKS 1000

struct Book {
    char title[100];
    char author[50];
    char isbn[20];
    int borrowed;
    int deleted;
    int quantity;
};

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

// 全局变量
extern struct HashTable* hashTable;
struct Book library[MAX_BOOKS];
int bookCount = 0;

/*增加书籍*/
void addBook() {
    char isbn[20];
    printf("\n请输入ISBN：");
    fgets(isbn, sizeof(isbn), stdin);
    isbn[strcspn(isbn, "\n")] = '\0';

    int index = hashSearch(isbn);
    if (index != -1 && !library[index].deleted) {
        library[index].quantity++;
        printf("已存在该ISBN的书籍，数量增加为%d！\n", library[index].quantity);
        system("pause");
        return;
    }

    int availableIndex = -1;
    for (int i = 0; i < MAX_BOOKS; i++) {
        if (i >= bookCount || library[i].deleted) {
            availableIndex = i;
            break;
        }
    }

    if (availableIndex == -1) {
        printf("图书馆已满，无法添加新书！\n");
        system("pause");
        return;
    }

    if (availableIndex < bookCount && library[availableIndex].deleted) {
        hashDelete(library[availableIndex].isbn);
    }

    struct Book newBook;
    printf("请输入书名：");
    fgets(newBook.title, sizeof(newBook.title), stdin);
    newBook.title[strcspn(newBook.title, "\n")] = '\0';

    printf("请输入作者：");
    fgets(newBook.author, sizeof(newBook.author), stdin);
    newBook.author[strcspn(newBook.author, "\n")] = '\0';

    strcpy(newBook.isbn, isbn);
    newBook.borrowed = 0;
    newBook.deleted = 0;
    newBook.quantity = 1;

    library[availableIndex] = newBook;
    hashInsert(isbn, availableIndex);

    if (availableIndex >= bookCount) {
        bookCount++;
    }

    printf("图书添加成功！\n");
    system("pause");
}

/*批量添加书籍*/
void addMultipleBooks() {
    int numBooks;
    printf("\n请输入要添加的书籍数量：");
    scanf("%d", &numBooks);
    getchar(); // 清除输入缓冲区中的换行符

    if (numBooks <= 0) {
        printf("无效的数量！\n");
        system("pause");
        return;
    }

    for (int i = 0; i < numBooks; i++) {
        printf("\n添加第%d本书籍：\n", i + 1);
        addBook(); // 直接复用单本添加函数
    }
}
/*查看当前藏书*/ 
void displayBooks() {
    system("cls");
    printf("\n%-30s%-20s%-15s%-8s%-8s%-8s\n", "书名", "作者", "ISBN", "总数", "在库", "借出");
    printf("----------------------------------------------------------------------------\n");
    
    int found = 0;
    for(int i = 0; i < bookCount; i++) {
        if (library[i].deleted) continue;
        found = 1;
        int available = library[i].quantity - library[i].borrowed;
        printf("%-30s%-20s%-15s%-8d%-8d%-8d\n", 
              library[i].title,
              library[i].author,
              library[i].isbn,
              library[i].quantity,
              available,
              library[i].borrowed);
    }
    
    if (!found) printf("\n当前图书馆没有藏书！\n");
    system("pause");
}

/*查找功能*/ 
void searchBook_ISBN(void) {
    char isbn[20];
    int c;
    while ((c = getchar()) != '\n' && c != EOF); // 清空输入缓冲区
    printf("\n请输入要搜索书籍的ISBN：");
    fgets(isbn, sizeof(isbn), stdin);
    isbn[strcspn(isbn, "\n")] = '\0';
    
    printf("\n搜索结果：\n");
    
    int index = hashSearch(isbn);
    if (index == -1 || library[index].deleted) {
        printf("未找到该ISBN的图书！\n");
        system("pause");
        return;
    }
    
    printf("--------------------------------\n");
    printf("书名：%s\n作者：%s\nISBN：%s\n总数量：%d\n在库：%d\n已借出：%d\n",
    	library[index].title,
        library[index].author,
        library[index].isbn,
        library[index].quantity,
        library[index].quantity - library[index].borrowed,
        library[index].borrowed);
   
    system("pause");
    return; 
}


void searchBook_Blurred(void) {
    char keyword[100];
    printf("\n请输入搜索关键词：");
    int c;
    while ((c = getchar()) != '\n' && c != EOF); // 清空输入缓冲区
    fgets(keyword, sizeof(keyword), stdin);
    keyword[strcspn(keyword, "\n")] = '\0';
    
    printf("\n搜索结果：\n");
    int found = 0;
    for(int i = 0; i < bookCount; i++) {
        if (library[i].deleted) continue;
        if (strstr(library[i].title, keyword) || 
            strstr(library[i].author, keyword) ||
            strstr(library[i].isbn, keyword)) {
            printf("--------------------------------\n");
            printf("书名：%s\n作者：%s\nISBN：%s\n总数量：%d\n在库：%d\n已借出：%d\n",
                  library[i].title,
                  library[i].author,
                  library[i].isbn,
                  library[i].quantity,
                  library[i].quantity - library[i].borrowed,
                  library[i].borrowed);
            found = 1;
        }
    }
    if(!found) printf("未找到相关书籍！\n");
    system("pause");
}

void  searchBook_S(void){
	system("cls");
	int k;
	printf("查找方式：\n1.ISBN快速查找\t2.模糊查找\n");
	printf("请输入查找方式：");
	scanf("\n%d",&k);
	if( k == 1)
		searchBook_ISBN();
	if( k == 2)
		 searchBook_Blurred();
	return;
}

/*删除功能*/ 
void deleteBook(void) {
    char isbn[20];
    printf("\n请输入要删除的ISBN：");
    fgets(isbn, sizeof(isbn), stdin);
    isbn[strcspn(isbn, "\n")] = '\0';

    int index = hashSearch(isbn);
    if (index == -1 || library[index].deleted) {
        printf("未找到该ISBN的图书！\n");
        system("pause");
        return;
    }

    if (library[index].quantity > 1) {
        library[index].quantity--;
        if (library[index].borrowed > library[index].quantity) {
            library[index].borrowed = library[index].quantity;
        }
        printf("数量减少到%d。\n", library[index].quantity);
    } else {
        library[index].deleted = 1;
        hashDelete(isbn);
        printf("图书已删除！\n");
    }
    system("pause");
}
/*借阅功能*/
void borrowBook(void) {
    char isbn[20];
    printf("\n请输入要借阅的ISBN：");
    fgets(isbn, sizeof(isbn), stdin);
    isbn[strcspn(isbn, "\n")] = '\0';

    int index = hashSearch(isbn);
    if (index == -1 || library[index].deleted) {
        printf("未找到该ISBN的图书！\n");
        system("pause");
        return;
    }

    if (library[index].borrowed >= library[index].quantity) {
        printf("所有副本都已被借出！\n");
    } else {
        library[index].borrowed++;
        printf("借阅成功！当前在库%d本，已借出%d本。\n", 
              library[index].quantity - library[index].borrowed,
              library[index].borrowed);
    }
    system("pause");
}

/* 排序功能 */
int compareByTitle(const void *a, const void *b) {
    return strcmp(((struct Book*)a)->title, ((struct Book*)b)->title);
}

int compareByAuthor(const void *a, const void *b) {
    return strcmp(((struct Book*)a)->author, ((struct Book*)b)->author);
}

int compareByISBN(const void *a, const void *b) {
    return strcmp(((struct Book*)a)->isbn, ((struct Book*)b)->isbn);
}

void rebuildHashTable(void) {
    // 清空哈希表
    for (int i = 0; i < hashTable->capacity; i++) {
        struct HashEntry* entry = hashTable->entries[i];
        while (entry != NULL) {
            struct HashEntry* temp = entry;
            entry = entry->next;
            free(temp);
            hashTable->size--;
        }
        hashTable->entries[i] = NULL;
    }

    // 重新插入有效条目
    for (int i = 0; i < bookCount; i++) {
        if (!library[i].deleted) {
            hashInsert(library[i].isbn, i);
        }
    }
}

void sortBooks(void) {
    struct Book temp[MAX_BOOKS];
    int count = 0;
    for (int i = 0; i < bookCount; i++) {
        if (!library[i].deleted) {
            temp[count++] = library[i];
        }
    }

    if (count == 0) {
        printf("没有可排序的书籍！\n");
        system("pause");
        return;
    }

    printf("\n请选择排序方式：\n1.书名 2.作者 3.ISBN\n选择：");
    int choice;
    scanf("%d", &choice);
    getchar();

    switch(choice) {
        case 1: qsort(temp, count, sizeof(struct Book), compareByTitle); break;
        case 2: qsort(temp, count, sizeof(struct Book), compareByAuthor); break;
        case 3: qsort(temp, count, sizeof(struct Book), compareByISBN); break;
        default: printf("无效选择！\n"); system("pause"); return;
    }

    // 更新排序结果并重建哈希表
    int j = 0;
    for (int i = 0; i < bookCount; i++) {
        if (!library[i].deleted) {
            library[i] = temp[j++];
        }
    }
    rebuildHashTable();

    printf("排序完成！\n");
    system("pause");
}

/* 界面系统 */
void Menu(void) {
    system("cls");
    printf("\n========== 图书管理系统 ==========\n");
    printf("1.登记图书\t2.查看全部书籍\n");
    printf("3.搜索书籍\t4.删除书籍\n");
    printf("5.借阅书籍\t6.书籍排序\n");
    printf("7.退出系统\t8.批量添加图书\n");
    printf("==================================\n");
    printf("请选择操作：");
}

int main() {
    hashTable = createHashTable(INITIAL_CAPACITY);
    
    while(1) {
        Menu();
        int choice;
        scanf("%d", &choice);
        getchar();

        switch(choice) {
            case 1: addBook(); break;
            case 2: displayBooks(); break;
            case 3: searchBook_S(); break;
            case 4: deleteBook(); break;
            case 5: borrowBook(); break;
            case 6: sortBooks(); break;
            case 7: 
                printf("\n感谢使用，再见！\n");
                // 释放哈希表内存
                for (int i = 0; i < hashTable->capacity; i++) {
                    struct HashEntry* entry = hashTable->entries[i];
                    while (entry != NULL) {
                        struct HashEntry* temp = entry;
                        entry = entry->next;
                        free(temp);
                    }
                }
                free(hashTable->entries);
                free(hashTable);
                exit(0);break;
            case 8: addMultipleBooks();
            default:
                printf("无效输入，请重新选择！\n");
                system("pause");
        }
    }
    return 0;
}
