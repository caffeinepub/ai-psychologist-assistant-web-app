import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Shield, Globe } from 'lucide-react';

export default function WelcomeScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-calm-400 to-calm-600 rounded-full mb-4">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-calm-900 dark:text-calm-50">
            Welcome to Your Safe Space
          </h1>
          <p className="text-lg text-calm-700 dark:text-calm-300 max-w-2xl mx-auto">
            A gentle, empathetic companion for emotional support. Share your thoughts in your preferred language, 
            and receive compassionate guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/80 dark:bg-calm-800/80 backdrop-blur-sm border-calm-200 dark:border-calm-700">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-calm-100 dark:bg-calm-700 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-calm-600 dark:text-calm-300" />
              </div>
              <h3 className="font-semibold text-calm-900 dark:text-calm-100">Empathetic Listening</h3>
              <p className="text-sm text-calm-600 dark:text-calm-400">
                Share what's on your mind. We're here to listen without judgment.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-calm-800/80 backdrop-blur-sm border-calm-200 dark:border-calm-700">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-calm-100 dark:bg-calm-700 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-calm-600 dark:text-calm-300" />
              </div>
              <h3 className="font-semibold text-calm-900 dark:text-calm-100">Multilingual Support</h3>
              <p className="text-sm text-calm-600 dark:text-calm-400">
                Communicate in Tamil, English, Telugu, Kannada, Hindi, Marathi, or Tanglish.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-calm-800/80 backdrop-blur-sm border-calm-200 dark:border-calm-700">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-calm-100 dark:bg-calm-700 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-calm-600 dark:text-calm-300" />
              </div>
              <h3 className="font-semibold text-calm-900 dark:text-calm-100">Safe & Private</h3>
              <p className="text-sm text-calm-600 dark:text-calm-400">
                Your conversations are private and secure. We prioritize your wellbeing.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            size="lg"
            className="bg-gradient-to-r from-calm-500 to-calm-600 hover:from-calm-600 hover:to-calm-700 text-white px-8 py-6 text-lg"
          >
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Begin Your Journey'}
          </Button>
          <p className="mt-4 text-sm text-calm-600 dark:text-calm-400">
            Login securely to start your conversation
          </p>
        </div>
      </div>
    </div>
  );
}
