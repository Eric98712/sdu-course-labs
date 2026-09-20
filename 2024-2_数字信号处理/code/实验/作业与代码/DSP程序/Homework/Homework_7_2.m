n = 0:59;          % 时间索引 n = 0,1,...,39
N = length(n);     % 信号长度 N=40
center = 59/2;     % 中心点 n=19.5（非整数，导致分母问题）

% 生成 h[n]
h_n = (sin(pi*(n - center)) ./ (pi*(n - center))-sin(0.6*pi*(n - center)) ./ (pi*(n - center + eps))) .*blackman(N)'; 

% 计算频响
H_w = fft(h_n, 1024);  % 使用 1024 点 FFT 提高频率分辨率
H_w_shifted = fftshift(H_w); % 将频响数据移至中心
freq = linspace(-1, 1, 1024);  

% 绘制幅频响应（对数坐标）
figure;
plot(freq, 20*log10(abs(H_w_shifted)));
xlabel('归一化频率 (×π rad/sample)');
ylabel('幅度 (dB)');
title('滤波器幅频响应');
grid on;

% 绘制相频响应（修正频率对齐和单位）
figure;
plot(freq, unwrap(angle(H_w_shifted)));
xlabel('归一化频率 (×π rad/sample)');
ylabel('相位 (rad)');
title('滤波器相频响应');
grid on;