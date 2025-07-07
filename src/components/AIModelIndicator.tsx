import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Zap, Brain, Cpu } from 'lucide-react';

interface AIModelIndicatorProps {
  model: string;
  isGenerating?: boolean;
}

const AIModelIndicator: React.FC<AIModelIndicatorProps> = ({ model, isGenerating }) => {
  const getModelIcon = () => {
    switch (model) {
      case 'AIVA Neural Engine v3.2':
        return <Brain className="w-3 h-3" />;
      case 'DeepMusic Pro':
        return <Cpu className="w-3 h-3" />;
      case 'SynthAI Advanced':
        return <Zap className="w-3 h-3" />;
      default:
        return <Brain className="w-3 h-3" />;
    }
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>

      <Badge
        variant="secondary"
        className="bg-gradient-to-r from-[#00ff8f]/20 to-[#00ffe1]/20 border-[#00ff8f]/30 text-[#00ff8f] hover:from-[#00ff8f]/30 hover:to-[#00ffe1]/30">

        <motion.div
          className="flex items-center gap-1"
          animate={isGenerating ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: isGenerating ? Infinity : 0 }}>

          {getModelIcon()}
          <span className="text-xs font-medium">AI: {model}</span>
        </motion.div>
      </Badge>
      
      {isGenerating &&
      <motion.div
        className="flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}>

          <div className="flex space-x-1">
            {[0, 1, 2].map((i) =>
          <motion.div
            key={i}
            className="w-1 h-1 bg-[#00ff8f] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }} />

          )}
          </div>
          <span className="text-xs text-[#00ff8f]/70">Neural Processing...</span>
        </motion.div>
      }
    </motion.div>);

};

export default AIModelIndicator;