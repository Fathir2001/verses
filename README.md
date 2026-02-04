# I Am Feeling 🤲

An Islamic emotional and spiritual support website built with Next.js. Find comfort through Qur'anic verses, duas, and gentle reminders for every emotion.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-FF0055?style=flat-square&logo=framer)

## ✨ Features

- **12 Feelings** with Islamic spiritual guidance
- **Glassmorphism UI** - Modern iPhone-style design
- **Dark/Light/System Theme** - Toggle with ease
- **Copy to Clipboard** - Share verses and duas easily
- **Web Share API** - Native sharing on supported devices
- **Search** - Filter feelings by name or description
- **Fully Responsive** - Mobile-first, looks great on all devices
- **Smooth Animations** - Powered by Framer Motion
- **Accessibility** - Keyboard navigation, focus states, reduced motion support
- **SEO Optimized** - Meta tags for each feeling
- **Static Export** - No backend required, host anywhere

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. **Clone or navigate to the project:**

   ```bash
   cd verses
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

This generates a static export in the `out` folder that can be deployed to any static hosting service.

### Start Production Server

```bash
npm start
```

## 📁 Project Structure

```
verses/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Home (redirects to /feelings)
│   ├── globals.css         # Global styles + Tailwind
│   ├── not-found.tsx       # Global 404 page
│   └── feelings/
│       ├── layout.tsx      # Feelings section layout
│       ├── page.tsx        # Feelings list page
│       └── [slug]/
│           ├── page.tsx    # Feeling detail (static params)
│           ├── FeelingDetailClient.tsx
│           └── not-found.tsx
├── components/
│   ├── index.ts            # Component exports
│   ├── ThemeProvider.tsx   # next-themes wrapper
│   ├── ThemeToggle.tsx     # Theme switcher button
│   ├── Navbar.tsx          # Navigation bar
│   ├── GlassCard.tsx       # Reusable glass card
│   ├── FeelingCard.tsx     # Feeling preview card
│   ├── SectionBlock.tsx    # Content section wrapper
│   ├── CopyButton.tsx      # Copy to clipboard
│   ├── ShareButton.tsx     # Web Share API
│   ├── SearchBox.tsx       # Search input
│   ├── AnimatedBackground.tsx # Animated blobs
│   ├── PageTransition.tsx  # Page animations
│   └── NotFoundCard.tsx    # 404 card
├── data/
│   └── feelings.json       # All feelings data (12 entries)
├── lib/
│   ├── feelings.ts         # Data fetching utilities
│   └── utils.ts            # Helper functions
├── types/
│   └── feeling.ts          # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## 📝 Content Structure

Each feeling in `data/feelings.json` follows this schema:

```json
{
  "slug": "sad",
  "title": "Sad",
  "emoji": "😔",
  "preview": "Short preview text...",
  "reminder": "Gentle reminder paragraph...",
  "quran": {
    "text": "Verse text...",
    "reference": "Qur'an X:Y"
  },
  "dua": {
    "arabic": "Arabic text (optional)",
    "transliteration": "Transliteration...",
    "meaning": "English meaning...",
    "reference": "Hadith reference (optional)"
  },
  "actions": ["Action 1", "Action 2", "Action 3"]
}
```

## 🎨 Customization

### Adding New Feelings

1. Open `data/feelings.json`
2. Add a new feeling object following the schema above
3. The app will automatically include it

### Modifying Theme Colors

Edit `tailwind.config.ts` to customize the color palette:

```ts
colors: {
  emerald: { ... },
  teal: { ... },
}
```

### Adjusting Animations

Animations are controlled in individual components using Framer Motion. Look for `motion.` components and adjust:

- `initial` - Starting state
- `animate` - End state
- `transition` - Timing and easing

## 🌐 Deployment

The project is configured for static export. Deploy to:

- **Vercel** - Just push to GitHub and connect
- **Netlify** - Drag & drop the `out` folder
- **GitHub Pages** - Use the built files
- **Any static host** - Upload the `out` folder

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add more feelings
- Improve the content
- Enhance accessibility
- Fix bugs

## 📄 License

This project is open source and available for the benefit of the Ummah.

---

Made with 💚 for the Ummah
