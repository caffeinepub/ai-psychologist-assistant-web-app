import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, LogIn, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/80 dark:bg-calm-900/80 backdrop-blur-md border-b border-calm-200 dark:border-calm-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-calm-400 to-calm-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-calm-900 dark:text-calm-50">
              Emotional Support Companion
            </h1>
            <p className="text-xs text-calm-600 dark:text-calm-400">
              A safe space for your thoughts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 bg-calm-300 dark:bg-calm-700">
                <AvatarFallback className="text-calm-900 dark:text-calm-100 text-sm">
                  {getInitials(userProfile.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-calm-900 dark:text-calm-100 hidden sm:inline">
                {userProfile.name}
              </span>
            </div>
          )}
          
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className={
              isAuthenticated
                ? 'border-calm-300 text-calm-700 hover:bg-calm-100 dark:border-calm-600 dark:text-calm-300 dark:hover:bg-calm-800'
                : 'bg-gradient-to-r from-calm-500 to-calm-600 hover:from-calm-600 hover:to-calm-700 text-white'
            }
          >
            {disabled ? (
              'Connecting...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
