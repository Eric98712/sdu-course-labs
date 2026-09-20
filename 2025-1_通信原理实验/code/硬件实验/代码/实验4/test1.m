% 周期矩形信号的时域与频域分析（Matlab代码）
clear; clc; close all;

%% 1. 定义信号参数
A = 1;          % 信号幅度
tau = 0.2;      % 脉冲宽度 (s)
T0 = 1;         % 信号周期 (s)，占空比 duty = tau/T0 = 0.2
f0 = 1/T0;      % 基波频率 (Hz)
Omega0 = 2*pi*f0; % 基波角频率 (rad/s)
n_range = -10:10; % 傅里叶级数谐波次数（足够展示主瓣+旁瓣）

%% 2. 时域信号生成（绘制1个周期的详细波形+3个周期的整体趋势）
t_detail = linspace(-T0/2, T0/2, 1000); % 单个周期的精细时间轴
x_detail = A * (abs(t_detail) < tau/2); % 单个周期的矩形脉冲

t_whole = linspace(-1.5*T0, 1.5*T0, 3000); % 3个周期的时间轴
x_whole = A * (mod(t_whole + T0/2, T0) < tau/2); % 周期性重复的矩形信号

%% 3. 频域频谱计算（傅里叶级数系数）
duty = tau/T0;
Fn = A * duty * sinc(n_range * duty); % 频谱幅度（sinc(x)=Sa(pi*x)，Matlab中sinc定义为sin(pi*x)/(pi*x)）

%% 4. 绘制时域+频域图
subplot(2,1,1);
plot(t_whole, x_whole, 'LineWidth', 1.5, 'Color', [0.2 0.6 0.8]);
hold on;
% 标注关键点：幅度A、脉冲宽度tau、周期T0

plot([-T0/2, -T0/2], [0, A], 'g--', 'LineWidth', 1);
plot([T0/2, T0/2], [0, A], 'g--', 'LineWidth', 1);
text(0, A+0.05, sprintf('幅度 A = %.1f', A), 'HorizontalAlignment', 'center', 'FontSize', 10);
text(T0/2 + 0.02, A/2, sprintf('周期 T0 = %.1fs', T0), 'FontSize', 10, 'Color', 'green');
xlabel('时间 t (s)', 'FontSize', 11);
ylabel('信号幅度 x_T(t)', 'FontSize', 11);
title('周期矩形信号的时域波形', 'FontSize', 12, 'FontWeight', 'bold');
grid on;
ylim([-0.1, A+0.2]);

subplot(2,1,2);
stem(n_range*f0, abs(Fn), 'MarkerSize', 6, 'LineWidth', 1.2, 'Color', [0.8 0.3 0.3]);
hold on;
% 标注关键点：直流分量F0、基波频率f0、包络零点频率、主瓣宽度
F0 = A*duty;
zero_freq = 1/tau; % 包络零点频率（f=k/tau，k=1,2,...）
plot([-zero_freq, zero_freq], [0, 0], 'b--', 'LineWidth', 1);
text(0, F0+0.01, sprintf('直流分量 F0 = %.2f', F0), 'HorizontalAlignment', 'center', 'FontSize', 10);
text(f0, max(abs(Fn))*0.8, sprintf('基波频率 f0 = %.1fHz', f0), 'FontSize', 10, 'Color', 'darkblue');
text(zero_freq+0.1, 0.02, sprintf('包络零点 f = %.1fHz', zero_freq), 'FontSize', 10, 'Color', 'blue');
text(zero_freq/2, max(abs(Fn))*0.5, sprintf('主瓣宽度 = %.1fHz', 2*zero_freq), 'FontSize', 10);
xlabel('频率 f (Hz)', 'FontSize', 11);
ylabel('频谱幅度 |F_n|', 'FontSize', 11);
title('周期矩形信号的频域离散谱（傅里叶级数）', 'FontSize', 12, 'FontWeight', 'bold');
grid on;
xlim([-12, 12]); % 限制频率范围，方便观察
ylim([0, max(abs(Fn))+0.05]);

% 调整子图间距
sgtitle('问题2：周期矩形信号的时域与频域分析', 'FontSize', 14, 'FontWeight', 'bold');
set(gcf, 'Position', [100, 100, 800, 600]);