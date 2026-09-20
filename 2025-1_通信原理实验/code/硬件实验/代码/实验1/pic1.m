% 1. 输入原始数据
frequency = [200, 500, 800, 1000, 2000, 3000, 3400, 3600];
amplitude = [2.24, 2.92, 3.00, 3.02, 3.08, 2.92, 2.52, 1.00];

% 2. 生成插值数据（让曲线更平滑）
freq_interp = linspace(min(frequency), max(frequency), 200);  % 200个插值点（密集分布）
amp_linear = interp1(frequency, amplitude, freq_interp, 'linear');  % 线性插值
amp_spline = interp1(frequency, amplitude, freq_interp, 'spline');  % 三次样条插值（更平滑）

% 3. 创建图形窗口
figure('Name', '频率响应图（含插值拟合）', 'Position', [100, 100, 850, 600]);

hold on;  % 保持当前图形，继续添加曲线
plot(freq_interp, amp_linear, 'g--', ...     % 线性插值曲线（绿色虚线）
     'LineWidth', 1.2, ...                   % 线宽
     'DisplayName', '线性插值拟合');         % 图例标签

plot(freq_interp, amp_spline, 'r-', ...      % 三次样条插值曲线（红色实线）
     'LineWidth', 1.5, ...                   % 线宽
     'DisplayName', '三次样条插值拟合');     % 图例标签

% 5. 丰富图例（自定义位置、字体、大小）
legend('Location', 'best', ...               % 自动选择最佳位置（避免遮挡数据）
       'FontSize', 11, ...                   % 图例字体大小
       'FontWeight', 'bold', ...             % 字体加粗
       'BackgroundColor', 'white', ...       % 图例背景色
       'EdgeColor', 'gray');                 % 图例边框颜色

% 6. 其他图形优化（保持与之前一致，确保可读性）
xlabel('频率 (Hz)', 'FontSize', 12, 'FontWeight', 'bold');
ylabel('输出幅度 (V)', 'FontSize', 12, 'FontWeight', 'bold');
title('频率响应特性曲线（含插值拟合）', 'FontSize', 14, 'FontWeight', 'bold');
grid on;
grid minor;
xlim([100, 3800]);
ylim([0.8, 3.2]);
xticks(linspace(200, 3600, 10));
yticks(linspace(1, 3, 5));
box on;

% 可选：保存高分辨率图片
% print('频率响应图_含插值', '-dpng', '-r300');