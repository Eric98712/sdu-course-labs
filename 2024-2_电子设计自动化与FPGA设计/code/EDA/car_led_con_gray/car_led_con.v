module car_led_con(CLK,HAZ,LEFT,RIGHT,nCR,L,R);
//格雷码编码
	parameter IDLE = 2'b00;
	parameter LEF = 2'b01;
	parameter RIG = 2'b11;
	parameter WARN = 2'b10;
//one-hot编码
//	parameter IDLE = 4'b0001;
//	parameter LEF = 4'b0010;
//	parameter RIG = 4'b0100;
//	parameter WARN = 4'b1000;

	input CLK,HAZ,LEFT,RIGHT,nCR;
	output reg [2:0]L;
	output reg [2:0]R;
	
	reg [1:0]Current_State;
	reg [1:0]Next_State;
	
	always@(posedge CLK or negedge nCR)
	begin
		if(~nCR)
			Current_State <= IDLE;
		else
			Current_State <= Next_State;
	end
	
	always@(Current_State or HAZ or LEFT or RIGHT)
	begin
		Next_State = 2'b00;
		case(Current_State)
			IDLE:
			begin  
				L = 3'b000;
				R = 3'b000;
				Next_State = IDLE;
				if(HAZ + LEFT*RIGHT ==1)
					Next_State = WARN;
				if(LEFT == 1)
					Next_State = LEF;
				if(RIGHT == 1)
					Next_State = RIG;
			end
			LEF://左转向灯和右转向灯不可能直接切换
			begin  
				L = ~L;
				Next_State = IDLE;
				if(LEFT == 1)
					Next_State = LEF;
				if(HAZ == 1)
					Next_State = WARN;
			end
			RIG:
			begin  
				R = ~R;
				Next_State = IDLE;
				if(RIGHT == 1)
					Next_State = RIG;
				if(HAZ == 1)
					Next_State = WARN;
			end
			WARN:
			begin  
				L = 3'd7;
				R = 3'd7;
				Next_State = IDLE;
			end
		endcase
		
	end
	
	
	endmodule
	