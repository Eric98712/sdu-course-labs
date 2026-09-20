fm = 20;        % 基带信号频率
fc = 40;       % 载波频率 这里选择的载波频率较低，这是为了比较好显示调制后的图像
fs = 10000;     % 采样频率
t = 0:1/fs:1 - 1/fs; % 时间长度

% 生成基带信号
m_tri = sawtooth(2*pi*fm*t, 0.5); % 三角波（对称）
m_sq = square(2*pi*fm*t);          % 双极性方波

% 生成载波信号
carry = cos(2*pi*fc*t);

% DSB调制
s_tri = m_tri .* carry; % 三角波调制
s_sq = m_sq .* carry;   % 方波调制

% 绘图设置
figure('Color', 'white', 'Position', [100, 100, 800, 600]);

% 绘制三角波基带及已调信号
subplot(2,2,1);
plot(t, m_tri);
xlim([0, 0.5]); % 显示一个基带周期
title('基带信号（三角波）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

subplot(2,2,2);
plot(t, s_tri);
xlim([0, 1]);
title('DSB已调信号（三角波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

% 绘制方波基带及已调信号
subplot(2,2,3);
plot(t, m_sq);
xlim([0, 0.5]);
ylim([-1.5 1.5]);
title('基带信号（方波）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

subplot(2,2,4);
plot(t, s_sq);
xlim([0, 0.5]);
title('DSB已调信号（方波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

saveas(gcf,"DSB.jpg");