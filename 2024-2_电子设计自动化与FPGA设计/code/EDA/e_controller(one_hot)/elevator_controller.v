module elevator_controller (
    input        clk,
    input        rst_n,
    input  [9:0] req_floors, //one-hot 编码
    output reg [3:0] current_floor,
	 output reg [9:0]	current_req,
    output reg      moving_up,
    output reg      moving_down
);

// 请求寄存器与清除请求标志
//	reg [9:0] current_req;
	reg [9:0] next_req;
	reg [3:0] next_floor;
	reg       clear_request;      // 请求清除标志
	reg [3:0] clear_floor;        // 待清除的楼层


	always @(posedge clk or negedge rst_n)
	begin
    if (!rst_n) 
	 begin
        current_req   <= 10'b0;     // 复位清零
        current_floor <= 4'd1;
    end 
	 else 
		begin
		  
        current_req       <= next_req;     
        current_floor     <= next_floor;
		end
	end
		  
		  
	always@(current_floor or current_req or req_floors) begin: movement_logic
	 integer i, min_dist, nearest_floor,dist;
		  next_req = current_req | req_floors;
        if (current_req[current_floor]) 
			begin
            next_req[current_floor] = 0;
            moving_up     = 1'b0;
            moving_down   = 1'b0;
			end 
		  else 
			begin
            min_dist = 10;
            nearest_floor = current_floor; // 默认为原地踏步
            
            for (i = 0; i < 10; i = i+1)  
				begin
                if (current_req[i]) 
					 begin
                    
                    dist = (i > current_floor) ? 
                          (i - current_floor) : 
                          (current_floor - i);
                    if (dist < min_dist) 
						  begin
                        min_dist      = dist;
                        nearest_floor = i;
                    end 
						  else if (dist == min_dist && i > nearest_floor) 
                        nearest_floor = i;				//优先向上
                end
            end
            
            if (nearest_floor != current_floor) begin
                if (nearest_floor > current_floor) begin
                    next_floor = current_floor + 1;
                    moving_up     = 1'b1;
                    moving_down   = 1'b0;
                end else begin
                    next_floor = current_floor - 1;
                    moving_up     = 1'b0;
                    moving_down   = 1'b1;
                end
            end 
				else //若无指令，则原地等待
				begin
					 next_floor = current_floor;
                moving_up   = 1'b0;
                moving_down = 1'b0;
            end
        end
    end
	
endmodule
