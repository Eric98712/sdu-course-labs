% BPSK调制信号与基带矩形信号的频谱对比（Matlab代码）
clear; clc; close all;

%% 1. 定义信号参数
A = 1;          % 基带信号幅度
tau = 0.2;      % 基带矩形脉冲宽度 (s)
fc = 5;         % 载波频率 (Hz)，远大于基带带宽（基带带宽~1/tau=5Hz）
Fs = 100;       % 采样频率 (Hz)，满足奈奎斯特采样定理
t = linspace(-tau, tau, 1000); % 基带信号时间轴
f = linspace(-15, 15, 1000); % 频谱频率轴（足够展示双边带）

%% 2. 基带矩形信号及时域调制
s_base = A * (abs(t) < tau/2); % 基带矩形脉冲信号
s_bpsk = s_base .* cos(2*pi*fc*t); % BPSK调制信号（时域乘积）

%% 3. 频谱计算（傅里叶变换，加窗减少频谱泄漏）
win = hanning(length(t)); % 汉宁窗（减少泄漏）
S_base = fftshift(fft(s_base .* win)); % 基带信号频谱（fftshift：将直流分量移到中心）
S_bpsk = fftshift(fft(s_bpsk .* win)); % BPSK信号频谱
f_axis = Fs/length(t) * (-length(t)/2:length(t)/2 - 1); % 真实频率轴

%% 4. 归一化频谱（方便对比）
S_base_norm = abs(S_base) / max(abs(S_base));
S_bpsk_norm = abs(S_bpsk) / max(abs(S_bpsk));

%% 5. 绘制基带+BPSK频谱对比图
subplot(2,1,1);
plot(f_axis, S_base_norm, 'LineWidth', 1.5, 'Color', [0.2 0.6 0.8]);
hold on;
% 标注基带频谱关键点：峰值、零点频率、主瓣带宽
zero_freq_base = 1/tau; % 基带频谱零点频率
plot([-zero_freq_base, -zero_freq_base], [0, 1], 'r--', 'LineWidth', 1);
plot([zero_freq_base, zero_freq_base], [0, 1], 'r--', 'LineWidth', 1);
text(0, 1.05, '基带频谱峰值 = 1（归一化）', 'HorizontalAlignment', 'center', 'FontSize', 10);
text(zero_freq_base+0.2, 0.5, sprintf('零点频率 f = \\pm%.1fHz', zero_freq_base), 'FontSize', 10, 'Color', 'red');
text(0, 0.5, sprintf('主瓣带宽 = %.1fHz', 2*zero_freq_base), 'FontSize', 10);
xlabel('频率 f (Hz)', 'FontSize', 11);
ylabel('归一化频谱幅度 |S(f)|', 'FontSize', 11);
title('基带矩形信号的频谱', 'FontSize', 12, 'FontWeight', 'bold');
grid on;
xlim([-15, 15]);
ylim([0, 1.2]);

subplot(2,1,2);
plot(f_axis, S_bpsk_norm, 'LineWidth', 1.5, 'Color', [0.8 0.3 0.3]);
hold on;
% 标注BPSK频谱关键点：载波频率、边带峰值、零点频率、带宽
plot([fc, fc], [0, 1], 'b--', 'LineWidth', 1);
plot([-fc, -fc], [0, 1], 'b--', 'LineWidth', 1);
zero_freq_bpsk1 = fc - zero_freq_base;
zero_freq_bpsk2 = fc + zero_freq_base;
plot([zero_freq_bpsk1, zero_freq_bpsk1], [0, 0.5], 'g--', 'LineWidth', 1);
plot([zero_freq_bpsk2, zero_freq_bpsk2], [0, 0.5], 'g--', 'LineWidth', 1);
text(fc+0.2, 0.8, sprintf('载波频率 f_c = %.1fHz', fc), 'FontSize', 10, 'Color', 'blue');
text(fc, 1.05, '边带峰值 = 0.5（归一化）', 'HorizontalAlignment', 'center', 'FontSize', 10);
text(zero_freq_bpsk2+0.2, 0.3, sprintf('边带零点 f = %.1fHz', zero_freq_bpsk2), 'FontSize', 10, 'Color', 'green');
text(0, 0.3, sprintf('BPSK带宽 = %.1fHz（与基带一致）', 2*zero_freq_base), 'FontSize', 10);
xlabel('频率 f (Hz)', 'FontSize', 11);
ylabel('归一化频谱幅度 |S_{BPSK}(f)|', 'FontSize', 11);
title('BPSK调制信号的频谱', 'FontSize', 12, 'FontWeight', 'bold');
grid on;
xlim([-15, 15]);
ylim([0, 1.2]);

% 调整子图间距
sgtitle('问题3：BPSK调制信号与基带矩形信号的频谱对比', 'FontSize', 14, 'FontWeight', 'bold');
set(gcf, 'Position', [100, 100, 800, 600]);