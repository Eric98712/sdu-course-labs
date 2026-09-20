module controller (CLK, S, nRESET, HG, HY, HR, FG, FY, FR, TimerH, TimerL);

	//one-hot
	parameter [3:0]S0 = 4'b0001,
						S1 = 4'b0010,
						S2 = 4'b0100,
						S3 = 4'b1000;
	parameter [1:0]S0_POS = 2'd0,
						S1_POS = 2'd1,
						S2_POS = 2'd2,
						S3_POS = 2'd3;					
	
//I/O ports
	input CLK, S, nRESET;  
	//if S=1, indicates that there is car on the country road
	output HG, HY, HR, FG, FY, FR; 
//declared output signals are registers
	reg    HG, HY, HR, FG, FY, FR;
	output [3:0] TimerH;
	output [3:0] TimerL;
	reg    [3:0] TimerH, TimerL;
//Internal state variables
	wire Tl, Ts, Ty; //timer output signals
	reg St;               //state translate signal
	reg [3:0] CurrentState, NextState;    //FSM state register
	
	always @(posedge CLK or negedge nRESET )
	begin:  counter
		if (~nRESET)  {TimerH, TimerL} <= 8'h00; 
		else if (St)         {TimerH, TimerL} <= 8'h00; 
		else if ((TimerH == 5) & (TimerL == 9)) 
			begin {TimerH, TimerL} <= {TimerH, TimerL}; end
		else if (TimerL == 9) 
			begin TimerH <= TimerH + 1;  TimerL <= 0; end
		else 
			begin TimerH <= TimerH; TimerL <= TimerL + 1; end
	end  // BCD counter
	assign  Ty = (TimerH==0)&(TimerL==4);
	assign  Ts = (TimerH==2)&(TimerL==9);
	assign  Tl = (TimerH==5)&(TimerL==9);
	always @(posedge CLK or negedge nRESET )
    begin:  statereg
	if (~nRESET)    	//Signal controller starts in S0 state
	 	CurrentState  <=  S0;
	else      CurrentState  <=  NextState;
     end   //statereg

// FSM combinational block: state machine using case statements
	always @(S or CurrentState or Tl or Ts or Ty )
		begin: fsm
		NextState = S0;
		case(1'b1)
		CurrentState[S0_POS]: 
		begin         
		     NextState = (Tl && S) ? S1 :S0;
			  St = (Tl && S) ? 1:0;
		end
	  	CurrentState[S1_POS]:      
		begin
				NextState = (Ty) ? S2 :S1;
				St = (Ty) ? 1:0;
		end
	  	CurrentState[S2_POS]:       
		begin
				NextState = (Ts || ~S) ? S3 :S2;
				St = (Ts || ~S) ? 1:0;
		end
	  	CurrentState[S3_POS]:     
		begin
				NextState = (Ty) ? S0 :S3;
				St = (Ty) ? 1:0;
		end
	 endcase	
end  //fsm
/*===== Description of the decoder block =====*/
//Compute values of main signal and country signal
always @(CurrentState)
    begin
        case (CurrentState)
				S0: begin
						{HG, HY, HR} = 3'b100; //Highway signal is green
						{FG, FY, FR}   = 3'b001; //Country signal is red 
                    end
            S1: begin
						{HG, HY, HR} = 3'b010; //Highway signal is yellow
                  {FG, FY, FR}  = 3'b001;    //Country signal is red
	         end
				S2: begin
					{HG, HY, HR} = 3'b001;   //Highway signal is red
					{FG, FY, FR}   = 3'b100;   //Country signal is green
	         end
				S3: begin
						{HG, HY, HR} = 3'b001;   //Highway signal is red
						{FG, FY, FR}   = 3'b010;   //Country signal is yellow
	         end
           endcase
   end
endmodule
