#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 定义赫夫曼树节点结构
typedef struct {
    int weight;         // 权值
    int parent;         // 父节点索引
    int lchild, rchild; // 左右子节点索引
} HTNode, *HuffmanTree;

// 定义赫夫曼编码结构
typedef char **HuffmanCode;

// 选择两个权值最小且未被选中的节点
void Select(HuffmanTree HT, int n, int *s1, int *s2) {
    int min1 = 0x7FFFFFFF, min2 = 0x7FFFFFFF;
    *s1 = *s2 = 0;

    for (int i = 1; i <= n; i++) {
        if (HT[i].parent == 0) {
            if (HT[i].weight < min1) {
                min2 = min1;
                *s2 = *s1;
                min1 = HT[i].weight;
                *s1 = i;
            } else if (HT[i].weight < min2) {
                min2 = HT[i].weight;
                *s2 = i;
            }
        }
    }
}

// 创建赫夫曼树
void CreateHuffmanTree(HuffmanTree *HT, int *w, int n) {
    if (n <= 1) return;
    int m = 2 * n - 1; // 赫夫曼树的总节点数
    *HT = (HuffmanTree)malloc((m + 1) * sizeof(HTNode)); // 0号单元未用
    
    // 初始化前n个节点为叶子节点
    for (int i = 1; i <= n; i++) {
        (*HT)[i].weight = w[i-1];
        (*HT)[i].parent = 0;
        (*HT)[i].lchild = 0;
        (*HT)[i].rchild = 0;
    }
    
    // 初始化剩余节点
    for (int i = n + 1; i <= m; i++) {
        (*HT)[i].weight = 0;
        (*HT)[i].parent = 0;
        (*HT)[i].lchild = 0;
        (*HT)[i].rchild = 0;
    }
    
    // 构建赫夫曼树
    for (int i = n + 1; i <= m; i++) {
        int s1, s2;
        Select(*HT, i - 1, &s1, &s2);
        (*HT)[s1].parent = i;
        (*HT)[s2].parent = i;
        (*HT)[i].lchild = s1;
        (*HT)[i].rchild = s2;
        (*HT)[i].weight = (*HT)[s1].weight + (*HT)[s2].weight;
    }
}

// 创建赫夫曼编码
void CreateHuffmanCode(HuffmanTree HT, HuffmanCode *HC, int n) {
    *HC = (HuffmanCode)malloc((n + 1) * sizeof(char *));
    char *cd = (char *)malloc(n * sizeof(char)); // 临时存储编码
    cd[n - 1] = '\0'; // 编码结束符
    
    for (int i = 1; i <= n; i++) {
        int start = n - 1; // 编码起始位置
        int c = i;         // 当前节点
        int f = HT[i].parent; // 父节点
        
        // 从叶子到根逆向求编码
        while (f != 0) {
            --start;
            if (HT[f].lchild == c) cd[start] = '0';
            else cd[start] = '1';
            c = f;
            f = HT[f].parent;
        }
        
        // 为第i个字符分配编码空间并复制
        (*HC)[i] = (char *)malloc((n - start) * sizeof(char));
        strcpy((*HC)[i], &cd[start]);
    }
    
    free(cd); // 释放临时空间
}

int main() {
    int n;
    printf("请输入数据个数: ");
    scanf("%d", &n);
    
    int *w = (int *)malloc(n * sizeof(int));
    printf("请输入%d个整数权值:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &w[i]);
    }
    
    HuffmanTree HT;
    CreateHuffmanTree(&HT, w, n);
    
    HuffmanCode HC;
    CreateHuffmanCode(HT, &HC, n);
    
    printf("\n赫夫曼编码结果:\n");
    for (int i = 1; i <= n; i++) {
        printf("权值%d: %s\n", HT[i].weight, HC[i]);
    }
    
    // 释放内存
    for (int i = 1; i <= n; i++) free(HC[i]);
    free(HC);
    free(HT);
    free(w);
    
    return 0;
}    
