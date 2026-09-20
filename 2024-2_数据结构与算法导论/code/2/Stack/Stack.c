#include <stdio.h>
#include <stdlib.h>
#include "ADT.h"
#include "Stack.h"

/* 初始化栈结构 
 * 参数: Stack - 指向需要初始化的栈的指针
 * 功能: 通过调用链表初始化函数来初始化栈的底层数据结构
 */
void initStack(Stack* Stack){
	initList(&Stack->list);
}

/* 判断栈是否为空
 * 参数: Stack - 指向要检查的栈的指针
 * 返回: 1表示栈空，0表示非空
 */
int isEmpty_S(Stack* Stack){
	isEmpty_L(&Stack->list);
}

/* 元素压栈操作
 * 参数: Stack - 目标栈指针，data - 要压入的整型数据
 * 返回: 操作结果（成功/失败）
 * 特点: 在链表头部插入实现后进先出特性
 *       插入位置1表示在链表第一个节点位置插入
 */
int Push(Stack* Stack,int data){
	insertAt(&Stack->list , 1 , data);
}

/* 元素弹栈操作
 * 参数: Stack - 目标栈指针，element - 用于存储弹出值的指针
 * 返回: 操作结果（成功1/失败0）
 * 流程: 1. 检查栈空状态
 *       2. 获取链表第一个节点的数据
 *       3. 删除链表第一个节点
 */
int Pop(Stack* Stack,int *element){
	 if (isEmpty_S(&Stack->list)) {
        return 0; // 栈空
    }
	getElement(&Stack->list, 1 , element);
	deleteAt(&Stack->list, 1);
}

/* 销毁栈结构
 * 参数: Stack - 要销毁的栈指针
 * 功能: 通过销毁底层链表释放栈占用的所有内存资源
 */
void del_Stack(Stack* Stack)
{
	destroyList(&Stack->list);
}
