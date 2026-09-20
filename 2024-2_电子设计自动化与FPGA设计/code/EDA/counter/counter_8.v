module counter_8(
	BO,
	CO,
	CP,
	CLR,
	U,
	Q
);

	input U;
	input CP;
	input CLR;

	output reg CO;
	output reg BO;
	output reg [7:0]Q;
	

	
	always@(posedge CP)
	begin
		if(CLR == 0)
			Q <= 8'd0;
		else if(U == 1)
			begin
				if(Q == 8'd255)
					CO <= 1;
				else
				begin
					Q <= (Q + 1'b1)%255;
					CO <= 0;
				end
			end
		else if(U == 0)
			begin
				if(Q == 0)
				begin
					Q <=8'b1111_11111;
					BO <= 1;
				end
				else
				begin
					Q <= (Q - 1'b1);
					BO <= 0;
				end
			end
			
	end
	
endmodule
	