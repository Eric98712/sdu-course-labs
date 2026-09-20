module encoder_8_3(
	A0,
	A1,
	A2,
	A3,
	A4,
	A5,
	A6,
	A7,
	Y0,
	Y1,
	Y2
);
	input A0;
	input A1;
	input A2;
	input A3;
	input A4;
	input A5;
	input A6;
	input A7;
	
	output reg Y0;
   output reg Y1;
   output reg Y2;
	
	always@(*)
	    casex({A7,A6,A5,A4,A3,A2,A1,A0})
        8'd1:{Y2,Y1,Y0}=3'd0;
        8'd2:{Y2,Y1,Y0}=3'd1;
        8'd4:{Y2,Y1,Y0}=3'd2;
        8'd8:{Y2,Y1,Y0}=3'd3;
        8'd16:{Y2,Y1,Y0}=3'd4;
        8'd32:{Y2,Y1,Y0}=3'd5;
        8'd64:{Y2,Y1,Y0}=3'd6;
        8'd128:{Y2,Y1,Y0}=3'd7;
        default:{Y2,Y1,Y0}=3'd0;
		 endcase


endmodule