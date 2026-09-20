CODE SEGMENT
ASSUME CS:CODE

START:
    MOV AL, 3EH       ; 加载要转换的十六进制值
    
    ; 处理高四位
    MOV DL, AL        ; 复制值到DL
    MOV CL, 4
    SHR DL, CL        ; 右移4位获取高四位
    CALL PRINT_HEX    ; 调用子程序转换并显示
    
    ; 处理低四位
    MOV DL, AL        ; 重新加载原始值
    AND DL, 0FH       ; 掩码保留低四位
    CALL PRINT_HEX    ; 调用子程序转换并显示
    
    ; 退出程序
    MOV AH, 4CH
    INT 21H

; 子程序：将DL的低四位转换为ASCII并显示
PRINT_HEX PROC
    CMP DL, 9         ; 判断是否为数字（0-9）
    JBE ADD_DIGIT     ; 若<=9直接转数字ASCII
    ADD DL, 7         ; 若A-F需额外加7
ADD_DIGIT:
    ADD DL, 30H       ; 转换为ASCII字符
    MOV AH, 02H       ; 设置DOS显示功能
    INT 21H           ; 调用中断显示字符
    RET
PRINT_HEX ENDP

CODE ENDS
END START