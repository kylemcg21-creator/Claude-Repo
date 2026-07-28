import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import './App.css';

const pipeOptions = {
  material: [
    { id: 'pvc', label: 'PVC', color: '#E8E8E8' },
    { id: 'copper', label: 'Copper', color: '#B87333' },
    { id: 'steel', label: 'Steel', color: '#A8A9AD' },
    { id: 'hdpe', label: 'HDPE', color: '#2E5090' }
  ],
  diameter: [
    { id: '0.5in', label: '½ inch', size: 0.5 },
    { id: '0.75in', label: '¾ inch', size: 0.75 },
    { id: '1in', label: '1 inch', size: 1 },
    { id: '1.5in', label: '1.5 inch', size: 1.5 }
  ],
  fitting: [
    { id: 'straight', label: 'Straight Coupling', angle: 0 },
    { id: 'elbow90', label: '90° Elbow', angle: 90 },
    { id: 'elbow45', label: '45° Elbow', angle: 45 },
    { id: 'tee', label: 'T-Fitting', angle: 180 }
  ]
};

export default function App() {
  const [config, setConfig] = useState({
    material: 'pvc',
    diameter: '1in',
    fitting: 'elbow90'
  });

  const [showSpecs, setShowSpecs] = useState(false);

  const handleChange = (category, value) => {
    setConfig(prev => ({ ...prev, [category]: value }));
  };

  const selectedMaterial = pipeOptions.material.find(m => m.id === config.material);
  const selectedDiameter = pipeOptions.diameter.find(d => d.id === config.diameter);
  const selectedFitting = pipeOptions.fitting.find(f => f.id === config.fitting);

  return (
    <div className="configurator">
      <header className="header">
        <h1>Water Main Pipe Configurator</h1>
        <p>Design your custom piping system</p>
      </header>

      <div className="container">
        <div className="scene-container">
          <Spline
            scene="https://prod.spline.design/placeholder/scene.splinecode"
            fallback={<div className="fallback">Loading 3D Scene...</div>}
          />
          <div className="info-overlay">
            <h2>Current Configuration</h2>
            <div className="spec-line">
              {selectedMaterial?.label} • {selectedDiameter?.label} • {selectedFitting?.label}
            </div>
          </div>
        </div>

        <aside className="controls">
          <div className="control-section">
            <h3>Material</h3>
            <div className="option-group">
              {pipeOptions.material.map(option => (
                <button
                  key={option.id}
                  className={`option ${config.material === option.id ? 'active' : ''}`}
                  onClick={() => handleChange('material', option.id)}
                  style={{ borderColor: option.color }}
                >
                  <span className="color-swatch" style={{ backgroundColor: option.color }}></span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>Diameter</h3>
            <div className="option-group">
              {pipeOptions.diameter.map(option => (
                <button
                  key={option.id}
                  className={`option ${config.diameter === option.id ? 'active' : ''}`}
                  onClick={() => handleChange('diameter', option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-section">
            <h3>Fitting Type</h3>
            <div className="option-group">
              {pipeOptions.fitting.map(option => (
                <button
                  key={option.id}
                  className={`option ${config.fitting === option.id ? 'active' : ''}`}
                  onClick={() => handleChange('fitting', option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="specs-toggle"
            onClick={() => setShowSpecs(!showSpecs)}
          >
            {showSpecs ? 'Hide' : 'Show'} Specifications
          </button>

          {showSpecs && (
            <div className="specifications">
              <h3>Technical Specs</h3>
              <ul>
                <li><strong>Material:</strong> {selectedMaterial?.label}</li>
                <li><strong>Diameter:</strong> {selectedDiameter?.label}</li>
                <li><strong>Fitting:</strong> {selectedFitting?.label}</li>
                <li><strong>Pressure Rating:</strong> 200 PSI</li>
                <li><strong>Temperature Range:</strong> -20°C to 80°C</li>
                <li><strong>Approvals:</strong> NSF/ANSI 61</li>
              </ul>
            </div>
          )}

          <button className="cta-button">Add to Cart</button>
        </aside>
      </div>
    </div>
  );
}
