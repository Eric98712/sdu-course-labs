module elevator_controller (
    input        clk,         // 时钟信号
    input        rst_n,       // 异步复位信号（低有效）
    input  [3:0] req_floors,  // 4位格雷码输入（楼层请求）
    output reg [3:0] current_floor, // 当前楼层（二进制编码）
    output reg [9:0] current_req,   // 当前所有楼层请求（one-hot编码）
    output reg      moving_up,      // 上行指示灯
    output reg      moving_down     // 下行指示灯
);


function [9:0] gray_to_onehot;
    input [3:0] gray;
    reg [3:0] binary;  // 中间二进制值
    begin
        // Gray码转二进制（逐位异或）
        binary[3] = gray[3];
        binary[2] = gray[2] ^ binary[3];
        binary[1] = gray[1] ^ binary[2];
        binary[0] = gray[0] ^ binary[1];
        
        // 二进制转one-hot（仅处理0-9楼层）
        if (binary <= 4'd9)
            gray_to_onehot = 10'b1 << binary;  // 左移生成one-hot
        else
            gray_to_onehot = 10'b0;           // 无效值处理
    end
endfunction


reg [9:0] next_req;    // 下一时刻请求寄存器
reg [3:0] next_floor;  // 下一时刻楼层寄存器

// 时序逻辑：寄存器更新
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin              // 复位初始化
        current_req   <= 10'b0;     // 清空所有请求
        current_floor <= 4'd1;     // 初始楼层设为1层
    end else begin
        current_req   <= next_req;   // 更新请求寄存器
        current_floor <= next_floor; // 更新楼层寄存器
    end
end

always @(*) begin
    integer i;                      // 循环计数器
    integer min_dist;               // 最小距离
    integer nearest_floor;          // 最近目标楼层
    integer dist;                   // 临时距离存储
    reg [9:0] req_combined;         // 合并后的请求信号

    // 请求合并：当前请求 + 新Gray码转换请求
    req_combined = current_req | gray_to_onehot(req_floors);
    next_req = req_combined;        // 默认保持请求
    
    // 当前楼层有请求时处理
    if (req_combined[current_floor]) begin
        next_req[current_floor] = 1'b0;  // 清除当前楼层请求
        next_floor = current_floor;      // 保持当前楼层
        moving_up   = 1'b0;              // 停止移动
        moving_down = 1'b0;
    end 
    // 无当前楼层请求时寻找下一个目标
    else begin
        min_dist = 10;                   // 初始最小距离（最大为9）
        nearest_floor = current_floor;    // 默认保持不动
        
        // 遍历所有楼层寻找最近请求
        for (i = 0; i < 10; i = i+1) begin
            if (req_combined[i]) begin    // 检测到楼层i有请求
                // 计算绝对距离
                dist = (i > current_floor) ? 
                      (i - current_floor) : 
                      (current_floor - i);
                
                // 更新最近楼层逻辑
                if (dist < min_dist) begin       // 发现更近楼层
                    min_dist = dist;
                    nearest_floor = i;
                end 
                // 距离相同时优先上行
                else if ((dist == min_dist) && (i > nearest_floor)) begin
                    nearest_floor = i;
                end
            end
        end
        
        // 移动方向决策
        if (nearest_floor != current_floor) begin
            // 上行决策
            if (nearest_floor > current_floor) begin
                next_floor = current_floor + 1;  // 楼层+1
                moving_up   = 1'b1;             // 点亮上行灯
                moving_down = 1'b0;
            end 
            // 下行决策
            else begin
                next_floor = current_floor - 1;  // 楼层-1
                moving_up   = 1'b0;
                moving_down = 1'b1;              // 点亮下行灯
            end
        end 
        // 无请求时保持静止
        else begin
            next_floor = current_floor;
            moving_up   = 1'b0;
            moving_down = 1'b0;
        end
    end
end

endmodule