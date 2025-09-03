'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tractor, Box, Store, ScanLine, FileText, Bot, ArrowRight, ShieldCheck, TrendingUp, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      icon: <Tractor className="w-8 h-8 text-primary" />,
      title: 'Produce Registration',
      description: 'Farmers can easily register their produce, creating a digital identity for every batch, right from the source.',
    },
    {
      icon: <Box className="w-8 h-8 text-primary" />,
      title: 'Blockchain Tracking',
      description: 'Each lot is tracked on a secure blockchain as it moves through the supply chain, ensuring immutable records.',
    },
    {
      icon: <Store className="w-8 h-8 text-primary" />,
      title: 'Transaction Verification',
      description: 'Distributors and retailers can verify and update the produce\'s journey, maintaining a transparent chain of custody.',
    },
    {
      icon: <ScanLine className="w-8 h-8 text-primary" />,
      title: 'QR Code Access',
      description: 'Consumers can scan a simple QR code to instantly access the full history of their food, from farm to shelf.',
    },
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: 'Smart Contract Audit',
      description: 'Leverage our GenAI-powered tool to generate and audit smart contracts, ensuring integrity and efficiency.',
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: 'Transparency Reports',
      description: 'Generate and view detailed reports for any produce lot, showcasing its journey and certifications.',
    },
  ];

  const howItWorks = [
    {
      icon: <Tractor className="w-10 h-10 text-primary" />,
      title: "1. Register & Mint",
      description: "Farmers register produce lots and mint a unique digital token on the blockchain, creating an immutable starting point for the supply chain."
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-primary" />,
      title: "2. Track & Transfer",
      description: "As produce moves from farmer to distributor and retailer, each step is recorded as a secure transaction on the blockchain."
    },
    {
      icon: <Search className="w-10 h-10 text-primary" />,
      title: "3. Verify & Trust",
      description: "Consumers scan a QR code to view the complete, unalterable history of their food, ensuring authenticity and building trust."
    }
  ]

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };


  return (
    <div className="flex flex-col items-center bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full relative h-[85vh] md:h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />
        <Image
          src="https://picsum.photos/1800/1200"
          alt="Lush green farm field at sunrise"
          data-ai-hint="farm landscape sunrise"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/10 z-10" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="relative z-30 flex flex-col items-center justify-center h-full text-center text-foreground p-4"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-bold font-headline mb-6 tracking-tighter">
            Trust in Every Bite
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-2xl max-w-3xl mb-10 text-muted-foreground">
            AgriTrace brings unparalleled transparency to the food supply chain.
            Know the journey of your food from farm to fork.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-7 px-10 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                Get Started for Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
       <motion.section
        id="about"
        className="w-full py-20 md:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold font-headline mb-4">
            How AgriTrace Works
          </motion.h2>
          <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-16">
            We simplify supply chain transparency with a secure, three-step process powered by blockchain technology.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {howItWorks.map((step, index) => (
               <motion.div key={index} variants={itemVariants}>
                <Card className="bg-transparent border-none shadow-none text-center">
                  <CardHeader className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-5 ring-4 ring-primary/5">
                      {step.icon}
                    </div>
                    <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
               </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why AgriTrace Section */}
      <motion.section 
        className="w-full py-20 md:py-28 bg-secondary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
             <Image
              src="https://picsum.photos/800/600"
              alt="Farmer holding fresh produce"
              data-ai-hint="farmer produce"
              width={800}
              height={600}
              className="rounded-lg shadow-2xl object-cover"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">Why AgriTrace?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              In a world where consumers demand to know more about their food, AgriTrace provides the missing link of trust and verification. Our platform protects brand integrity, reduces fraud, and empowers every stakeholder with undeniable proof of provenance.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-7 h-7 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Enhance Trust & Safety</h4>
                  <p className="text-muted-foreground">Build consumer confidence with a fully transparent and verifiable supply chain history for every product.</p>
                </div>
              </li>
               <li className="flex items-start gap-3">
                <TrendingUp className="w-7 h-7 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Increase Efficiency</h4>
                  <p className="text-muted-foreground">Streamline record-keeping and audits with a single, immutable source of truth for all supply chain events.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>


      {/* Features Section */}
      <motion.section
        id="features"
        className="w-full py-20 md:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold font-headline text-center mb-16">
            A Complete Platform
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} custom={index} variants={itemVariants}>
                <Card className="bg-card/50 border-border/50 shadow-lg hover:shadow-xl hover:border-border transition-all duration-300 h-full hover:-translate-y-2">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="font-headline">{feature.title}</CardTitle>
                      <p className="text-sm text-muted-foreground pt-2">{feature.description}</p>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
