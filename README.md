# SINHA'S STUDY HUB - GTU Resources Platform

A comprehensive study resource platform for GTU (Gujarat Technological University) students, built with React, TypeScript, and modern web technologies.

## Features

### 🎯 Enhanced Key Button Functionality
- **Interactive Year Cards**: All year cards on the home page are now fully functional with:
  - Click navigation to respective year pages
  - Hover effects with smooth animations
  - Statistics display (students, resources, subjects)
  - Visual feedback and transitions
  - Responsive design for all screen sizes

### 🔍 Search Functionality with OK Button
- **Navbar Search**: Added OK button to the main navigation search bar
  - Real-time search input with validation
  - Enter key support for quick search
  - Disabled state when search is empty
  - Mobile-responsive design
  - Direct navigation to Resources page with search query

- **Resources Page Search**: Enhanced search bar with OK button
  - Integrated with existing filter system
  - URL parameter support for deep linking
  - Keyboard navigation support

### 🎨 Interactive Elements
- **Hover Effects**: All interactive elements now have smooth hover animations
- **Click Handlers**: Proper navigation and state management
- **Visual Feedback**: Loading states, disabled states, and success indicators
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Interactive Features
- **Comment System**: Add comments and replies to resources with voting functionality
- **Community Discussions**: Create and participate in subject-specific discussions
- **Voting System**: Like/dislike comments and discussions with user-specific tracking
- **Favorites**: Save and manage favorite resources
- **User Profiles**: View activity history and achievements

### Voting System
The platform implements a robust voting system that ensures:
- **One Vote Per User**: Each user can only vote once per comment or discussion
- **Vote Toggle**: Users can remove their vote by clicking the same button again
- **Vote Change**: Users can change their vote from upvote to downvote (or vice versa)
- **Visual Feedback**: Current vote state is visually indicated with colored icons
- **Real-time Updates**: Vote counts update immediately across all components

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── layout/         # Layout components (Navbar, Footer)
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   └── ...             # Other pages
├── store/              # Zustand stores
├── utils/              # Utility functions
└── main.tsx           # Application entry point
```

## Key Features Implemented

### Search Functionality
- **Navbar Search**: Global search with OK button
- **Resources Search**: Advanced filtering and search
- **URL Integration**: Search queries persist in URL
- **Keyboard Support**: Enter key navigation

### Interactive Navigation
- **Year Cards**: Fully functional with statistics
- **Navigation Buttons**: Proper routing and state management
- **Mobile Menu**: Responsive navigation with search
- **Theme Toggle**: Dark/light mode switching

### User Experience
- **Loading States**: Visual feedback for user actions
- **Hover Effects**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support

## State Management

The application uses Zustand for state management with three main stores:

- **authStore**: Manages user authentication and profile data
- **resourceStore**: Handles resources, comments, favorites, and voting
- **themeStore**: Manages theme preferences and dark/light mode

## Voting Implementation

The voting system is implemented across multiple components:

1. **CommentSection**: For resource comments with nested replies
2. **Community**: For discussion posts and comments
3. **ResourceStore**: Centralized vote tracking and logic

Each vote is tracked with:
- User ID for identification
- Vote type (up/down/null)
- Timestamp for audit trails
- Real-time count updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 