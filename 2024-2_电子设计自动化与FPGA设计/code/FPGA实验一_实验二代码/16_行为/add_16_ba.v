module add_16_ba(
	A0,
	A1,
	CO,
	SO,
	CO_p
);

	input [15:0]A0;
	input [15:0]A1;
	input CO_p;
	
	output reg [15:0]SO;
	output reg CO;
	reg [16:0]sum_1;
	
	
	always@(*)
	begin
		sum_1 = A1 + A0 + CO_p;
		{CO,SO} = sum_1;
	end
		
endmodule