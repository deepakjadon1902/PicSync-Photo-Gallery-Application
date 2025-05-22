import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      
      toggleMode: () => 
        set((state) => {
          const newMode = state.mode === 'light' ? 'dark' : 'light';
          updateThemeClass(newMode);
          return { mode: newMode };
        }),
        
      setMode: (mode) => {
        updateThemeClass(mode);
        set({ mode });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Helper function to update HTML class
function updateThemeClass(mode: ThemeMode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Initialize theme on app load
export const initializeTheme = () => {
  const { mode } = useThemeStore.getState();
  updateThemeClass(mode);
};