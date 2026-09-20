#include<stdio.h>
#include "bitree.h"
#include "Queue.h"
#include "ADT.h"


TreeNode* createNode(int data)
{
	TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

//void levelOrderTraversal(TreeNode* root) {
//    Queue q;
//    initQue(&q);

//    if (root != NULL) {
        // 将根节点指针转换为int入队
///        enQue(&q, root->data);
//    }

//    while (!isEmpty_Q(&q)) {
//        int element;
        // 出队节点指针
//        if (deQue(&q, &element)) {
 //           TreeNode* current = (TreeNode*)element;
//            
            // 访问节点数据
//            printf("%d", current->data);
			
            // 左子树入队
//            if (current->left != NULL) {
//                enQue(&q, (current->left->data));
//            }
            
            // 右子树入队
//            if (current->right != NULL) {
//                enQue(&q, (current->right->data));
//            }
//        }
//    }

    // 销毁队列
//    del_Queue(&q);
//}
int isEmpty_T(TreeNode* bintree) {
	if(bintree->data == NULL)
		return 0;
	return 1;
}

void levelOrderTraversal(TreeNode* bintree){
	TreeNode* q;
	TreeNode* T[Maxsize];
	
	int front,rear;
	rear = -1;
	front = -1;
	
	if(isEmpty_T(bintree)== 0)
		return;
	
	T[0] = bintree;
//	rear++;
	rear = (rear + 1 ) % Maxsize;
	while(front != rear) {
		
		front = (front + 1) % Maxsize;
		q = T[front];
		printf("%d ",q->data) ;
		
		if(q->left != NULL){
		//	rear++;
			rear = (rear + 1 ) % Maxsize;
			T[rear] = q->left;
		}
		
		if(q->right != NULL){
		//	rear++;
			rear = (rear + 1 ) % Maxsize;
			T[rear] = q->right;
		}
			
	}
	
	return;
}
 
