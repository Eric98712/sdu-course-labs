#include<stdio.h>
#include "bitree.h" 

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        TreeNode* root = NULL;
        for (int i = 0; i < n; ++i) {
            int num;
            scanf("%d", &num);
            root = insert(root, num);
        }
        
        // 步骤2：按递增顺序输出
        int arr1[20];
        int size1 = 0;
        inOrderTraversal(root, arr1, &size1);
        for (int i = 0; i < size1; ++i) {
            if (i > 0) printf(" ");
            printf("%d", arr1[i]);
        }
        printf("\n");
        
        // 步骤3：查找key1
        int key1;
        scanf("%d", &key1);
        if (search(root, key1)) {
            printf("find\n");
        } else {
            printf("not find\n");
        }
        
        // 步骤4：插入key2
        int key2;
        scanf("%d", &key2);
        root = insert(root, key2);
        
        // 步骤5：按递减顺序输出
        int arr2[21]; // 插入后最多21个元素
        int size2 = 0;
        reverseInOrderTraversal(root, arr2, &size2);
        for (int i = 0; i < size2; ++i) {
            if (i > 0) printf(" ");
            printf("%d", arr2[i]);
        }
        printf("\n");
        
        // 释放当前树的内存
        freeTree(root);
        root = NULL;
    }
    return 0;
}
