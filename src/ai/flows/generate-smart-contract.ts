// The code is a Next.js server action, so we must mark it as such.
'use server';

/**
 * @fileOverview Generates a smart contract code suggestion based on the produce details and tracking requirements.
 *
 * - generateSmartContract - A function that generates a smart contract code suggestion.
 * - SmartContractInput - The input type for the generateSmartContract function.
 * - SmartContractOutput - The return type for the generateSmartContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartContractInputSchema = z.object({
  produceDetails: z.string().describe('Details about the produce, including origin, planting date, expected harvest date, and number of items in a lot.'),
  trackingRequirements: z.string().describe('Specific tracking requirements for the produce as it moves through the supply chain, including details about distribution, retail, and transaction verification.'),
});
export type SmartContractInput = z.infer<typeof SmartContractInputSchema>;

const SmartContractOutputSchema = z.object({
  smartContractCode: z.string().describe('A suggested smart contract code based on the produce details and tracking requirements.'),
});
export type SmartContractOutput = z.infer<typeof SmartContractOutputSchema>;

export async function generateSmartContract(input: SmartContractInput): Promise<SmartContractOutput> {
  return generateSmartContractFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartContractPrompt',
  input: {schema: SmartContractInputSchema},
  output: {schema: SmartContractOutputSchema},
  prompt: `You are an expert in smart contract development. Based on the provided produce details and tracking requirements, generate a smart contract code suggestion.

Produce Details: {{{produceDetails}}}
Tracking Requirements: {{{trackingRequirements}}}

Smart Contract Code:`,
});

const generateSmartContractFlow = ai.defineFlow(
  {
    name: 'generateSmartContractFlow',
    inputSchema: SmartContractInputSchema,
    outputSchema: SmartContractOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
