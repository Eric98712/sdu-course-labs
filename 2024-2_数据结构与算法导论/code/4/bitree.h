#ifndef _bitree_H
#define _bitree_H

#define Maxsize 255 

typedef struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;



TreeNode* createNode(int data);
int isEmpty_T(TreeNode* bintree);
TreeNode* insert(TreeNode* root, int key);
void levelOrderTraversal(TreeNode* root);
int search(TreeNode* root, int key);
void inOrderTraversal(TreeNode* root, int* arr, int* index);
void reverseInOrderTraversal(TreeNode* root, int* arr, int* index);
void freeTree(TreeNode* root);




















#endif

