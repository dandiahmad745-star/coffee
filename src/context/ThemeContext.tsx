'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import themesData from '@/data/themes.json';

type Theme = {
  name: string;
  description: string;
  colors: {
    [key: string]: string;
  };
};

type ThemeContextType = {
  themes: Theme[];
  theme: Theme;
  setTheme: (themeName: string) => void;
  isThemeDialogOpen: boolean;
  setIsThemeDialogOpen: (isOpen: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'coffe-learning-theme';
const DEFAULT_THEME_NAME = 'Latte Cream';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themes] = useState<Theme[]>(themesData.themes);
  const [theme, _setTheme] = useState<Theme>(() => {
    return themes.find(t => t.name === DEFAULT_THEME_NAME) || themes[0];
  });
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  
  useEffect(() => {
    try {
      const savedThemeName = localStorage.getItem(THEME_STORAGE_KEY);
      const savedTheme = themes.find(t => t.name === savedThemeName);
      if (savedTheme) {
        _setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme from localStorage", error);
    }
  }, [themes]);

  const applyTheme = useCallback((themeToApply: Theme) => {
    const root = document.documentElement;
    Object.entries(themeToApply.colors).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });
  }, []);
  
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = (themeName: string) => {
    const newTheme = themes.find(t => t.name === themeName);
    if (newTheme) {
      _setTheme(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme.name);
      } catch (error) {
        console.error("Failed to save theme to localStorage", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ themes, theme, setTheme, isThemeDialogOpen, setIsThemeDialogOpen }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
