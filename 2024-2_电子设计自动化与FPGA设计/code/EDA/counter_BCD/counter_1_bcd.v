module counter_1_bcd(
	BO,
	CO,
	CP,
	CLR_,
	U,
	Q,
);

	input U;
	input CP;
	input CLR_;

	output reg CO;
	output reg BO;
	output reg [3:0]Q;
	

	
	always@(posedge CP or negedge CLR_)
	begin
		if(CLR_ == 0 )
		begin
			Q <= 4'd0;
			CO <=0;
			BO <=0;
		end
		else if(U == 1)
			begin
				if(Q == 4'd9)
				begin
					CO <= 1;
					Q <= 4'd0;
				end
				else
				begin
					Q <= (Q + 1'b1);
					CO <= 0;
				end
			end
		else if(U == 0 )
			begin
				if(Q == 4'd0)
				begin
					Q <=4'd9;
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
	