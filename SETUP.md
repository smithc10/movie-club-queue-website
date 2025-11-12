# Movie Club Queue - Frontend Setup

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **SCSS** for styling
- **Tailwind CSS** for utility-first CSS
- **shadcn/ui** for beautiful, accessible UI components
- **TMDB API** for movie data

## TMDB API Setup

This application uses The Movie Database (TMDB) API to fetch movie data.

### Getting Your API Key

1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Create a free account or sign in
3. Go to your account settings > API
4. Request an API key (choose "Developer" if asked)
5. Copy your API key

### Configuration

1. Create a `.env` file in the root of the `film-club-queue` directory:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace `your_api_key_here` with your actual TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

3. Save the file

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- Browse popular movies
- Search for movies by title
- Display movie cards with:
  - Poster image
  - Title
  - Release year
  - Rating
  - Overview/description
- Built with shadcn/ui components for consistent, accessible UI
- SCSS for maintainable styling
- Tailwind CSS utilities for rapid development

## Adding More shadcn/ui Components

This project is configured to use shadcn/ui. You can add more components by creating them in `src/components/ui/`. Available components include:
- Button ✅
- Input ✅
- Card ✅
- Dialog
- Select
- Tabs
- And many more!

Visit [ui.shadcn.com](https://ui.shadcn.com) for the full component library.

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── MovieCard.tsx    # Custom movie card component
│   └── MovieCard.scss   # Component-specific styles
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
├── services/
│   └── tmdb.ts          # TMDB API service
├── types/
│   └── movie.ts         # TypeScript types
├── App.tsx              # Main app component
├── App.scss             # App styles
├── index.scss           # Global styles with Tailwind
└── main.tsx             # App entry point
```

## Future Enhancements

- Connect to AWS backend
- User authentication
- Movie queue management
- Voting system for movie club
