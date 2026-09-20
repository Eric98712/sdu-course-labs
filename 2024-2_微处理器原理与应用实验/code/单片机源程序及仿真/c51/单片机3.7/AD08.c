#include "AD08.H"


void delay(unsigned int x)
{
	unsigned int i, j;
	for (i = 0; i < x; i++)
		for (j = 0; j < 120; j++);
}


