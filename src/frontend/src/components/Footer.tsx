import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/60 dark:bg-calm-900/60 backdrop-blur-sm border-t border-calm-200 dark:border-calm-700 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3">
          <p className="text-sm text-calm-600 dark:text-calm-400">
            <strong className="font-semibold">Disclaimer:</strong> This is emotional support, not medical advice. 
            If you're experiencing a crisis, please contact a mental health professional or emergency services.
          </p>
          <p className="text-xs text-calm-500 dark:text-calm-500 flex items-center justify-center gap-1">
            © 2025. Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-calm-600 dark:text-calm-400 hover:text-calm-800 dark:hover:text-calm-200 underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
