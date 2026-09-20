#include<stdio.h>
#include <stdlib.h>
#include "bitree.h"
#include "ADT.h"



TreeNode* createNode(int data)
{
	TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}


int isEmpty_T(TreeNode* bintree) {
	if(bintree->data == NULL)
		return 0;
	return 1;
}
// 插入节点函数
TreeNode* insert(TreeNode* root, int key) {
    if (root == NULL) {
        TreeNode* newNode = (TreeNode*)malloc(sizeof(TreeNode));
        newNode->data = key;
        newNode->left = newNode->right = NULL;
        return newNode;
    }
    if (key < root->data) {
        root->left = insert(root->left, key);
    } else if (key > root->data) {
        root->right = insert(root->right, key);
    }
    // 如果等于，不做任何操作
    return root;
}

// 查找节点函数
int search(TreeNode* root, int key) {
    if (root == NULL) return 0;
    if (key == root->data) return 1;
    if (key < root->data) return search(root->left, key);
    else return search(root->right, key);
}

// 中序遍历并填充数组
void inOrderTraversal(TreeNode* root, int* arr, int* index) {
    if (root == NULL) return;
    inOrderTraversal(root->left, arr, index);
    arr[(*index)++] = root->data;
    inOrderTraversal(root->right, arr, index);
}

// 逆中序遍历并填充数组（递减）
void reverseInOrderTraversal(TreeNode* root, int* arr, int* index) {
    if (root == NULL) return;
    reverseInOrderTraversal(root->right, arr, index);
    arr[(*index)++] = root->data;
    reverseInOrderTraversal(root->left, arr, index);
}

// 释放树的内存
void freeTree(TreeNode* root) {
    if (root == NULL) return;
    freeTree(root->left);
    freeTree(root->right);
    free(root);
}

void LevelTraversal(TreeNode* bintree){
	TreeNode* q;
	TreeNode* T[Maxsize];
	
	int front,rear;
	rear = -1;
	front = -1;
	
	if(isEmpty_T(bintree)== 0)
		return;
	
	T[0] = bintree;
	rear++;
	
	while(front != rear) {
		
		front++;
		q = T[front];
		printf("%d ",q->data);
		
		if(q->left != NULL){
			rear++;
			T[rear] = q->left;
		}
		
		if(q->right != NULL){
			rear++;
			T[rear] = q->right;
		}
			
	}
	
	return;
}
 
