module Adder_1(
	A0,
	A1,
	CO,
	SO,
	CO_p
);

	input A0;
	input A1;
	input CO_p;
	
	output reg CO;
	output reg SO;
	
	reg [1:0]sum_1;
	always@(*)
	begin
		sum_1 = A0 + A1 + CO_p;
		{CO,SO} = sum_1;
	end
	
endmodule