ORG 0000H
AJMP MAIN
ORG 0030H

MAIN:
    MOV SP, #60H
    ; 数据拷贝（32字节）
    MOV R1, #30H
    MOV R7, #20H
    MOV DPTR, #TABLE
    CLR A
LOOP1:
    MOVC A, @A+DPTR
    MOV @R1, A
    INC DPTR
    INC R1
    CLR A
    DJNZ R7, LOOP1

    ; 排序初始化
    MOV R2, #30H      ; 动态区间起始地址
    MOV R6, #20H      ; 外层循环次数

LOOP2:
    MOV R0, R2        ; 当前段起始地址
    MOV R7, #20H      ; 内层循环次数
    SUBB A, R2        ; 计算剩余长度
    ADD A, #30H
    MOV R7, A         ; 动态调整内层循环次数
    MOV R5, @R0       ; 取第一个元素作为初始最小值
    MOV R1, R0        ; 记录最小值地址

LOOP3:
    INC R0
    MOV A, @R0
    CLR C
    SUBB A, R5
    JNC NOT_MIN       ; 若A >= 当前最小值则跳过
    MOV R5, A         ; 更新最小值
    MOV R1, R0        ; 更新最小值地址
NOT_MIN:
    DJNZ R7, LOOP3

    ; 交换最小值与区间首元素
    MOV A, @R2
    XCH A, @R1
    MOV @R2, A

    ; 调整外层循环
    INC R2            ; 区间起始地址+1
    DJNZ R6, LOOP2

    SJMP $

ORG 3000H
TABLE: 
    DB 1,3,9,2,17,4,11,6
    DB 5,20,100,64,21,14,79,35
    DB 92,7,91,23,65,16,13,18
    DB 18,73,65,101,27,19,62,69

END