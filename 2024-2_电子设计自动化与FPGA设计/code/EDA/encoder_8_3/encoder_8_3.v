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
	Y2,
	EI,
	EO,
	GS
);
	input A0;
	input A1;
	input A2;
	input A3;
	input A4;
	input A5;
	input A6;
	input A7;
	input EI;
	
	output reg Y0;
   output reg Y1;
   output reg Y2;
	output reg EO;
	output reg GS;
	
	always@(*)
	begin
		if (EI)
		begin
		 EO = 0;
		 GS = 1;
	    casex({A7,A6,A5,A4,A3,A2,A1,A0})
        8'd1:begin{Y2,Y1,Y0}=3'd0;EO = 1;end
        8'd2:begin{Y2,Y1,Y0}=3'd1;EO = 1;end
        8'd4:begin{Y2,Y1,Y0}=3'd2;EO = 1;end
        8'd8:begin{Y2,Y1,Y0}=3'd3;EO = 1;end
        8'd16:begin{Y2,Y1,Y0}=3'd4;EO = 1;end
        8'd32:begin{Y2,Y1,Y0}=3'd5;EO = 1;end
        8'd64:begin{Y2,Y1,Y0}=3'd6;EO = 1;end
        8'd128:begin{Y2,Y1,Y0}=3'd7;EO = 1;end
        default:begin
				{Y2,Y1,Y0}=3'd0;
				EO = 0;
				GS = 0;
				end
		 endcase
		 
		 end
		 else
			begin
				{Y2,Y1,Y0}=3'd0;
				EO = 1;
				GS = 0;
			end
	end

endmodule
