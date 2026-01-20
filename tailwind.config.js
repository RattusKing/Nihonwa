/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // JLPT Level Colors
        'n5': {
          DEFAULT: '#10B981', // Green - Beginner
          light: '#34D399',
          dark: '#059669',
        },
        'n4': {
          DEFAULT: '#3B82F6', // Blue - Elementary
          light: '#60A5FA',
          dark: '#2563EB',
        },
        'n3': {
          DEFAULT: '#EAB308', // Yellow - Intermediate
          light: '#FDE047',
          dark: '#CA8A04',
        },
        'n2': {
          DEFAULT: '#F97316', // Orange - Advanced
          light: '#FB923C',
          dark: '#EA580C',
        },
        'n1': {
          DEFAULT: '#EF4444', // Red - Native Level
          light: '#F87171',
          dark: '#DC2626',
        },
      },
    },
  },
  plugins: [],
}
