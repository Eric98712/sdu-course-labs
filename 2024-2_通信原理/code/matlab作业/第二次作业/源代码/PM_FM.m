fm = 1;        % 基带信号频率
fc = 20;       % 载波频率 这里选择的载波频率较低，这是为了比较好显示调制后的图像
fs = 1000;     % 采样频率
t = 0:1/fs:1 - 1/fs; % 时间长度
Kp = 1;%调相灵敏度
Kf = 10;%调频灵敏度

% 生成基带信号
m_tri = sawtooth(2*pi*fm*t, 0.5); % 三角波（对称）
m_sq = square(2*pi*fm*t);          % 双极性方波

%积分器
in_m_tri =  cumsum(sawtooth(2*pi*fm*t, 0.5)) / fs; % 三角波（对称）
in_m_sq  =  cumsum(square(2*pi*fm*t)) / fs;          % 双极性方波

% FM调制
s_tri_FM = cos(2*pi*fc*t+2*pi*Kf*in_m_tri); % 三角波调制
s_sq_FM  = cos(2*pi*fc*t+2*pi*Kf*in_m_sq);   % 方波调制

%PM调制
s_tri_PM = cos(2*pi*fc*t+Kp*m_tri); % 三角波调制
s_sq_PM  = cos(2*pi*fc*t+Kp*m_sq);   % 方波调制

% 绘图设置
figure('Color', 'white', 'Position', [100, 100, 800, 600]);

% 绘制三角波基带及已调信号
subplot(3,2,1);
plot(t, m_tri);
xlim([0, 1]); % 显示一个基带周期
title('基带信号（三角波）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

% 绘制方波基带信号
subplot(3,2,2);
plot(t, m_sq);
xlim([0, 1]);
ylim([-1.5 1.5]);
title('基带信号（方波）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

%绘制三角波的FM调制信号
subplot(3,2,3);
plot(t, s_tri_FM);
xlim([0, 1]);
title('FM已调信号（三角波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

%绘制方波的FM调制信号
subplot(3,2,4);
plot(t, s_sq_FM);
xlim([0, 1]);
title('FM已调信号（方波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

%绘制三角波的PM调制信号
subplot(3,2,5);
plot(t, s_tri_PM);
xlim([0, 1]);
title('PM已调信号（三角波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

%绘制方波的PM调制信号
subplot(3,2,6);
plot(t, s_sq_PM);
xlim([0, 1]);
title('PM已调信号（方波调制）');
xlabel('时间（秒）');
ylabel('幅度');
grid on;

saveas(gcf,"PM_FM.jpg");