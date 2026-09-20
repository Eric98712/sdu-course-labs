module Adder_16(
	A0,
	A1,
	CO,
	SO,
	CO_p
);

	input [15:0]A0;
	input [15:0]A1;
	input CO_p;
	
	output wire CO;
	output wire [15:0]SO;
	
	wire [15:0]CO_1;

	genvar i;
	generate
		for (i=0; i<16; i=i+1) begin : Adder_Block
			
			wire carry_in;
			
			if (i == 0)begin
					assign carry_in = CO_p;
			end
			else begin
					assign carry_in = CO_1[i-1];
			end
			
			if (i == 15)begin
					assign CO = CO_1[i];
			end
			
		 Adder_1 Adder_4inst0(
			.A0(A0[i]),
			.A1(A1[i]),
			.CO(CO_1[i]),
			.SO(SO[i]),
			.CO_p(carry_in)
			);
       end
	endgenerate
	
endmodule