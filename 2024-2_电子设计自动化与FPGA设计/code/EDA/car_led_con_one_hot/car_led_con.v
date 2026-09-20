module car_led_con(CLK,HAZ,LEFT,RIGHT,nCR,L,R);
	input CLK,HAZ,LEFT,RIGHT,nCR;
	output reg [2:0]L;
	output reg [2:0]R;
	reg [3:0]state,next_state;
	
	parameter [3:0] IDLE = 4'b0001,
						 LEF = 4'b0010,
						 RIG = 4'b0100,
						 WARN = 4'b1000;
						 
	parameter [1:0] IDLE_POS = 2'd0,
						 LEF_POS = 2'd1,
						 RIG_POS = 2'd2,
						 WARN_POS = 2'd3;
	
	always@(posedge CLK or negedge nCR)
	begin
			if(~nCR)
				state <= IDLE;
			else
				state <= next_state;
	end
	
	always@(HAZ or LEFT or RIGHT)
	begin
		next_state = IDLE;
		case(1'b1)
			state[IDLE_POS]:
			begin
				if(HAZ + LEFT*RIGHT ==1)
					next_state = WARN;
				if(LEFT == 1)
					next_state = LEF;
				if(RIGHT == 1)
					next_state = RIG;
				if(~(HAZ+RIGHT+LEFT))
					next_state = IDLE;
				end
			state[LEF_POS]:
			begin
				next_state = IDLE;
				if(HAZ == 1)
					next_state = WARN;
				end
			state[RIG_POS]:
			begin
				next_state = IDLE;
				if(HAZ == 1)
					next_state = WARN;	
				end
			state[IDLE_POS]:
			begin
					next_state = IDLE;
			end
		endcase
	end
	
	
	
	always@(state)
	begin
		case(state)
			IDLE:begin
				L = 3'b0;
				R = 3'b0;
			end
			
			LEF:begin
				L = 3'd7;
				R = 3'b0;
			end
			
			RIG:begin
				L = 3'b0;
				R = 3'd7;
			end
			
			WARN:begin
				L = 3'd7;
				R = 3'd7;
			end
			
		endcase
			
	end
	
	
	endmodule
	