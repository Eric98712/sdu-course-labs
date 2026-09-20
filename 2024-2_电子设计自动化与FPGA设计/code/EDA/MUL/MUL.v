module MUL(
    input [7:0] A, // 8 位乘数 A
    input [7:0] B, // 8 位乘数 B
    output reg [15:0] OUT // 16 位乘积 P
);

  
  reg [7:0] multiplier;
  integer i ;

  always @(*) begin
    OUT = 0;          // 清零
    multiplier = B; 
	 
    for ( i = 0; i < 8; i = i + 1) begin
      if (multiplier[0] == 1) begin
        OUT = OUT + (A << i); // 如果乘数的最低位是 1，则累加部分积
      end 
      
      multiplier = multiplier >> 1; // 右移乘数
      
    end
  end

endmodule

