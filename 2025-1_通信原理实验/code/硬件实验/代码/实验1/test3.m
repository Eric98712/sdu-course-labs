% BPSK调制频谱分析
clear all; close all; clc;

% 参数设置
fs = 1000;          % 采样频率
fc = 100;           % 载波频率
Tb = 0.1;           % 比特周期
N = 1000;           % 采样点数
t = linspace(0, 1, N);

% 生成基带矩形信号
Rb = 1/Tb;          % 比特率
bits = [1, 0, 1, 1, 0];  % 示例数据
baseband_signal = zeros(1, N);
for i = 1:length(bits)
    start_idx = round((i-1)*Tb*fs) + 1;
    end_idx = round(i*Tb*fs);
    baseband_signal(start_idx:end_idx) = 2*bits(i) - 1; % ±1
end

% BPSK调制
bpsk_signal = baseband_signal .* cos(2*pi*fc*t);

% 计算频谱
f = linspace(-fs/2, fs/2, N);
baseband_spectrum = fftshift(abs(fft(baseband_signal, N)));
bpsk_spectrum = fftshift(abs(fft(bpsk_signal, N)));

% 理论sinc函数
f_theory = linspace(-200, 200, 1000);
sinc_baseband = abs(Tb * sinc(Tb * f_theory));
sinc_bpsk = 0.5 * abs(Tb * sinc(Tb * (f_theory - fc)) + Tb * sinc(Tb * (f_theory + fc)));

% 绘图
figure('Position', [100, 100, 1200, 800]);

% -------------------------- 子图1：基带信号频谱 --------------------------
subplot(2,2,1);
plot(f, baseband_spectrum/max(baseband_spectrum), 'b-', 'LineWidth', 1.5);
hold on;
% 理论sinc包络（可选开启）
% plot(f_theory, sinc_baseband/max(sinc_baseband), 'r--', 'LineWidth', 1);

% 标记关键点及坐标
% 1. 主瓣峰值 (0, 1)
plot(0, 1, 'ro', 'MarkerSize', 8, 'MarkerFaceColor', 'red');
text(0, 1.05, sprintf('主瓣峰值: (0, %.1f)', 1), ...
     'HorizontalAlignment', 'center', 'FontSize', 9);

% 2. 第一过零点 (±1/Tb, 0)
f_zero = 1/Tb;  % 第一过零点频率
plot([-f_zero, f_zero], [0, 0], 'g^', 'MarkerSize', 8, 'MarkerFaceColor', 'green');
text(-f_zero, -0.08, sprintf('第一过零点: (-%.1f, 0)', f_zero), ...
     'HorizontalAlignment', 'center', 'FontSize', 9);
text(f_zero, -0.08, sprintf('第一过零点: (%.1f, 0)', f_zero), ...
     'HorizontalAlignment', 'center', 'FontSize', 9);

xlabel('频率 (Hz)');
ylabel('归一化幅度');
title('基带矩形信号频谱');
legend('实际频谱', '理论sinc包络', 'Location', 'northeast');
grid on;
xlim([-150, 150]);
ylim([-0.1, 1.2]);  % 调整y轴范围，避免标注被截断

% -------------------------- 子图2：BPSK调制信号频谱 --------------------------
subplot(2,2,2);
plot(f, bpsk_spectrum/max(bpsk_spectrum), 'b-', 'LineWidth', 1.5);
hold on;
% 理论频谱（可选开启）
% plot(f_theory, sinc_bpsk/max(sinc_bpsk), 'r--', 'LineWidth', 1);

% 标记关键点及坐标
% 1. 载波频率位置 (±fc, 0.5)（BPSK频谱主瓣峰值在±fc处，幅度约为0.5）
plot([fc, -fc], [0.5, 0.5], 'ro', 'MarkerSize', 8, 'MarkerFaceColor', 'red');
text(fc, 0.55, sprintf('fc: (%.1f, %.1f)', fc, 0.5), ...
     'HorizontalAlignment', 'center', 'FontSize', 9);
text(-fc, 0.55, sprintf('-fc: (-%.1f, %.1f)', fc, 0.5), ...
     'HorizontalAlignment', 'center', 'FontSize', 9);

% 2. 第一过零点 (fc±1/Tb, 0) 和 (-fc±1/Tb, 0)
f_zero_bpsk1 = fc - f_zero;  % 正频侧左过零点
f_zero_bpsk2 = fc + f_zero;  % 正频侧右过零点
f_zero_bpsk3 = -fc - f_zero; % 负频侧左过零点
f_zero_bpsk4 = -fc + f_zero; % 负频侧右过零点

plot([f_zero_bpsk1, f_zero_bpsk2, f_zero_bpsk3, f_zero_bpsk4], ...
     [0, 0, 0, 0], 'g^', 'MarkerSize', 8, 'MarkerFaceColor', 'green');

text(f_zero_bpsk1, -0.05, sprintf('(%.1f, 0)', f_zero_bpsk1), ...
     'HorizontalAlignment', 'center', 'FontSize', 8);
text(f_zero_bpsk2, -0.05, sprintf('(%.1f, 0)', f_zero_bpsk2), ...
     'HorizontalAlignment', 'center', 'FontSize', 8);
text(f_zero_bpsk3, -0.05, sprintf('(%.1f, 0)', f_zero_bpsk3), ...
     'HorizontalAlignment', 'center', 'FontSize', 8);
text(f_zero_bpsk4, -0.05, sprintf('(%.1f, 0)', f_zero_bpsk4), ...
     'HorizontalAlignment', 'center', 'FontSize', 8);

xlabel('频率 (Hz)');
ylabel('归一化幅度');
title('BPSK调制信号频谱');
legend('实际频谱', '理论频谱', 'Location', 'northeast');
grid on;
xlim([-200, 200]);
ylim([-0.1, 0.7]);  % 调整y轴范围，避免标注被截断

% -------------------------- 子图3：时域基带信号 --------------------------
subplot(2,2,3);
plot(t, baseband_signal, 'b-', 'LineWidth', 2);
xlabel('时间 (s)');
ylabel('幅度');
title('基带矩形信号');
grid on;
ylim([-1.5, 1.5]);

% -------------------------- 子图4：BPSK调制时域信号 --------------------------
subplot(2,2,4);
plot(t, bpsk_signal, 'r-', 'LineWidth', 1);
xlabel('时间 (s)');
ylabel('幅度');
title('BPSK调制信号');
grid on;

sgtitle('BPSK调制频谱分析（矩形脉冲）- 含关键点坐标标注', 'FontSize', 14, 'FontWeight', 'bold');

% 显示关键参数
fprintf('关键参数:\n');
fprintf('载波频率 fc = %d Hz\n', fc);
fprintf('比特周期 Tb = %.2f s\n', Tb);
fprintf('比特率 Rb = 1/Tb = %.1f bps\n', 1/Tb);
fprintf('基带信号第一过零点频率 = ±%.1f Hz\n', 1/Tb);
fprintf('BPSK信号正频侧第一过零点频率 = %.1f Hz 和 %.1f Hz\n', fc-1/Tb, fc+1/Tb);
fprintf('BPSK信号负频侧第一过零点频率 = %.1f Hz 和 %.1f Hz\n', -fc-1/Tb, -fc+1/Tb);