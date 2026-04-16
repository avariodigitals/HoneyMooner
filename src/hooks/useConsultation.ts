import { useState } from 'react';
import { dataService } from '../services/dataService';

export function useConsultation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch consultation settings (title, description, fee, etc.)
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = await dataService.getConsultationSettings();
      setLoading(false);
      return settings;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consultation settings');
      setLoading(false);
      return null;
    }
  };

  // Fetch consultation fee/quote
  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const quote = await dataService.getConsultationQuote();
      setLoading(false);
      return quote;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consultation quote');
      setLoading(false);
      return null;
    }
  };

  // Validate coupon code
  const validateCoupon = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.validateConsultationCoupon(code);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to validate coupon');
      setLoading(false);
      return null;
    }
  };

  // Generate access token after payment
  const generatePaymentAccess = async (payment: {
    payment_provider: string;
    payment_reference: string;
    payment_amount: number;
    payment_currency: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.generateConsultationPaymentAccess(payment);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate payment access');
      setLoading(false);
      return null;
    }
  };

  // Submit consultation request
  const submitConsultation = async (formData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await dataService.submitConsultationRequest(formData);
      setLoading(false);
      if (result?.success) {
        setSuccess(result.message || 'Consultation request submitted successfully');
      } else {
        setError(result?.message || 'Failed to submit consultation request');
      }
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to submit consultation request');
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    error,
    success,
    fetchSettings,
    fetchQuote,
    validateCoupon,
    generatePaymentAccess,
    submitConsultation,
    setError,
    setSuccess
  };
}
