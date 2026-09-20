#ifndef _bitree_H
#define _bitree_H

#define Maxsize 255 
//定义树节点
typedef struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;



TreeNode* createNode(int data);//创建树节点
//void levelOrderTraversal(TreeNode* root);
void levelOrderTraversal(TreeNode* bintree);//层次遍历

#endif

