#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME_LENGTH 50

typedef struct {
    char name[MAX_NAME_LENGTH];
    int score;
    int rank;
} Student;


// 快速排序
void quickSort(Student arr[], int low, int high) {
    int k = arr[low].score,sflag=0; 
    for (int i = low; i <= high; i++) {
        if(arr[i].score != k){
            sflag=1;
        }
    }

    if(sflag==0){
        return;
    }

    if (low < high) {
    	
        int pi = low;
        int pivot = arr[low].score; // 选择第一个元素作为基准值
    
    	for (int j = low + 1; j <= high; j++) {
        // 将分数大于等于基准的元素移到左侧
        	if (arr[j].score >= pivot) {
            	pi++;
            	Student temp = arr[pi];
            	arr[pi] = arr[j];
            	arr[j] = temp;
        	}
    	}
    // 将基准值放到正确位置
    	Student temp = arr[low];
    	arr[low] = arr[pi];
    	arr[pi] = temp;
    
        quickSort(arr, low, pi - 1);   // 递归排序左子数组
        quickSort(arr, pi + 1, high);  // 递归排序右子数组
    }
}

int main() {
    int n;
    
    // 输入学生人数
    printf("请输入学生人数：");
    scanf("%d", &n);
    
    // 动态分配内存存储学生信息
    Student *students = (Student *)malloc(n * sizeof(Student));
    if (students == NULL) {
        printf("内存分配失败！\n");
        return 1;
    }
    
    // 输入学生信息
    for (int i = 0; i < n; i++) {
        printf("请输入第 %d 个学生的姓名和分数（用空格分隔）：", i + 1);
        scanf("%s %d", students[i].name, &students[i].score);
    }
    
    // 快速排序（降序）
    quickSort(students, 0, n - 1);
    
    // 计算名次
    if (n > 0) {
        students[0].rank = 1;
        for (int i = 1; i < n; i++) {
            if (students[i].score == students[i - 1].score) {
                students[i].rank = students[i - 1].rank; // 分数相同则名次相同
            } else {
                students[i].rank = i + 1; // 分数不同则名次为当前位置（从1开始）
            }
        }
    }
    
    // 任务一：按分数高低输出名次
	printf("\n");
    printf("%-10s%-6s%-6s\n", "姓名", "分数", "名次");
    printf("----------------------------------------------------\n");
    for (int i = 0; i < n; i++) {
        printf("%-10s%-6d%-6d\n", students[i].name, students[i].score, students[i].rank);
    }
    
    // 任务二：按名次顺序列出学生
    printf("\n--------------------- 任务二结果 ---------------------\n");
    printf("%-6s%-10s%-6s\n", "名次", "姓名", "分数");
    printf("----------------------------------------------------\n");
    for (int i = 0; i < n; i++) {
        printf("%-6d%-10s%-6d\n", students[i].rank, students[i].name, students[i].score);
    }
    
    // 释放动态分配的内存
    free(students);
    
    return 0;
}
