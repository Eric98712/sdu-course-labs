module adder_4_bcd(
	A0,
	A1,
	CO,
	SO,
	CI
);

	input [3:0]A0;
	input [3:0]A1;
	input CI;
	
	output reg [3:0]SO;
	output reg CO;
	reg [4:0]sum_tmp;
	
	always@(*)
	begin
		sum_tmp = A0+ A1 + CI;
		
		if( sum_tmp > 4'b1001)
			begin
				CO = 1;
				SO = sum_tmp - 4'd10;
			end
				
			else
			begin
				SO = sum_tmp;
				CO = 0;
			end
	end
endmodule
	