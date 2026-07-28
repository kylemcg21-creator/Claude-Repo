# Water Main Pipe Configurator

An interactive 3D product configurator for water main pipes and fittings built with React and Spline.

## Features

- **3D Visualization**: Interactive 3D product visualization using Spline
- **Material Selection**: Choose from PVC, Copper, Steel, and HDPE
- **Diameter Options**: Select pipe sizes from ½" to 1.5"
- **Fitting Types**: Configure different fitting options (straight, 90°/45° elbows, T-fittings)
- **Real-time Updates**: See configuration changes instantly
- **Technical Specs**: View pressure ratings, temperature ranges, and approvals
- **Responsive Design**: Works on desktop and mobile devices
- **Add to Cart**: Ready for e-commerce integration

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd projects/water-pipe-configurator
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

## Customization

### Adding a Spline Scene

1. Create a free account at [spline.design](https://spline.design)
2. Design your 3D pipe model
3. Export and get the scene URL
4. Update the Spline URL in `src/App.jsx`:

```jsx
<Spline scene="YOUR_SPLINE_SCENE_URL" />
```

### Extending Configuration Options

Edit the `pipeOptions` object in `src/App.jsx` to add:
- New materials with custom colors
- Additional pipe diameters
- More fitting types

### Connecting to E-commerce

The "Add to Cart" button can be connected to your store:

```jsx
const handleAddToCart = () => {
  const product = {
    material: config.material,
    diameter: config.diameter,
    fitting: config.fitting,
    // Add to your cart API
  };
  // Call your cart endpoint
};
```

## Performance

### Desktop
- Target: 60 FPS
- Max triangles: 500K
- Optimized for high-end GPUs

### Mobile
- Target: 30-60 FPS
- Max triangles: 100K
- Lower DPR for battery efficiency

### Optimization Tips

1. **Model Size**: Keep Spline scene under 5MB
2. **Textures**: Use WebP format where possible
3. **Loading**: Implement progress indicators
4. **Fallback**: Provide static image fallback for WebGL-unsupported devices

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE 11: Falls back to static image

## Technology Stack

- **Frontend**: React 18
- **3D Visualization**: Spline (via @splinetool/react-spline)
- **Build Tool**: Vite
- **Styling**: CSS Grid & Flexbox
- **Deployment**: Vercel (optional)

## License

MIT
