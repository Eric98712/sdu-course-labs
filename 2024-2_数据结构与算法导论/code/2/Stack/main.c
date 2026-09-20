#include <stdio.h>
#include <stdlib.h>
#include "ADT.h"
#include "Stack.h"


int main(){
	Stack stack;
	initStack(&stack);
	
	Push(&stack,10);//压10 
	Push(&stack,5);//压5
	Push(&stack,1);//压1
	
	printf("栈是否为空：%s\n", isEmpty_S(&stack) ? "是" : "否");  // 输出否 
	
	int elem;
    if (Pop(&stack, &elem)) {
        printf("第一个元素：%d\n", elem);  // 输出1
    }
    if (Pop(&stack, &elem)) {
        printf("第二个元素：%d\n", elem);  // 输出5
    }
    if (Pop(&stack, &elem)) {
        printf("第三个元素：%d\n", elem);  // 输出10
    }
	printf("栈是否为空：%s\n", isEmpty_S(&stack) ? "是" : "否");  // 输出是
    del_Stack(&stack);
    return 0;
}
