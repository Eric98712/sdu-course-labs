% 定义滤波器参数
N = 6;          % 滤波器阶数（Butterworth滤波器阶数，决定滚降陡峭度）
Wc = 0.7662;    % 模拟滤波器的截止频率（经过预畸变处理的截止频率）
Fs = 1;         % 采样频率（归一化频率，Nyquist频率为0.5Hz）

% 生成索引数组
n = 1 : 1 : N;  % 生成1到N的索引，用于计算各极点位置

% 计算模拟滤波器极点（Butterworth滤波器极点分布）
% 极点在s平面左半圆上，角度均匀分布在90°~270°之间，半径为Wc
% 角度计算公式：π/2（基础偏移） + π*(2n-1)/(2N)（等间隔分布）
r_n = Wc * exp(pi*1i*0.5 + pi*1i*(2*n-1)/(2*N));  

% 构造模拟传递函数
H_s = poly(r_n);  % 通过极点生成分母多项式系数（Butterworth滤波器无零点）
H_z = Wc^N;       % 分子多项式系数（保证直流增益为1，Wc^N用于归一化）

% 双线性变换转换为数字滤波器
% 使用bilinear函数进行s域到z域的映射，Fs=1需与预畸变参数匹配
[H_dz, H_ds] = bilinear(H_z, H_s, Fs);  

figure; % 创建新图形窗口

% 绘制幅频响应
subplot(1, 2, 1);
[H, w] = freqz(H_dz, H_ds);       % 计算数字滤波器频率响应（w为角频率数组）
mag_dB = 20 * log10(abs(H));      % 幅度转换为分贝值
plot(w/pi, mag_dB);               % 横轴归一化为π rad/sample单位
xlabel('频率 (×π rad/sample)');    % 横轴标签（1对应Nyquist频率）
ylabel('幅度 (dB)');              % 纵轴标签
title('幅频响应');                 % 子图标题
grid on;                          % 显示网格

% 绘制相频响应
subplot(1, 2, 2);
H_da = angle(H);                  % 提取相位响应（单位：弧度）
H_da = unwrap(H_da);              % 解除相位跳变（连续相位）
plot(w/pi, H_da/pi);              % 相位以π为单位的归一化显示
xlabel('频率 (×π rad/sample)');    % 横轴标签
ylabel('相位 (×π rad)');           % 纵轴标签
title('相频响应');                 % 子图标题
grid on;                          % 显示网格

% 保存图像
saveas(gcf, "DSP_1.jpg");         % 将当前图形保存为JPG文件