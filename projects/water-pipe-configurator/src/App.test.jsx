import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// The 3D Spline scene needs a real WebGL context and network access to load
// its .splinecode file, neither of which are available in jsdom. Stub it out
// so tests exercise the configurator's own state logic instead.
vi.mock('@splinetool/react-spline', () => ({
  default: () => <div data-testid="spline-stub" />,
}));

describe('App', () => {
  it('renders the default configuration', () => {
    render(<App />);
    expect(screen.getByText('PVC • 1 inch • 90° Elbow')).toBeInTheDocument();
  });

  it('updates the spec line when a material is selected', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Copper'));
    expect(screen.getByText('Copper • 1 inch • 90° Elbow')).toBeInTheDocument();
  });

  it('updates the spec line when a diameter is selected', () => {
    render(<App />);
    fireEvent.click(screen.getByText('½ inch'));
    expect(screen.getByText('PVC • ½ inch • 90° Elbow')).toBeInTheDocument();
  });

  it('updates the spec line when a fitting is selected', () => {
    render(<App />);
    fireEvent.click(screen.getByText('T-Fitting'));
    expect(screen.getByText('PVC • 1 inch • T-Fitting')).toBeInTheDocument();
  });

  it('marks the selected material button as active and others as inactive', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Steel'));

    expect(screen.getByText('Steel').closest('button')).toHaveClass('active');
    expect(screen.getByText('PVC').closest('button')).not.toHaveClass('active');
  });

  it('only ever marks one option per category as active', () => {
    render(<App />);
    fireEvent.click(screen.getByText('HDPE'));
    fireEvent.click(screen.getByText('Copper'));

    expect(screen.getByText('Copper').closest('button')).toHaveClass('active');
    expect(screen.getByText('HDPE').closest('button')).not.toHaveClass('active');
  });

  it('keeps selections in other categories independent', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Steel'));
    fireEvent.click(screen.getByText('¾ inch'));

    expect(screen.getByText('Steel • ¾ inch • 90° Elbow')).toBeInTheDocument();
  });

  it('hides technical specifications by default', () => {
    render(<App />);
    expect(screen.queryByText('Technical Specs')).not.toBeInTheDocument();
    expect(screen.getByText('Show Specifications')).toBeInTheDocument();
  });

  it('reveals technical specifications on toggle click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Show Specifications'));

    expect(screen.getByText('Technical Specs')).toBeInTheDocument();
    expect(screen.getByText('Hide Specifications')).toBeInTheDocument();
  });

  it('hides technical specifications again on a second toggle click', () => {
    render(<App />);
    const toggle = screen.getByText('Show Specifications');

    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Hide Specifications'));

    expect(screen.queryByText('Technical Specs')).not.toBeInTheDocument();
    expect(screen.getByText('Show Specifications')).toBeInTheDocument();
  });

  it('reflects the current selection inside the technical specs panel', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Copper'));
    fireEvent.click(screen.getByText('Show Specifications'));

    expect(screen.getByText('Material:').parentElement).toHaveTextContent('Material: Copper');
  });

  it('renders the Add to Cart call to action', () => {
    render(<App />);
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });
});
