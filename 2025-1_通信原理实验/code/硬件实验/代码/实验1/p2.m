Fs = 204800; N = 2048; t = (0:N-1)/Fs;
f_list = [1100, 1300, 2000]; % 方波频率
figure;

for i = 1:3
    f0 = f_list(i);
    x = square(2*pi*f0*t, 50); % 50%占空比方波
    X = fft(x)/N;
    f = (0:N-1)*Fs/N;
    
    % 绘制单边频谱（0~8kHz）
    subplot(3,1,i);
    plot(f(1:N/2), 2*abs(X(1:N/2)));
    xlabel('频率 (Hz)'); ylabel('归一化幅度');
    title([num2str(f0),'Hz方波频谱图（含所有明显谐波）']);
    grid on; xlim([0 8000]); ylim([0 1]); % 限定幅度范围，突出弱谐波
end