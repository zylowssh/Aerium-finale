import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Bell, 
  Wind,
  ArrowRight,
  Gauge,
  Leaf,
  Code2,
  Github,
  LogIn,
  Lightbulb,
  Terminal,
  ChevronDown,
  MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoSection from '@/components/landing/VideoSection';
import { useState, useEffect, useRef } from 'react';

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Avancé',
    description: 'Visualisez les données en temps réel avec des graphiques interactifs et des analyses détaillées.'
  },
  {
    icon: Bell,
    title: 'Système d\'Alertes',
    description: 'Notifications intelligentes basées sur des seuils personnalisés pour chaque capteur.'
  },
  {
    icon: TrendingUp,
    title: 'Analyses Tendances',
    description: 'Comparez les données historiques et identifiez les patterns de qualité de l\'air.'
  },
  {
    icon: Wind,
    title: 'Support Multi-Capteurs',
    description: 'Compatible avec une large gamme de capteurs IoT pour une flexibilité maximale.'
  },
  {
    icon: Gauge,
    title: 'Métriques Détaillées',
    description: 'Suivi complet de CO2, humidité, température et autres paramètres clés.'
  },
  {
    icon: Lightbulb,
    title: 'Recommandations',
    description: 'Suggestions intelligentes pour améliorer la qualité de l\'air de vos espaces.'
  }
];

const techStack = [
  { name: 'React + TypeScript', icon: Code2 },
  { name: 'Python (Flask)', icon: Terminal },
  { name: 'Mises à Jour en temps réel', icon: Zap },
  { name: 'Base de Données', icon: Activity }
];

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const featureCardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -12,
    transition: { duration: 0.3 }
  }
};

// Fade up/down for scroll direction
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -60,
    transition: { duration: 0.5, ease: "easeIn" }
  }
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Smooth scroll tracking for parallax
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Navbar opacity based on scroll
  const navBgOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1]);
  const navBorderOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY < 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = () => {
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation - Blends with hero at top */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isAtTop ? 'transparent' : 'hsl(var(--background) / 0.85)',
          backdropFilter: isAtTop ? 'none' : 'blur(12px)',
        }}
      >
        <motion.div 
          className="absolute inset-x-0 bottom-0 h-px bg-border"
          style={{ opacity: navBorderOpacity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Aerium" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">Aerium</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/dashboard">
                <Button variant="ghost" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Démo
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="gap-2">
                  <Github className="w-4 h-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Enhanced Parallax */}
      <section 
        ref={heroRef}
        className="relative min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"
          style={{ y: scrollY * 0.4, opacity: Math.max(0, 1 - scrollY / 500) }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          style={{ y: -scrollY * 0.3, opacity: Math.max(0, 1 - scrollY / 600) }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          style={{ scale: 1 + scrollY * 0.0005 }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-4 h-4 rounded overflow-hidden flex-shrink-0">
                <img src="/logo.png" alt="" className="w-full h-full object-contain" />
              </div>
              Projet de Surveillance de la Qualité de l'Air
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block mb-4"
              >
                Surveillez l'Air
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
              >
                en Temps Réel
              </motion.span>
            </h1>

            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Un dashboard interactif pour monitorer la qualité de l'air avec des capteurs IoT, 
              des analyses avancées et des alertes intelligentes.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-lg shadow-lg shadow-primary/25">
                    Explorer le Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="px-8 h-12 text-lg" onClick={scrollToSection}>
                  En Savoir Plus
                </Button>
              </motion.div>
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm font-medium text-foreground hover:border-primary/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                >
                  <tech.icon className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.button
              onClick={scrollToSection}
              className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xs font-medium tracking-wider uppercase">Découvrir</span>
              <motion.div 
                className="relative w-8 h-14 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 group-hover:border-primary/60 transition-colors"
              >
                <motion.div
                  className="w-1.5 h-3 bg-primary rounded-full"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-primary/60" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection ref={videoSectionRef} />

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-background via-muted/20 to-background">
        {/* Animated background */}
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Zap className="w-4 h-4" />
              Caractéristiques Puissantes
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Fonctionnalités
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un ensemble complet d'outils pour une surveillance efficace de la qualité de l'air.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                whileHover="hover"
                className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 relative z-10"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-7 h-7 text-primary" />
                </motion.div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3 relative z-10">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  {feature.description}
                </p>
                
                {/* Animated line on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Activity className="w-4 h-4" />
              Architecture Simple
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Comment Ça Marche
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une architecture simple et efficace pour la surveillance en temps réel.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { number: '1', title: 'Capteurs IoT', description: 'Des capteurs collectent les données de qualité de l\'air', icon: Gauge },
              { number: '2', title: 'Backend Python', description: 'Les données sont traitées et stockées en temps réel', icon: Terminal },
              { number: '3', title: 'Dashboard React', description: 'Visualisation interactive et alertes intelligentes', icon: BarChart3 }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 group"
                whileHover={{ y: -8 }}
              >
                <motion.div 
                  className="absolute -top-5 left-8"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25">
                    {step.number}
                  </div>
                </motion.div>
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < 2 && (
                  <motion.div
                    className="hidden md:flex absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-muted border border-border"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background">
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Zap className="w-4 h-4" />
              Points Forts
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Points Forts du Projet
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce qui rend Aerium unique et performant.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title: 'Interface Moderne',
                description: 'Built avec React, TypeScript et Tailwind CSS pour une expérience utilisateur fluide et réactive.',
                icon: Lightbulb
              },
              {
                title: 'Temps Réel',
                description: 'Mise à jour instantanée des données via WebSockets pour un monitoring continu sans latence.',
                icon: Zap
              },
              {
                title: 'Architecture Scalable',
                description: 'Backend Python Flask conçu pour supporter des milliers de capteurs simultanément.',
                icon: BarChart3
              },
              {
                title: 'Base de Données',
                description: 'Stockage efficient avec indexation optimisée pour les requêtes historiques rapides.',
                icon: Activity
              }
            ].map((highlight, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-6 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                whileHover={{ y: -4 }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <motion.div 
                  className="flex-shrink-0 relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                    <highlight.icon className="w-7 h-7 text-primary" />
                  </div>
                </motion.div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Prêt à Découvrir Aerium ?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Explorez le dashboard complet avec des données en direct et des fonctionnalités interactives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/dashboard">
                  <Button size="lg" className="gradient-primary text-primary-foreground px-10 h-14 text-lg shadow-lg shadow-primary/25">
                    Accéder au Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="px-10 h-14 text-lg gap-2">
                    <Github className="w-5 h-5" />
                    Voir le Code Source
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Aerium" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-foreground">Aerium</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Aerium - Projet de Surveillance de la Qualité de l'Air
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/sensors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Capteurs
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
