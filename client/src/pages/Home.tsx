import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Box, Compass, Scan, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference px-6 py-6 md:px-12 flex justify-between items-center text-white">
        <div className="font-display text-2xl font-bold tracking-widest uppercase">
          Morphology
        </div>
        <div className="flex gap-8 text-sm uppercase tracking-widest font-sans font-medium">
          <Link href="/archive" className="hover:opacity-60 transition-opacity">Archive</Link>
          <Link href="/analysis" className="hover:opacity-60 transition-opacity">Analysis</Link>
          <Link href="/dashboard" className="hover:opacity-60 transition-opacity text-primary">Curation</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-24 px-6">
        <div className="absolute inset-0 bg-[url('/images/artifact_motion.png')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-none">
              Geometric <br className="hidden md:block"/> Extraction
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed">
              A digital aggregator and motion study platform isolating the atomic, molecular, and cultural geometries embedded within ancient artifacts.
            </p>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.8 }}
             className="flex gap-4 justify-center pt-8"
          >
            <Link href="/dashboard">
              <Button size="lg" className="rounded-none uppercase tracking-widest text-xs px-8 border-2 border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary transition-all duration-300">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/analysis">
              <Button size="lg" variant="outline" className="rounded-none uppercase tracking-widest text-xs px-8 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Start Analysis
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Artifact Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-border pb-8">
          <h2 className="font-display text-4xl md:text-5xl">Curated Civilizations</h2>
          <Button variant="ghost" className="rounded-none uppercase tracking-widest text-xs gap-2">
            View Archive <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          
          <ArtifactCard 
            image="/images/artifact_prehistory.png"
            title="Carved Bone Tool"
            civilization="Prehistory"
            geometry="Atomic"
            id="PRE-01"
          />
          <ArtifactCard 
            image="/images/artifact_mesopotamian.png"
            title="Clay Tablet"
            civilization="Mesopotamia"
            geometry="Structural"
            id="MES-01"
          />
          <ArtifactCard 
            image="/images/artifact_egypt.png"
            title="Predynastic Jar"
            civilization="Egypt"
            geometry="Molecular"
            id="EGY-01"
          />
          <ArtifactCard 
            image="/images/artifact_india.png"
            title="Steatite Seal"
            civilization="Indus Valley"
            geometry="Cultural"
            id="IND-01"
          />
          <ArtifactCard 
            image="/images/artifact_china.png"
            title="Bronze Ding"
            civilization="Shang Dynasty"
            geometry="Functional"
            id="CHN-01"
          />
          <ArtifactCard 
            image="/images/artifact_persia.png"
            title="Gold Rhyton"
            civilization="Persia"
            geometry="Cultural"
            id="PER-01"
          />
          <ArtifactCard 
            image="/images/artifact_greek.png"
            title="Geometric Krater"
            civilization="Greece"
            geometry="Molecular"
            id="GRK-01"
          />
          <ArtifactCard 
            image="/images/artifact_rome.png"
            title="Mosaic Fragment"
            civilization="Rome"
            geometry="Atomic"
            id="ROM-01"
          />
          <ArtifactCard 
            image="/images/artifact_islamic.png"
            title="Brass Astrolabe"
            civilization="Islamic Golden Age"
            geometry="Functional"
            id="ISL-01"
          />
          <ArtifactCard 
            image="/images/artifact_dark_ages.png"
            title="Garnet Fibula"
            civilization="Early Medieval Europe"
            geometry="Structural"
            id="MED-01"
          />
          <ArtifactCard 
            image="/images/artifact_renaissance.png"
            title="Polyhedral Intarsia"
            civilization="Renaissance"
            geometry="Atomic"
            id="REN-01"
          />

        </div>
      </section>

      {/* Capabilities / Tooling */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
           <h2 className="font-display text-4xl md:text-6xl mb-16 text-center">Platform Capabilities</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-background/20 pt-16">
             <div className="space-y-6">
               <Scan className="w-10 h-10 stroke-1" />
               <h3 className="font-serif text-2xl">Form Extraction</h3>
               <p className="font-sans text-background/70 leading-relaxed text-sm">
                 Isolate specific geometric shapes from complex artifacts using automated edge detection and pattern recognition algorithms.
               </p>
             </div>
             
             <div className="space-y-6">
               <Box className="w-10 h-10 stroke-1" />
               <h3 className="font-serif text-2xl">Motion Studies</h3>
               <p className="font-sans text-background/70 leading-relaxed text-sm">
                 Reconstruct the historical usage and ritualistic motion of artifacts through simulated physics and kinematic rigging.
               </p>
             </div>

             <div className="space-y-6">
               <Share2 className="w-10 h-10 stroke-1" />
               <h3 className="font-serif text-2xl">API Aggregation</h3>
               <p className="font-sans text-background/70 leading-relaxed text-sm">
                 Connect directly with participating museum databases to pull high-resolution photometric scans and metadata.
               </p>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
}

function ArtifactCard({ image, title, civilization, geometry, id }: { image: string, title: string, civilization: string, geometry: string, id: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer space-y-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 font-sans text-xs uppercase tracking-widest">
          {geometry}
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <Button variant="outline" className="rounded-none border-white text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs">
            Begin Study
          </Button>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center text-sm font-sans text-muted-foreground uppercase tracking-wider mb-2">
          <span>{id}</span>
          <span>{civilization}</span>
        </div>
        <h3 className="font-serif text-2xl group-hover:underline underline-offset-4">{title}</h3>
      </div>
    </motion.div>
  )
}
