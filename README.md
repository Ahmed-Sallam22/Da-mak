# Tickety - Support Ticket Management System

A modern, responsive support ticket management system built with React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, and i18next.

## 🚀 Features

- ✅ **React 19** with TypeScript
- ✅ **Vite** for fast development and builds
- ✅ **Tailwind CSS 4** for styling with custom theme
- ✅ **Redux Toolkit** for state management
- ✅ **i18next** for internationalization (English & Arabic)
- ✅ **Fully Responsive** design for all screen sizes
- ✅ **Reusable Components** (Button, Input)
- ✅ **Custom Hooks** (usePageTitle)
- ✅ **Senior-Level Project Structure**

## 🎨 Color Palette

```css
Primary: #0052FF
Dark: #0E121B
Gray: #717784
Label: #181B25
Placeholder: #99A0AE
```

## 📁 Project Structure

```
src/
├── assets/
│   └── icons/              # Reusable icon components
│       ├── EyeIcon.tsx
│       ├── EyeSlashIcon.tsx
│       └── index.ts
├── components/
│   ├── shared/             # Reusable shared components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.types.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── layout/             # Layout components
├── config/
│   └── i18n.ts             # i18next configuration
├── constants/
│   └── index.ts            # App constants
├── hooks/
│   ├── usePageTitle.ts     # Custom hook for page titles
│   └── index.ts
├── locales/
│   ├── en/
│   │   └── translation.json
│   └── ar/
│       └── translation.json
├── pages/
│   ├── Login/
│   │   ├── LoginPage.tsx
│   │   └── index.ts
│   └── index.ts
├── services/               # API services
├── store/
│   ├── slices/
│   │   └── authSlice.ts    # Authentication slice
│   ├── hooks.ts            # Typed Redux hooks
│   └── index.ts            # Store configuration
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── App.tsx
├── main.tsx
└── index.css               # Tailwind CSS imports
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

### Core
- `react` & `react-dom` (v19.2.0)
- `typescript` (v5.9.3)
- `vite` (v7.2.4)

### State Management
- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux

### Styling
- `tailwindcss` - Utility-first CSS framework
- `@tailwindcss/vite` - Tailwind CSS Vite plugin

### Internationalization
- `i18next` - Internationalization framework
- `react-i18next` - React bindings for i18next

### Routing
- `react-router-dom` - Client-side routing

## 🎯 Usage

### Button Component

```tsx
import { Button } from '@/components/shared';

<Button 
  title="Click Me"
  variant="primary" // primary | secondary | outline
  size="md" // sm | md | lg
  fullWidth={true}
  isLoading={false}
/>
```

### Input Component

```tsx
import { Input } from '@/components/shared';

<Input 
  label="Username"
  type="text"
  placeholder="Enter username"
  value={value}
  onChange={(value) => setValue(value)}
  icon={<SomeIcon />}
  onIconClick={() => {}}
  error="Error message"
/>
```

### usePageTitle Hook

```tsx
import { usePageTitle } from '@/hooks';

function MyPage() {
  usePageTitle('My Page Title - Tickety');
  // ...
}
```

## 🌍 Internationalization

Switch between English and Arabic:

```tsx
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Use translations
t('login.title')

// Change language
i18n.changeLanguage('ar'); // or 'en'
```

## 🔧 Redux Store

```tsx
// Use typed hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// In component
const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);

// Dispatch actions
dispatch(loginSuccess({ username: 'John' }));
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

## 🎨 Customizing Tailwind Theme

Colors are defined in `src/index.css`:

```css
@theme {
  --color-primary: #0052FF;
  --color-dark: #0E121B;
  --color-gray: #717784;
  --color-label: #181B25;
  --color-placeholder: #99A0AE;
}
```

Use in components:
```tsx
<div className="bg-primary text-dark border-gray">
```

## 📄 License

MIT

## 👨‍💻 Author

Tickety Team
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
