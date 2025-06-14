import coachImage from '@/assets/coach-v1.png';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { theme } from '@/lib/theme';

export function CoachMotivationAnimation({ message }: { message: string }) {
  const navigate = useNavigate();

  const handleQuit = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="flex flex-col items-center gap-5 max-h-[39vh] w-full max-w-xl mx-auto animate-slide-up">
        <div className="relative w-32 h-32">
          <img 
            src={coachImage} 
            alt="Coach" 
            className="w-full h-full object-contain animate-coach-bounce" 
          />
          <div className="absolute inset-0 bg-[#00FF00] opacity-20 blur-xl animate-pulse" />
        </div>
        <div className="text-xl font-mono text-[#00FF00] text-center animate-pulse px-6">
          {message}
        </div>
        <Button
          onClick={handleQuit}
          className="font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.colors.background.dark,
            boxShadow: theme.animations.glow
          }}
        >
          I QUIT!
        </Button>
      </div>
    </div>
  );
} 