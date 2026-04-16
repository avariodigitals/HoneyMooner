import { useState, useCallback } from 'react';
import { dataService } from '../services/dataService';

export function useConsultation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  
  // Fetch consultation settings (title, description, fee, etc.)
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getConsultationSettings();
      if (data?.success) setSettings(data.settings);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consultation settings');
      setLoading(false);
      return null;
    }
  }, []);

  // Fetch consultation fee/quote
  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getConsultationQuote();
      if (data?.success) setQuote(data);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consultation quote');
      setLoading(false);
      return null;
    }
  }, []);

  // Validate coupon code
  const validateCoupon = useCallback(async (code: string) => {
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
  }, []);

  // Generate access token after payment
  const generatePaymentAccess = useCallback(async (payment: {
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
  }, []);

  // Submit consultation request
  const submitConsultation = useCallback(async (formData: any) => {
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
  }, []);

  // Fetch available slots for a date
  const fetchSlots = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.getConsultationSlots(date);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch available slots');
      setLoading(false);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    success,
    settings,
    quote,
    fetchSettings,
    fetchQuote,
    fetchSlots,
    validateCoupon,
    generatePaymentAccess,
    submitConsultation,
    setError,
    setSuccess
  };
}
