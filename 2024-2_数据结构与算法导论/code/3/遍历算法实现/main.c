#include<stdio.h>
#include "ADT.h"
#include "Queue.h"
#include "bitree.h"

int main() {
	//创造一棵二叉树 
	TreeNode* root = createNode(10);
    root->left = createNode(5);
    root->right = createNode(15);
    root->left->left = createNode(3);
    root->left->right = createNode(7);
    root->right->left = createNode(12);
    root->right->right = createNode(20);

    // 执行层次遍历
    printf("层次遍历结果: ");
 //   levelOrderTraversal(root);
	levelOrderTraversal(root);
    // 释放内存（实际项目中需递归释放）
    free(root->right->right);
    free(root->right->left);
    free(root->right);
    free(root->left->right);
    free(root->left->left);
    free(root->left);
    free(root);
	return 0;
}
