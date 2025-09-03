'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { generateSmartContract } from '@/ai/flows/generate-smart-contract';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Clipboard, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Inputs = {
  produceDetails: string;
  trackingRequirements: string;
};

export default function SmartContractAuditorPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setGeneratedCode('');
    try {
      const result = await generateSmartContract(data);
      setGeneratedCode(result.smartContractCode);
    } catch (error) {
      console.error('Error generating smart contract:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'An error occurred while generating the smart contract. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> Smart Contract Audit Tool</CardTitle>
          <CardDescription>
            Use our AI to generate a Solidity smart contract suggestion based on your supply chain needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="produceDetails">Produce Details</Label>
              <Textarea
                id="produceDetails"
                placeholder="e.g., Organic strawberries, Lot 42, Origin: CA, Harvested: 07/2024, 500 units per lot."
                className="min-h-[150px]"
                {...register('produceDetails', { required: 'Produce details are required' })}
              />
              {errors.produceDetails && <p className="text-sm text-destructive">{errors.produceDetails.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingRequirements">Tracking Requirements</Label>
              <Textarea
                id="trackingRequirements"
                placeholder="e.g., Track from farmer to distributor, then to retailer. Verify temperature during transit. Final consumer scan reveals full history."
                className="min-h-[150px]"
                {...register('trackingRequirements', { required: 'Tracking requirements are required' })}
              />
              {errors.trackingRequirements && <p className="text-sm text-destructive">{errors.trackingRequirements.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Contract'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle>Generated Smart Contract</CardTitle>
          <CardDescription>Review the AI-generated code below. Always audit before deployment.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
          ) : generatedCode ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-8 w-8"
                onClick={handleCopy}
              >
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-code">
                <code>{generatedCode}</code>
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-center">
              <p>Your generated contract will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
