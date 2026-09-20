ORG 0000H
AJMP MAIN
ORG 0030H

MAIN:
    MOV SP, #60H        ; 设置堆栈指针

MAIN_LOOP:
    ; 第一部分输出
    MOV DPTR, #0FE00H   ; 外部地址FE00H
    MOV A, #0F3H
    MOVX @DPTR, A       ; 使用MOVX写入外部存储器

    MOV DPTR, #0FD00H   ; 外部地址FD00H
    MOV A, #0CH
    MOVX @DPTR, A

    MOV R4, #0AH        ; 循环10次，使用立即数
LOOP_DELAY1:
    LCALL DELAY_1S
    DJNZ R4, LOOP_DELAY1

    ; 第二部分输出
    MOV DPTR, #0FE00H
    MOV A, #0C3H
    MOVX @DPTR, A

    MOV DPTR, #0FD00H
    MOV A, #0FH
    MOVX @DPTR, A

    MOV R4, #02H        ; 循环2次
LOOP_DELAY2:
    LCALL DELAY_1S
    DJNZ R4, LOOP_DELAY2

    ; 第三部分输出
    MOV DPTR, #0FE00H
    MOV A, #0FCH
    MOVX @DPTR, A

    MOV DPTR, #0FD00H
    MOV A, #03H
    MOVX @DPTR, A

    MOV R4, #0AH        ; 循环10次
LOOP_DELAY3:
    LCALL DELAY_1S
    DJNZ R4, LOOP_DELAY3

    ; 第四部分输出
    MOV DPTR, #0FE00H
    MOV A, #03CH
    MOVX @DPTR, A

    MOV DPTR, #0FD00H
    MOV A, #0FH
    MOVX @DPTR, A

    MOV R4, #02H        ; 循环2次
LOOP_DELAY4:
    LCALL DELAY_1S
    DJNZ R4, LOOP_DELAY4

    AJMP MAIN_LOOP      ; 返回主循环

; 延时约1秒的子程序（基于12MHz晶振）
DELAY_1S:
    MOV R5, #10         ; 外层循环10次
DELAY_OUTER:
    MOV R6, #200        ; 中层循环200次
DELAY_MID:
    MOV R7, #248        ; 内层循环248次
DELAY_INNER:
    DJNZ R7, DELAY_INNER ; 248×2 = 496周期
    DJNZ R6, DELAY_MID  ; 200×498周期
    DJNZ R5, DELAY_OUTER ; 10×99600 = 996000周期（约0.996秒）
    RET

END