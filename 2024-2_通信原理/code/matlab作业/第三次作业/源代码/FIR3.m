% 参数设置
T = 1;          % 符号周期（秒）
Fs = 100;       % 采样率
t = 0:1/Fs:T;   % 时间轴（0到T，共101个点）

% 定义信号s1和s2（正交）
s1 = zeros(size(t));
s1(1:end) = 1;   % 0~0.49秒为1
s2 = zeros(size(t));
s2(1:50) = 1; % 0.51~1秒为1
s2(51:end) = -1; % 0.51~1秒为1                                                                

% 计算相关器输出（累积积分）
% 输入为s1时，相关器1和2的输出
output_corr1_s1 = cumsum(s1 .* s1) * (1/Fs); % 相关器1（与s1相关）
output_corr2_s1 = cumsum(s1 .* s2) * (1/Fs); % 相关器2（与s2相关）

% 输入为s2时，相关器1和2的输出
output_corr1_s2 = cumsum(s2 .* s1) * (1/Fs);
output_corr2_s2 = cumsum(s2 .* s2) * (1/Fs);

% 抽样时刻索引（t=T=1秒）
sampling_index = 101;

% 绘制相关器输出波形
figure;

% 输入s1时的输出
subplot(2,2,1);
plot(t, output_corr1_s1, 'b');
hold on;
plot(t(sampling_index), output_corr1_s1(sampling_index), 'ro', 'MarkerSize', 8);
title('相关器1输出（输入s1）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;

subplot(2,2,2);
plot(t, output_corr2_s1, 'b');
hold on;
plot(t(sampling_index), output_corr2_s1(sampling_index), 'ro', 'MarkerSize', 8);
title('相关器2输出（输入s1）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;

% 输入s2时的输出
subplot(2,2,3);
plot(t, output_corr1_s2, 'b');
hold on;
plot(t(sampling_index), output_corr1_s2(sampling_index), 'ro', 'MarkerSize', 8);
title('相关器1输出（输入s2）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;

subplot(2,2,4);
plot(t, output_corr2_s2, 'b');
hold on;
plot(t(sampling_index), output_corr2_s2(sampling_index), 'ro', 'MarkerSize', 8);
title('相关器2输出（输入s2）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;

saveas(gcf,"signal_3.jpg")