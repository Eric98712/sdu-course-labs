% 输入系统系数
A = [ 13, 8, 2, -4, -1];
B = [ 2, -3, 9, -26, 18];

% 调用函数并输出结果
[Numerator, Denominator] = DSP_5_1_Cascade(B, A);
disp('Numerator Coefficients ：');
disp(Numerator);
disp('Denominator Coefficients ：');
disp(Denominator);