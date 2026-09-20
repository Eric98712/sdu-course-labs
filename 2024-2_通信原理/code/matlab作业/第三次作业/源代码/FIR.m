% 参数设置
T = 1;          % 符号周期（秒）
Fs = 100;       % 采样率
t = 0:1/Fs:T;   % 时间轴（0到T，含101个点）

% 定义信号s1和s2（正交）
s1 = zeros(size(t));
s1(1:50) = 1;   % 0~0.49秒为1
s2 = zeros(size(t));
s2(52:end) = 1; % 0.51~1秒为1

% 匹配滤波器冲激响应（时间反褶）
h1 = fliplr(s1);
h2 = fliplr(s2);

% 输入信号为s1时的输出
input_s1 = s1;
output_mf1_s1 = conv(input_s1, h1) * (1/Fs); % 卷积并乘以采样间隔以近似积分
output_mf2_s1 = conv(input_s1, h2) * (1/Fs);

% 输入信号为s2时的输出
input_s2 = s2;
output_mf1_s2 = conv(input_s2, h1) * (1/Fs);
output_mf2_s2 = conv(input_s2, h2) * (1/Fs);

% 输出信号时间轴
t_output = 0:1/Fs:(length(output_mf1_s1)-1)/Fs;
sampling_index = 101; % t=T=1秒对应的索引

% 绘制匹配滤波器输出波形
figure;

% 输入s1时的输出
subplot(2,2,1);
plot(t_output, output_mf1_s1, 'b');
hold on;
plot(t_output(sampling_index), output_mf1_s1(sampling_index), 'ro', 'MarkerSize', 8);
title('MF1输出（输入s1）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;

subplot(2,2,2);
plot(t_output, output_mf2_s1, 'b');
hold on;
plot(t_output(sampling_index), output_mf2_s1(sampling_index), 'ro', 'MarkerSize', 8);
title('MF2输出（输入s1）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;

% 输入s2时的输出
subplot(2,2,3);
plot(t_output, output_mf1_s2, 'b');
hold on;
plot(t_output(sampling_index), output_mf1_s2(sampling_index), 'ro', 'MarkerSize', 8);
title('MF1输出（输入s2）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;

subplot(2,2,4);
plot(t_output, output_mf2_s2, 'b');
hold on;
plot(t_output(sampling_index), output_mf2_s2(sampling_index), 'ro', 'MarkerSize', 8);
title('MF2输出（输入s2）');
xlabel('时间 (秒)');
ylabel('幅度');
grid on;
saveas(gcf,"signal_1.jpg")