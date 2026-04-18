import { useState, useCallback } from 'react';
import { dataService } from '../services/dataService';
import type { ConsultationRequestPayload } from '../types';

export interface ConsultationSettings {
  page_title: string;
  page_description: string;
  fee_amount: number;
  fee_currency: string;
  payment_enabled: boolean;
  available_dates: string[];
  closed_dates: string[];
  working_days: string[];
  working_hours_start: string;
  working_hours_end: string;
  slot_interval: number;
  open_by_default: boolean;
  [key: string]: unknown; // Allow for other fields from WP
}

export interface ConsultationQuote {
  success: boolean;
  payment_enabled: boolean;
  fee_amount: number;
  fee_currency: string;
  message?: string;
}

export interface ConsultationSlot {
  time: string;
  available: boolean;
}

export interface ConsultationSlotsResponse {
  success: boolean;
  slots: ConsultationSlot[];
  message?: string;
}

export interface ConsultationPaymentAccessResponse {
  success: boolean;
  access_token: string;
  message?: string;
}

export interface ConsultationSubmitResponse {
  success: boolean;
  message: string;
}

export function useConsultation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<ConsultationSettings | null>(null);
  const [quote, setQuote] = useState<ConsultationQuote | null>(null);
  
  // Fetch consultation settings (title, description, fee, etc.)
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getConsultationSettings() as { success: boolean; settings: ConsultationSettings };
      if (data?.success) setSettings(data.settings);
      setLoading(false);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch consultation settings';
      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  // Fetch consultation fee/quote
  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getConsultationQuote() as ConsultationQuote;
      if (data?.success) setQuote(data);
      setLoading(false);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch consultation quote';
      setError(message);
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
      const result = await dataService.generateConsultationPaymentAccess(payment) as ConsultationPaymentAccessResponse;
      setLoading(false);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate payment access';
      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  // Submit consultation request
  const submitConsultation = useCallback(async (formData: ConsultationRequestPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await dataService.submitConsultationRequest(formData) as ConsultationSubmitResponse;
      setLoading(false);
      if (result?.success) {
        setSuccess(result.message || 'Consultation request submitted successfully');
      } else {
        setError(result?.message || 'Failed to submit consultation request');
      }
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit consultation request';
      setError(message);
      setLoading(false);
      return null;
    }
  }, []);

  // Fetch available slots for a date
  const fetchSlots = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dataService.getConsultationSlots(date) as ConsultationSlotsResponse;
      setLoading(false);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch available slots';
      setError(message);
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
    generatePaymentAccess,
    submitConsultation,
    setError,
    setSuccess
  };
}
