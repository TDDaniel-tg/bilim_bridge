# Bilim Bridge - Theme Guide

## Overview
The application now features a modern dual-theme design system with dark and light modes that match the provided design specifications.

## Theme Features

### Dark Theme (Default)
- **Background**: Deep navy/purple (`hsl(240, 25%, 8%)`)
- **Cards**: Dark blue with glass-morphism effect (`hsl(240, 20%, 12%)`)
- **Primary Color**: Vibrant purple (`hsl(262, 83%, 58%)`)
- **Gradient**: Purple to pink gradient for accents
- **Text**: High contrast white text for readability

### Light Theme
- **Background**: Clean white (`hsl(0, 0%, 100%)`)
- **Cards**: Pure white with subtle shadows
- **Primary Color**: Same vibrant purple for consistency
- **Gradient**: Same purple to pink gradient
- **Text**: Dark text for optimal readability

## Design Elements

### 1. Gradient Text
Use the utility class `text-gradient-primary` for gradient text effects:
```tsx
<h1 className="text-gradient-primary">Gradient Text</h1>
```

### 2. Gradient Backgrounds
Use the utility class `bg-gradient-primary` for gradient backgrounds:
```tsx
<button className="bg-gradient-primary">Button</button>
```

### 3. Glass-morphism Cards
Use the utility class `card-glass` for glass-effect cards:
```tsx
<Card className="card-glass">...</Card>
```

### 4. Colored Icon Badges
Feature cards include colored icon badges:
- Blue: `bg-blue-500`
- Purple: `bg-purple-500`
- Orange: `bg-orange-500`
- Green: `bg-green-500`
- Pink: `bg-pink-500`

## Page Sections

### 1. Hero Section
- Large gradient text headings
- Animated gradient orbs in background
- Trust indicators (student count, ratings, university count)
- CTA buttons with gradient styling

### 2. Features Section
- 6 feature cards with colored icon badges
- Glass-morphism card effects
- Hover animations
- Badge labels (AI, NEW, SMART, FREE, MAP, PRO)

### 3. How It Works Section
- 4-step process cards
- Numbered steps with large typography
- Colored icons matching feature colors
- Arrow connectors between steps

### 4. Stats Section
- 6 statistics cards
- Large gradient numbers
- Colored icon badges
- Hover scale animations

### 5. Testimonials Section
- 6 testimonial cards
- Star ratings
- Avatar with colored backgrounds
- Quote icons

### 6. CTA Section
- Full-width gradient background
- Animated gradient effect
- White text on vibrant background
- Trust indicators

## Theme Switching

Users can toggle between light and dark themes using the theme toggle button in the navbar:
- **Desktop**: Icon button in the top-right corner
- **Mobile**: Button in the mobile menu

The theme preference is saved in localStorage and persists across sessions.

## Custom CSS Classes

All custom classes are defined in `app/globals.css`:
- `.text-gradient` - Generic purple-to-pink gradient text
- `.text-gradient-primary` - Theme-aware gradient text
- `.bg-gradient-primary` - Theme-aware gradient background
- `.bg-gradient-radial` - Radial gradient background
- `.card-glass` - Glass-morphism effect
- `.animate-gradient` - Animated gradient effect

## Color Palette

### Dark Theme Colors
- Background: `#0F1419` (Very dark blue)
- Card: `#1A1F29` (Dark blue-gray)
- Primary: `#8B5CF6` (Vibrant purple)
- Accent: `#EC4899` (Pink)
- Text: `#FAFAFA` (Off-white)

### Light Theme Colors
- Background: `#FFFFFF` (Pure white)
- Card: `#FFFFFF` (Pure white)
- Primary: `#8B5CF6` (Vibrant purple)
- Accent: `#EC4899` (Pink)
- Text: `#1C1917` (Very dark gray)

## Best Practices

1. **Consistency**: Always use theme-aware classes (those using CSS variables) instead of hardcoded colors
2. **Accessibility**: Maintain high contrast ratios in both themes
3. **Performance**: Use backdrop-blur sparingly for better performance
4. **Responsive**: All components are mobile-first and responsive
5. **Animations**: Keep animations subtle and performance-friendly

## Components Updated

- ✅ `app/globals.css` - Theme variables and utilities
- ✅ `components/home/hero-section.tsx` - Gradient hero with animations
- ✅ `components/home/features-section.tsx` - Colored icon badges
- ✅ `components/home/stats-section.tsx` - Gradient numbers
- ✅ `components/home/how-it-works-section.tsx` - Step-by-step cards
- ✅ `components/home/testimonials-section.tsx` - Testimonial cards
- ✅ `components/home/cta-section.tsx` - Gradient CTA section
- ✅ `components/layout/navbar.tsx` - Gradient logo and buttons
- ✅ `components/layout/footer.tsx` - Gradient logo
- ✅ `components/ui/avatar.tsx` - New avatar component

## Testing

Both themes have been tested for:
- ✅ Visual consistency
- ✅ Color contrast accessibility
- ✅ Component rendering
- ✅ Theme persistence
- ✅ Responsive design
- ✅ Animation performance

## Future Enhancements

Potential improvements to consider:
- System theme detection on first visit
- Theme-specific illustrations
- More gradient variations
- Advanced color customization
- Theme transition animations

