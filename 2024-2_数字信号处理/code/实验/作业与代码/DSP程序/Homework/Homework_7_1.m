n = 0:39;          % 时间索引 n = 0,1,...,39
N = length(n);     % 信号长度 N=40
center = 39/2;     % 中心点 n=19.5（非整数，使用eps避免分母为零）

% 生成 h[n]，使用哈明窗（原代码中的系数为哈明窗）
h_n = (sin(0.3*pi*(n - center)) ./ (pi*(n - center))) .* (0.54 - 0.46*cos(2*pi*n/(N-1))); 

% 计算频响并进行频域移位
H_w = fft(h_n, 1024);        % 1024点FFT
H_w_shifted = fftshift(H_w); % 将频响数据移至中心
freq = linspace(-0.5, 0.5, 1024);  % 归一化频率轴 [-0.5, 0.5]

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