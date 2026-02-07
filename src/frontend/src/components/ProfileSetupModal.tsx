import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    saveProfile(
      { name: name.trim(), preferredLanguage: undefined },
      {
        onSuccess: () => {
          toast.success('Welcome! Your profile has been created.');
        },
        onError: (error) => {
          toast.error('Failed to save profile. Please try again.');
          console.error('Profile save error:', error);
        },
      }
    );
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-calm-800 border-calm-200 dark:border-calm-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-calm-900 dark:text-calm-50">Welcome!</DialogTitle>
          <DialogDescription className="text-calm-600 dark:text-calm-400">
            Before we begin, please tell us your name so we can personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-calm-900 dark:text-calm-100">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border-calm-300 dark:border-calm-600 focus:border-calm-500 dark:focus:border-calm-400"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-calm-500 to-calm-600 hover:from-calm-600 hover:to-calm-700 text-white"
          >
            {isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
