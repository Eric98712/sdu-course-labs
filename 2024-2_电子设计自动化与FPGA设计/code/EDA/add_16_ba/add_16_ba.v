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
	
	
	always@(*)
	begin
		{CO,SO} =  A1 + A0 + CO_p;
	end
		
endmodule