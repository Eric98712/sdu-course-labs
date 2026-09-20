% 函数 Cascade 将传递函数分解为二阶节（SOS）的级联形式
% 输入：
%   Numerator_in: 分子多项式的系数向量，按降幂排列（例如 [b0, b1, ..., bn]）
%   Denominator_in: 分母多项式的系数向量，按降幂排列（例如 [a0, a1, ..., am]）
% 输出：
%   Numerator: 二阶节分子系数矩阵，每行对应一个二阶节的系数 [b0, b1, b2]
%   Denominator: 二阶节分母系数矩阵，每行对应一个二阶节的系数 [a0, a1, a2]
% 注意：
%   当分子或分母多项式次数为奇数时，函数会补充一个零根以形成偶数阶，这可能改变原传递函数。
%   建议确保输入多项式次数为偶数以避免非预期的结果。
function [Numerator,Denominator] = DSP_5_1_Cascade(Numerator_in,Denominator_in)
    
    % 获取分子和分母系数的长度（长度 = 多项式次数 + 1）
    l_n = length(Numerator_in);
    l_d = length(Denominator_in);

    % 计算分子和分母的根（根的数量等于多项式次数）
    r_n = roots(Numerator_in);   % 计算分子多项式的根
    r_d = roots(Denominator_in); % 计算分母多项式的根

    % 将根按复数共轭对排序，实根按实部升序排列
    r_n = cplxpair(r_n); % 对分子根进行配对排序
    r_d = cplxpair(r_d); % 对分母根进行配对排序

    % 若根的数量为奇数，补充一个零根以形成偶数阶（可能导致传递函数改变）
    % 注意：此操作会添加一个额外的零根，可能影响系统特性
    if mod(length(r_n), 2) ~= 0
        r_n = [r_n; 0]; % 在分子根中补零，使根数量为偶数
    end

    if mod(length(r_d), 2) ~= 0
        r_d = [r_d; 0]; % 在分母根中补零，使根数量为偶数
    end

    % 初始化分子和分母的二阶节系数矩阵
    Numerator = [];
    Denominator = [];

    % 生成分子各二阶节的系数（每对根对应一个二阶节）
    for i = 1:(l_n)/2
        pair_n = r_n(2*i-1:2*i); % 提取当前根对（复数共轭对或实根对）
        num_coeff = poly(pair_n); % 将根转换为多项式系数（降幂排列）
        Numerator = [Numerator; num_coeff]; % 添加到系数矩阵
    end
   
    % 生成分母各二阶节的系数（每对根对应一个二阶节）
    for i = 1:(l_d)/2
        pair_d = r_d(2*i-1:2*i); % 提取当前根对（复数共轭对或实根对）
        den_coeff = poly(pair_d); % 将根转换为多项式系数（降幂排列）
        Denominator = [Denominator; den_coeff]; % 添加到系数矩阵
    end

    % 调整总增益：将原分子和分母的首项系数比乘到第一个分子二阶节
    K_n = Numerator_in(1); % 提取分子原首项系数（最高阶系数）
    K_d = Denominator_in(1); % 提取分母原首项系数（最高阶系数）
    Numerator(1, :) = Numerator(1, :) * K_n/K_d; % 归一化增益并应用至第一个分子节
    
end