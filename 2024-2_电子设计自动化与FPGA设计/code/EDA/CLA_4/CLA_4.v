module CLA_4 (
    A0, 
	 A1,
    CI,
    SO,
    CO
);
	 input [3:0]A0;
	 input [3:0]A1;
	 input CI;
	 
	 output wire [3:0]SO;
	 output wire CO;
	 
	 
    wire [3:0] G, P;
    wire [4:0] C;
    
    assign C[0] = CI; 
	 
	 assign G = A0 & A1;
	 assign P = A0 ^ A1;
	 
	 assign C[1] = G[0] | (P[0] & C[0]);
    assign C[2] = G[1] | (P[1] & G[0]) | (P[1] & P[0] & C[0]);
    assign C[3] = G[2] | (P[2] & G[1]) | (P[2] & P[1] & G[0]) | (P[2] & P[1] & P[0] & C[0]);
    assign C[4] = G[3] | (P[3] & G[2]) | (P[3] & P[2] & G[1]) | (P[3] & P[2] & P[1] & G[0]) 
                | (P[3] & P[2] & P[1] & P[0] & C[0]);
    
    
    assign SO[0] = P[0] ^ C[0];
    assign SO[1] = P[1] ^ C[1];
    assign SO[2] = P[2] ^ C[2];
    assign SO[3] = P[3] ^ C[3];
    
    assign CO = C[4]; 
	 
endmodule