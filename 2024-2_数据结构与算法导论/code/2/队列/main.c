#include <stdio.h>
#include <stdlib.h>
#include "ADT.h"
#include "Queue.h"

int main()
{
	Queue queue;
	initQue(&queue);
	
	enQue(&queue,1);//
	enQue(&queue,2);
	enQue(&queue,3);
	
	printf("队列是否为空：%s\n", isEmpty_Q(&queue) ? "是" : "否");  // 输出否 
	
	int elem;
    deQue(&queue, &elem); 
    printf("第一个元素：%d\n", elem);  // 输出1
    
    deQue(&queue, &elem);
    printf("第二个元素：%d\n", elem);  // 输出2
    
	deQue(&queue, &elem); 
    printf("第三个元素：%d\n", elem);  // 输出3
    
	printf("队列是否为空：%s\n", isEmpty_Q(&queue) ? "是" : "否");  // 输出是
    del_Queue(&queue);
    return 0;
 } 
