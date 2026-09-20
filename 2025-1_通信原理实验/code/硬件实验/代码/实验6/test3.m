clc;  
clear;  
close all;  
  
% ================= 参数定义 =================  
% 定义输入二进制序列 (空格仅为了视觉分隔)  
% 序列: 00, 11, 01, 10, 11, 10, 11, 11  
bits = [0 0  1 1  0 1  1 0  1 1  1 0  1 1  1 1];  
  
Tb = 1;             % 比特宽度 (秒)  
Ts = 2 * Tb;        % 符号宽度 (秒)，四进制符号持续时间是比特的两倍  
fs = 100;           % 采样率 (每个比特采样点数)  
  
% ================= 信号处理 =================  
  
% 1. 串并转换 (S/P Conversion)  
% I路：取奇数位置的比特 (第1, 3, 5...)  
I_bits = bits(1:2:end);  
  
% Q路：取偶数位置的比特 (第2, 4, 6...)  
Q_bits = bits(2:2:end);  
  
% 2. 生成波形数据 (单极性不归零矩形脉冲)  
% 原始串行信号  
serial_wave = [];  
for b = bits  
    serial_wave = [serial_wave, b * ones(1, fs)];  
end  
  
% I路信号 (注意持续时间是 2*fs)  
I_wave = [];  
for b = I_bits  
    I_wave = [I_wave, b * ones(1, 2*fs)];  
end  
  
% Q路信号 (注意持续时间是 2*fs)  
Q_wave = [];  
for b = Q_bits  
    Q_wave = [Q_wave, b * ones(1, 2*fs)];  
end  
  
% 生成时间轴  
total_time = length(bits) * Tb;  
t = linspace(0, total_time, length(serial_wave));  
  
% ================= 画图 =================  
figure('Color', 'w'); % 设置背景为白色  
  
% 1. 绘制原信号 (Serial)  
subplot(3,1,1);  
plot(t, serial_wave, 'LineWidth', 2, 'Color', 'b');  
axis([0 total_time -0.2 1.2]); % 设置坐标轴范围  
title(['原始串行二进制信号 (位宽 T_b=' num2str(Tb) ')']);  
xlabel('时间 (t)');  
ylabel('幅度');  
grid on;  
set(gca, 'XTick', 0:Tb:total_time); % 设置X轴刻度与比特对齐  
  
% 2. 绘制 I 路信号  
subplot(3,1,2);  
plot(t, I_wave, 'LineWidth', 2, 'Color', 'r');  
axis([0 total_time -0.2 1.2]);  
title(['I 路信号 (串并转换后, 符号宽 T_s=' num2str(Ts) ')']);  
xlabel('时间 (t)');  
ylabel('幅度');  
grid on;  
set(gca, 'XTick', 0:Ts:total_time); % 设置X轴刻度与符号对齐  
  
% 3. 绘制 Q 路信号  
subplot(3,1,3);  
plot(t, Q_wave, 'LineWidth', 2, 'Color', 'g');  
axis([0 total_time -0.2 1.2]);  
title(['Q 路信号 (串并转换后, 符号宽 T_s=' num2str(Ts) ')']);  
xlabel('时间 (t)');  
ylabel('幅度');  
grid on;  
set(gca, 'XTick', 0:Ts:total_time); % 设置X轴刻度与符号对齐  
  
% 在控制台打印分解结果以便核对  
disp('原始序列:');  
disp(bits);  
disp('I 路序列:');  
disp(I_bits);  
disp('Q 路序列:');  
disp(Q_bits);  
