import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Upload, Zap, Music, Headphones, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import WaveformAnimation from '@/components/WaveformAnimation';
import Navigation from '@/components/Navigation';

const HomePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: Music,
      title: 'AI-Powered Remixing',
      description: 'Transform any track into festival-ready EDM with our advanced AI technology'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate professional EDM remixes in under 60 seconds'
    },
    {
      icon: Headphones,
      title: 'Professional Quality',
      description: 'Studio-grade audio processing for radio-ready tracks'
    },
    {
      icon: TrendingUp,
      title: 'Trending Sounds',
      description: 'Stay ahead with the latest EDM trends and festival vibes'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/30 to-green-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
              {...fadeInUp}
            >
              Remix Your Songs into
              <br />
              Festival-Ready EDM Tracks
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Transform any audio into professional EDM remixes using cutting-edge AI technology
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <Link to="/studio">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold text-lg px-8 py-6 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your Song
                </Button>
              </Link>
              
              <Link to="/text-to-remix">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/20 font-semibold text-lg px-8 py-6 shadow-lg shadow-green-500/10 hover:shadow-green-500/25 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Try Text-to-EDM
                </Button>
              </Link>
            </motion.div>

            {/* Waveform Animation */}
            <motion.div
              className="max-w-2xl mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <WaveformAnimation height={80} bars={32} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Why Choose AI Music Web?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of music production with our AI-powered EDM remixing platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:bg-gray-800/80"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-900/20 to-cyan-900/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to Create Your First EDM Remix?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of artists already using AI Music Web to transform their tracks
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/studio">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold text-lg px-8 py-6 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Remixing Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-green-500/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              AI Music Web
            </span>
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} AI Music Web. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;