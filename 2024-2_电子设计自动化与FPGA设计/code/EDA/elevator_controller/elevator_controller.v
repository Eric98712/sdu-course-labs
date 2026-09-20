module elevator_controller (
    input        clk,
    input        rst_n,
    input  [9:0] req_floors,
    output reg [3:0] current_floor,
    output reg      moving_up,
    output reg      moving_down
);

// 请求寄存器与清除请求标志
reg [9:0] req_reg;
reg       clear_request;      // 请求清除标志
reg [3:0] clear_floor;        // 待清除的楼层

// 单一always块处理所有req_reg更新
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        req_reg       <= 10'b0;     // 复位清零
        current_floor <= 4'd0;
        moving_up     <= 1'b0;
        moving_down   <= 1'b0;
    end else begin
        // 优先级1：处理当前楼层的请求清除
        if (clear_request) begin
            req_reg[clear_floor] <= 1'b0;
            clear_request        <= 1'b0;  // 清除标志复位
        end 
        // 优先级2：锁存新请求
        else begin
            req_reg <= req_reg | req_floors;
        end

        // 移动逻辑（原第二个always块内容整合至此）
        if (req_reg[current_floor]) begin
            clear_request <= 1'b1;        // 设置清除标志
            clear_floor    <= current_floor;
            moving_up       <= 1'b0;
            moving_down     <= 1'b0;
        end else 
		  begin
            integer i, min_dist, nearest_floor;
            min_dist      = 10;
            nearest_floor = current_floor;
            
            for (i = 0; i < 10; i = i+1) begin
                if (req_reg[i]) begin
                    integer dist;
                    dist = (i > current_floor) ? 
                          (i - current_floor) : 
                          (current_floor - i);
                    if (dist < min_dist) begin
                        min_dist      = dist;
                        nearest_floor = i;
                    end else if (dist == min_dist && i > nearest_floor) begin
                        nearest_floor = i;
                    end
                end
            end
            
            if (nearest_floor != current_floor) begin
                if (nearest_floor > current_floor) begin
                    current_floor <= current_floor + 1;
                    moving_up     <= 1'b1;
                    moving_down   <= 1'b0;
                end else begin
                    current_floor <= current_floor - 1;
                    moving_up     <= 1'b0;
                    moving_down   <= 1'b1;
                end
            end else begin
                moving_up   <= 1'b0;
                moving_down <= 1'b0;
            end
        end
    end
end

endmodule
