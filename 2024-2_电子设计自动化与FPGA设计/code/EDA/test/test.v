module test(A,B,O);
	input [7:0]A,B;
	output reg [7:0]O;
	
	integer i;
	always@(*)begin
		for(i=0;i<2;i=i+1)
			O[i] = A[2*i] + B[2*i + 1] +i[0];
		
	end
	
endmodule
	