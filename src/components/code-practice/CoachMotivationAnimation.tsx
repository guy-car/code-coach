import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/lib/theme";

interface CoachMotivationAnimationProps {
  message: string;
}

export function CoachMotivationAnimation({ message }: CoachMotivationAnimationProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        style={{
          backgroundColor: theme.colors.background.dark,
          border: `2px solid ${theme.colors.primary}`,
          boxShadow: theme.animations.glow,
        }}
      >
        <div className="p-6 rounded-lg text-center max-w-md">
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ 
              color: theme.colors.primary,
              fontFamily: theme.fonts.display,
              textShadow: theme.animations.glow
            }}
          >
            DRILL SERGEANT SAYS:
          </h2>
          <p 
            className="text-lg"
            style={{ 
              color: theme.colors.text.primary,
              fontFamily: theme.fonts.mono
            }}
          >
            {message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 