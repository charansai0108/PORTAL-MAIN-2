import React, { useState } from 'react';

export default function SetuContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const { submitContactForm } = await import('../../../services/contact.js');
      const result = await submitContactForm({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        message: formData.message,
      });

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you! We will get back to you soon.',
        });
        setFormData({ name: '', company: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-form" className="setu-contact-form w-full">
      <h3 className="setu-script text-3xl font-bold mb-1">Let&apos;s collaborate</h3>
      <p className="text-sm text-neutral-600 mb-5">Tell us about your hiring or campus needs.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Company name (min. 2 characters)"
          className="setu-input"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={2}
        />
        <input
          type="tel"
          name="company"
          placeholder="Contact number (min. 10 digits)"
          className="setu-input"
          value={formData.company}
          onChange={handleChange}
          required
          minLength={10}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="setu-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your recruitment needs (min. 10 characters)"
          rows={4}
          className="setu-input resize-y min-h-[100px]"
          value={formData.message}
          onChange={handleChange}
          required
          minLength={10}
        />
        <button type="submit" disabled={isSubmitting} className="setu-btn-primary w-full">
          {isSubmitting ? 'Submitting...' : "Let's talk"}
        </button>
        {submitStatus.type && (
          <p
            className={`text-sm p-3 rounded-lg border-2 ${
              submitStatus.type === 'success'
                ? 'bg-[#fff4d6] border-[#ffb800] text-[#1a1a1a]'
                : 'bg-red-50 border-red-400 text-red-800'
            }`}
          >
            {submitStatus.message}
          </p>
        )}
      </form>
    </div>
  );
}
