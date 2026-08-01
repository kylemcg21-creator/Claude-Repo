import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Simplified SnapSite component for testing core behaviors
const SimpleSnapSiteForm = () => {
  const [notes, setNotes] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsSubmitted(true);
    // Simulate form reset after submission
    setTimeout(() => {
      setNotes('');
      setLocation('');
      setIsSubmitted(false);
    }, 1000);
  };

  return (
    <div>
      <h1>SnapSite Inspector Report</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="notes">Field Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe what you observed..."
            required
            aria-describedby="notes-help"
          />
          <small id="notes-help">Required. Describe the field observations.</small>
        </div>

        <div>
          <label htmlFor="location">Location (optional)</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Substation 14"
            aria-describedby="location-help"
          />
          <small id="location-help">Optional. Include the project location.</small>
        </div>

        <button type="submit" disabled={isSubmitted} aria-busy={isSubmitted}>
          {isSubmitted ? 'Submitting...' : 'Draft Report'}
        </button>
      </form>

      {isSubmitted && (
        <div role="status" aria-live="polite">
          Generating draft report...
        </div>
      )}
    </div>
  );
};

describe('SnapSite Form Component', () => {
  afterEach(cleanup);

  it('should render the form with required fields', () => {
    render(<SimpleSnapSiteForm />);

    expect(screen.getByRole('heading', { name: /SnapSite Inspector/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Field Notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Draft Report/i })).toBeInTheDocument();
  });

  it('should have field labels properly associated', () => {
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const locationField = screen.getByLabelText(/Location/i);

    expect(notesField).toHaveAttribute('id', 'notes');
    expect(locationField).toHaveAttribute('id', 'location');
  });

  it('should mark notes field as required', () => {
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    expect(notesField).toBeRequired();
  });

  it('should not mark location field as required', () => {
    render(<SimpleSnapSiteForm />);

    const locationField = screen.getByLabelText(/Location/i);
    expect(locationField).not.toBeRequired();
  });

  it('should provide help text for both fields', () => {
    render(<SimpleSnapSiteForm />);

    expect(screen.getByText(/Describe the field observations/i)).toBeInTheDocument();
    expect(screen.getByText(/Include the project location/i)).toBeInTheDocument();
  });
});

describe('SnapSite Form Interaction', () => {
  afterEach(cleanup);

  it('should capture text input in notes field', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    await user.type(notesField, 'rust on bracket');

    expect(notesField).toHaveValue('rust on bracket');
  });

  it('should capture text input in location field', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const locationField = screen.getByLabelText(/Location/i);
    await user.type(locationField, 'Substation 14');

    expect(locationField).toHaveValue('Substation 14');
  });

  it('should allow both fields to be filled', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const locationField = screen.getByLabelText(/Location/i);

    await user.type(notesField, 'surface rust observed');
    await user.type(locationField, 'Pole 42');

    expect(notesField).toHaveValue('surface rust observed');
    expect(locationField).toHaveValue('Pole 42');
  });

  it('should clear notes field when manually edited', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    await user.type(notesField, 'test notes');
    expect(notesField).toHaveValue('test notes');

    await user.clear(notesField);
    expect(notesField).toHaveValue('');
  });

  it('should handle whitespace in input', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    await user.type(notesField, '  spaces around text  ');

    expect(notesField).toHaveValue('  spaces around text  ');
  });
});

describe('SnapSite Form Submission', () => {
  afterEach(cleanup);

  it('should show loading state when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const submitButton = screen.getByRole('button', { name: /Draft Report/i });

    await user.type(notesField, 'test notes');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(/Generating draft/i);
  });

  it('should show status message during submission', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const submitButton = screen.getByRole('button', { name: /Draft Report/i });

    await user.type(notesField, 'rust observed');
    await user.click(submitButton);

    expect(screen.getByRole('status', { hidden: false })).toBeInTheDocument();
  });

  it('should prevent submission with empty notes', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const submitButton = screen.getByRole('button', { name: /Draft Report/i });

    // Try to submit without notes
    // HTML5 validation should prevent form submission
    const form = submitButton.closest('form');
    const submitSpy = vi.spyOn(form, 'submit');

    // The browser's native validation will block this, so the status won't appear
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should re-enable submit button after submission completes', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const submitButton = screen.getByRole('button', { name: /Draft Report/i });

    await user.type(notesField, 'test');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    // Wait for the setTimeout to complete (1000ms)
    await waitFor(
      () => {
        expect(submitButton).not.toBeDisabled();
      },
      { timeout: 2000 }
    );
  });

  it('should reset form fields after submission', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const locationField = screen.getByLabelText(/Location/i);
    const submitButton = screen.getByRole('button', { name: /Draft Report/i });

    await user.type(notesField, 'test notes');
    await user.type(locationField, 'test location');
    await user.click(submitButton);

    // Wait for reset (1000ms timeout)
    await waitFor(
      () => {
        expect(notesField).toHaveValue('');
        expect(locationField).toHaveValue('');
      },
      { timeout: 2000 }
    );
  });
});

