import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause } from 'lucide-react';
import { useCalmModeStore } from '../stores/calmModeStore';

export default function CalmModeDialog() {
  const { isOpen, setOpen } = useCalmModeStore();
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Move to next phase
        if (phase === 'inhale') {
          setPhase('hold');
          return 4;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 6;
        } else {
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, phase]);

  const handleToggle = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setPhase('inhale');
      setCountdown(4);
    } else {
      setIsBreathing(true);
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
    }
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-calm-50 to-calm-100 dark:from-calm-900 dark:to-calm-800 border-calm-200 dark:border-calm-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-calm-900 dark:text-calm-50">
            <Wind className="w-5 h-5 text-calm-600 dark:text-calm-400" />
            Calm Mode
          </DialogTitle>
          <DialogDescription className="text-calm-600 dark:text-calm-400">
            Take a moment to center yourself with this guided breathing exercise.
          </DialogDescription>
        </DialogHeader>

        <div className="py-8 flex flex-col items-center gap-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div
              className={`absolute w-32 h-32 rounded-full bg-gradient-to-br from-calm-400 to-calm-600 transition-all duration-[4000ms] ease-in-out ${
                isBreathing ? getCircleSize() : 'scale-100'
              }`}
            />
            <div className="relative z-10 text-center">
              <p className="text-2xl font-semibold text-white drop-shadow-lg">
                {countdown}
              </p>
              <p className="text-sm text-white/90 drop-shadow-lg mt-1">
                {isBreathing ? getPhaseText() : 'Ready'}
              </p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-calm-700 dark:text-calm-300 font-medium">
              {isBreathing ? 'Follow the circle' : 'Press play to begin'}
            </p>
            <p className="text-xs text-calm-600 dark:text-calm-400">
              4 seconds in • 4 seconds hold • 6 seconds out
            </p>
          </div>

          <Button
            onClick={handleToggle}
            size="lg"
            className="bg-gradient-to-r from-calm-500 to-calm-600 hover:from-calm-600 hover:to-calm-700 text-white"
          >
            {isBreathing ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
