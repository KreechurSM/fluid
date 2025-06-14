# Fluid – Generative Flow Grid

This project is a generative art playground built with Nuxt 3, featuring a dynamic grid of animated dots that flow and interact using Perlin noise and user-controlled parameters. The site allows you to explore, tweak, and export beautiful flowing patterns as PNG or SVG.

## What is this website?

**Fluid** is an interactive generative art tool. It visualizes a grid of dots whose positions and sizes are animated using Perlin noise, creating organic, fluid motion. You can customize the look and behavior of the grid in real time using the settings panels, and export your creations as images.

---

## Settings Overview

### Matrix Settings (Left Panel)

- **Grid Proportion**  
  Controls the number of rows and columns in the grid. Higher values create a denser grid.

- **Size**  
  Adjusts the overall size of the grid relative to the canvas.

- **Color Mode**  
  Choose between a gradient (vertical color blend) or a solid color for all dots.

- **Dot Color**  
  (Visible when Color Mode is "Solid") – Pick a single color for all dots.

- **Gradient Start / End**  
  (Visible when Color Mode is "Gradient") – Select the start and end colors for the vertical gradient applied to the dots.

---

### Noise Settings (Right Panel)

- **Dot Min / Dot Max**  
  Set the minimum and maximum size for each dot. The actual size animates based on how much each dot is displaced.

- **Amplitude**  
  Controls how far dots can move from their base position (the strength of the noise effect).

- **Waves**  
  Adjusts the frequency of the Perlin noise, affecting the "waviness" of the flow.

- **Frequency**  
  Controls the speed of the animation (how quickly the noise evolves over time).

- **Max Displacement**  
  Sets the maximum distance a dot can move from its original grid position.

#### Repel Settings

- **Enable Repel**  
  When enabled, moving your mouse over the canvas will push nearby dots away, creating interactive ripples.

- **Repel Radius**  
  The area around the mouse that affects the dots.

- **Repel Strength**  
  How strongly dots are pushed away from the mouse.

---

## Export

- **PNG / SVG**  
  Use the buttons in the header to export your current artwork as a PNG or SVG image.

---

## Getting Started

Follow the steps below to install dependencies, run the development server, and build for production.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