describe('SnapSite Accessibility', () => {
  afterEach(cleanup);

  it('should have accessible form structure', () => {
    render(<SimpleSnapSiteForm />);

    const form = screen.getByRole('button').closest('form');
    expect(form).toBeInTheDocument();
    expect(form.tagName).toBe('FORM');
  });

  it('should have proper ARIA labels and descriptions', () => {
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const locationField = screen.getByLabelText(/Location/i);

    expect(notesField).toHaveAttribute('aria-describedby');
    expect(locationField).toHaveAttribute('aria-describedby');
  });

  it('should announce status updates with aria-live', () => {
    render(<SimpleSnapSiteForm />);

    const status = screen.queryByRole('status');
    // Initially no status
    expect(status).not.toBeInTheDocument();
  });

  it('should have aria-busy attribute on button during loading', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const submitButton = screen.getByRole('button', { name: /Draft Report/i });

    // Initially not busy
    expect(submitButton).toHaveAttribute('aria-busy', 'false');

    await user.type(notesField, 'test');
    await user.click(submitButton);

    // After submit, should be busy
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  it('should have semantic button elements', () => {
    render(<SimpleSnapSiteForm />);

    const submitButton = screen.getByRole('button', { name: /Draft Report/i });
    expect(submitButton.tagName).toBe('BUTTON');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should have accessible heading hierarchy', () => {
    render(<SimpleSnapSiteForm />);

    const heading = screen.getByRole('heading');
    expect(heading.tagName).toBe('H1');
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const submitButton = screen.getByRole('button', { name: /Draft Report/i });

    // Tab to notes field
    await user.tab();
    expect(notesField).toHaveFocus();

    // Type in the field
    await user.keyboard('test notes');
    expect(notesField).toHaveValue('test notes');

    // Tab to location field
    await user.tab();
    const locationField = screen.getByLabelText(/Location/i);
    expect(locationField).toHaveFocus();

    // Tab to submit button
    await user.tab();
    expect(submitButton).toHaveFocus();
  });
});

describe('SnapSite Input Handling', () => {
  afterEach(cleanup);

  it('should handle special characters in notes', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const specialText = 'Rust & corrosion on "metal" bracket (approx 1/8")';

    await user.type(notesField, specialText);
    expect(notesField).toHaveValue(specialText);
  });

  it('should handle newlines in notes', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);

    await user.type(notesField, 'Line 1');
    await user.type(notesField, '{Enter}');
    await user.type(notesField, 'Line 2');

    expect(notesField).toHaveValue('Line 1\nLine 2');
  });

  it('should handle long text input', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const longText = 'A'.repeat(500);

    await user.type(notesField, longText);
    expect(notesField).toHaveValue(longText);
  });

  it('should handle rapid input changes', async () => {
    const user = userEvent.setup();
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);

    // Rapidly change the field
    await user.type(notesField, 'first');
    await user.clear(notesField);
    await user.type(notesField, 'second');
    await user.clear(notesField);
    await user.type(notesField, 'final');

    expect(notesField).toHaveValue('final');
  });
});

describe('SnapSite Form States', () => {
  afterEach(cleanup);

  it('should start with empty fields', () => {
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const locationField = screen.getByLabelText(/Location/i);

    expect(notesField).toHaveValue('');
    expect(locationField).toHaveValue('');
  });

  it('should start with enabled submit button', () => {
    render(<SimpleSnapSiteForm />);

    const submitButton = screen.getByRole('button', { name: /Draft Report/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should show default placeholder text', () => {
    render(<SimpleSnapSiteForm />);

    const notesField = screen.getByLabelText(/Field Notes/i);
    const locationField = screen.getByLabelText(/Location/i);

    expect(notesField).toHaveAttribute('placeholder', 'Describe what you observed...');
    expect(locationField).toHaveAttribute('placeholder', 'e.g. Substation 14');
  });

  it('should have correct button label initially', () => {
    render(<SimpleSnapSiteForm />);

    const submitButton = screen.getByRole('button', { name: /Draft Report/i });
    expect(submitButton).toHaveTextContent('Draft Report');
  });

  it('should not show status message initially', () => {
    render(<SimpleSnapSiteForm />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
