module counter_2_bcd(
	BO,
	CO,
	CP,
	CLR_,
	U,
	Q,
	BO_t,
	CO_t
);

	input U;
	input CP;
	input CLR_;

	output wire [1:0]CO_t;
	output wire [1:0]BO_t;
	
	output wire CO;
	output wire BO;
	output wire [7:0]Q;
	wire [1:0]carry_in;
	
	genvar i;
		generate
			for (i=0; i<2; i=i+1) begin : counter_Block
			
				
				
			assign carry_in[i] = (i == 0) ? CP : (U ? CO_t[i-1] : BO_t[i-1]);
			//assign carry_in[i] = (i == 0) ? CP : Q[4*i-1];
			

			assign CO = CO_t[1];
			assign BO = BO_t[1];
		
				
			counter_1_bcd counterinst0(
				.BO(BO_t[i]),
				.CO(CO_t[i]),
				.CP(carry_in[i]),
				.CLR_(CLR_),
				.U(U),
				.Q(Q[4*i+3:4*i])
				);
			end

		endgenerate
	
endmodule
	