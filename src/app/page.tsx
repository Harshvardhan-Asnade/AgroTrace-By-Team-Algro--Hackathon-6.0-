import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tractor, Box, Store, ScanLine, FileText, Bot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: <Tractor className="w-10 h-10 text-primary" />,
      title: 'Produce Registration',
      description: 'Farmers can easily register their produce, creating a digital identity for every batch, right from the source.',
    },
    {
      icon: <Box className="w-10 h-10 text-primary" />,
      title: 'Blockchain Tracking',
      description: 'Each lot is tracked on a secure blockchain as it moves through the supply chain, ensuring immutable records.',
    },
    {
      icon: <Store className="w-10 h-10 text-primary" />,
      title: 'Transaction Verification',
      description: 'Distributors and retailers can verify and update the produce\'s journey, maintaining a transparent chain of custody.',
    },
    {
      icon: <ScanLine className="w-10 h-10 text-primary" />,
      title: 'QR Code Access',
      description: 'Consumers can scan a simple QR code to instantly access the full history of their food, from farm to shelf.',
    },
    {
      icon: <Bot className="w-10 h-10 text-primary" />,
      title: 'Smart Contract Audit',
      description: 'Leverage our GenAI-powered tool to generate and audit smart contracts, ensuring integrity and efficiency.',
    },
    {
      icon: <FileText className="w-10 h-10 text-primary" />,
      title: 'Transparency Reports',
      description: 'Generate and view detailed reports for any produce lot, showcasing its journey and certifications.',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <section className="w-full relative h-[60vh] md:h-[70vh]">
        <Image
          src="https://picsum.photos/1800/1200"
          alt="Lush green farm field"
          data-ai-hint="farm landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight">
            Trust in Every Bite
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mb-8">
            AgriTrace brings unparalleled transparency to the food supply chain.
            Know the journey of your food from farm to fork.
          </p>
          <Link href="/trace">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 px-8">
              Trace Your Food
            </Button>
          </Link>
        </div>
      </section>

      <section id="about" className="w-full py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
            What is AgriTrace?
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            AgriTrace is a revolutionary platform that leverages blockchain technology to create a transparent, secure, and traceable food supply chain. We empower farmers, distributors, retailers, and consumers with the data they need to ensure food quality, authenticity, and safety.
          </p>
        </div>
      </section>

      <section id="features" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
