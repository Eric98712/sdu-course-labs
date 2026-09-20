fm = 1;        % 基带信号频率
fc = 20;       % 载波频率 这里选择的载波频率较低，这是为了比较好显示调制后的图像
fs = 1000;     % 采样频率
t = 0:1/fs:2 - 1/fs; % 时间长度
% 生成基带信号
m_tri = sawtooth(2*pi*fm*t, 0.5); % 正弦波
m_sq = square(2*pi*fm*t);          % 双极性方波

% 生成载波信号
carry = cos(2*pi*fc*t);

%生成直流分量A
A = 1;%调制指数为1

% AM调制
s_tri = (m_tri + A) .* carry; % 正弦波调制
s_sq = (m_sq + A).* carry + A;   % 方波调制

% 绘制正弦波基带及已调信号
subplot(2,2,1);
plot(t, m_tri);
xlim([0, 1]); % 显示一个基带周期
title('基带信号（三角波）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

subplot(2,2,2);
plot(t, s_tri);
xlim([0, 1]);
title('AM已调信号（三角波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

% 绘制方波基带及已调信号
subplot(2,2,3);
plot(t, m_sq);
xlim([0, 1]);
ylim([-1.5 1.5]);
title('基带信号（方波）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

subplot(2,2,4);
plot(t, s_sq);
xlim([0, 1]);
title('AM已调信号（方波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

saveas(gcf,"AM.jpg");