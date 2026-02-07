import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatInterface from './components/ChatInterface';
import ProfileSetupModal from './components/ProfileSetupModal';
import WelcomeScreen from './components/WelcomeScreen';
import CalmModeDialog from './components/CalmModeDialog';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showChat = isAuthenticated && userProfile !== null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-calm-50 via-calm-100 to-calm-200 dark:from-calm-900 dark:via-calm-800 dark:to-calm-700">
        <Header />
        
        <main className="flex-1 flex flex-col">
          {!isAuthenticated && <WelcomeScreen />}
          {showProfileSetup && <ProfileSetupModal />}
          {showChat && <ChatInterface />}
        </main>

        <Footer />
        <CalmModeDialog />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
