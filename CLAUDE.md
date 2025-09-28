# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Run development server with Turbopack at http://localhost:3000
npm run build        # Build production bundle
npm start            # Run production server
npm run lint         # Run Next.js linter
```

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS v4.

### Technology Stack
- **Framework**: Next.js 15.2.2 with React 19
- **Styling**: Tailwind CSS v4 with PostCSS
- **Font**: Poppins from Google Fonts
- **Icons**: lucide-react

### Application Structure
The application is a single-page website for a psychologist with the following component structure:
- `app/page.tsx` - Main page assembling all components
- `app/layout.tsx` - Root layout with Poppins font configuration
- `app/components/` - All UI components:
  - `Header.tsx` - Navigation header
  - `Hero.tsx` - Landing section
  - `About.tsx` - About section
  - `Services.tsx` - Services offered
  - `Packages.tsx` - Pricing packages
  - `Contact.tsx` - Contact information
  - `Footer.tsx` - Site footer

### Path Aliases
The project uses `@/*` alias for imports, which maps to the root directory.