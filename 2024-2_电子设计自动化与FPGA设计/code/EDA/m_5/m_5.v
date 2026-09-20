module m_5(
	CLK,
	_CLR,
	OUT
	);
	input CLK;
	input _CLR;
	
	output OUT;
	reg [4:0]Q;
	wire C0;
	assign C0 = ~(Q[1]^ Q[2] ^ Q[3] ^ Q[4] );
	reg OUT ;
	
	always@(posedge CLK or negedge _CLR)
	begin
		if(~_CLR)
			Q <=5'd0;
		else
		begin
			Q <={Q[3:0],C0};
			OUT <= Q[4];
		end
	end
	

endmodule

