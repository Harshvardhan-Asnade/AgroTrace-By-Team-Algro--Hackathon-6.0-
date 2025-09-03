
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
  prompt: `You are an expert in Solidity smart contract development for supply chain management. Based on the provided produce details and tracking requirements, generate a complete and robust Solidity smart contract.

The contract should be named 'AgroTrace' and use SPDX-License-Identifier: MIT and pragma solidity ^0.8.20;

It must include the following features:
1.  A 'HistoryEvent' struct with fields: status (string), timestamp (uint256), location (string), actor (string).
2.  A 'ProduceLot' struct with fields: lotId (string), name (string), farmer (address), distributor (address), retailer (address), and a dynamic array of HistoryEvent structs called 'history'.
3.  A mapping from a lot ID (string) to the ProduceLot struct.
4.  An 'owner' state variable.
5.  Events for 'BatchMinted', 'TransferredToDistributor', and 'TransferredToRetailer', each emitting the lotId and relevant addresses.
6.  A constructor that sets the contract deployer as the owner.
7.  A 'mintBatch' function that can only be called by a farmer. It should create a new ProduceLot, store it, and emit the 'BatchMinted' event. It should take lotId, name, and initial history as arguments.
8.  A 'transferToDistributor' function that takes a lotId and the distributor's address. It should update the lot's distributor field and add a new history event.
9.  A 'transferToRetailer' function that takes a lotId and the retailer's address. It should update the lot's retailer field and add a new history event.
10. A 'getLot' view function that returns all details of a specific lot.

Produce Details for this contract:
{{{produceDetails}}}

Tracking Requirements for this contract:
{{{trackingRequirements}}}

Generate the full Solidity smart contract code below. Do not include any explanations, just the code.
`,
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
