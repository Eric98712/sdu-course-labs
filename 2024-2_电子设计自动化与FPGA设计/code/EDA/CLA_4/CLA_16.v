module CLA_16 (
    A0, 
	 A1,
    CI,
    SO,
    CO
);

	input [15:0]A0;
	input [15:0]A1;
	input CI;
	 
	output wire [15:0]SO;
	output wire CO;
	
	wire [3:0]CO_1;
	
	genvar i;
	generate
		for (i=0; i<4; i=i+1) begin : Adder_Block
			wire carry_in;
			
			if (i == 0)begin
					assign carry_in = CI;
			end
			else begin
					assign carry_in = CO_1[i-1];
			end
			
			if (i == 3)begin
					assign CO = CO_1[3];
			end
		
		CLA_4 CLA_4inst0(
			.A0(A0[4*i+3:4*i]),
			.A1(A1[4*i+3:4*i]),
			.SO(SO[4*i+3:4*i]),
			.CI(carry_in),
			.CO(CO_1[i])
			);
		
		
		end
	endgenerate
endmodule
