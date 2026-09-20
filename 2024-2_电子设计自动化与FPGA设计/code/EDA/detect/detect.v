module detect(CLK,nCR,Data,OUT,current_state);

	input CLK,nCR,Data;
	output reg OUT;
	output reg [1:0]current_state;
	
	reg [1:0]next_state;
	
	parameter [1:0]S0 = 2'b00,
						S1 = 2'b01,
						S2 = 2'b11,
						S3 = 2'b10;
						
	always@(posedge CLK or negedge nCR)
	begin
		if(~nCR)
			current_state <= S0;
		else
			current_state <= next_state;
	end
	
	always@(Data or current_state)
	begin
		next_state = S0;
		
		case(current_state)
			S0:begin
				if(Data == 0)
					next_state = S1;
					OUT = 0;
			end
			
			S1:begin
				if(Data == 1)
					next_state = S2;
					OUT = 0;
			end
			
			S2:begin
				if(Data == 1)
					next_state = S3;
					OUT = 0;
			end
			
			S3:begin
				OUT = 1;
				next_state = S0;
			end
		endcase
	end
	
	endmodule
	