% 生成二进制数据
numBits = 10000;
data = randi([0 1], numBits, 1);

% 调制为双极性NRZ（BPSK）
modulated = 2 * data - 1;

% 上采样参数
samplesPerSymbol = 8;
upsampled = upsample(modulated, samplesPerSymbol);

% 设计升余弦滤波器
rolloff = 0.5;        % 滚降系数
span = 6;             % 滤波器跨度（符号数）
filterCoeffs = rcosdesign(rolloff, span, samplesPerSymbol, 'sqrt');

% 应用滤波器
filtered = conv(upsampled, filterCoeffs, 'same');

% 加高斯白噪声
SNR_dB = 40;
noisy = awgn(filtered, SNR_dB, 'measured');

% 绘制眼图
eyediagram(noisy, samplesPerSymbol);
title('升余弦滤波加噪声的眼图');