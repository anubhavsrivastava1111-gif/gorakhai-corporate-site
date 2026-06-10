import { useState } from 'react';
import { submitForm } from '@/lib/supabaseClient';

export function useFormSubmit(tableName) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (data) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitForm(tableName, {
        ...data,
        created_at: new Date().toISOString()
      });
      setStatus('success');
      return true;
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      return false;
    }
  };

  const reset = () => {
    setStatus('idle');
    setErrorMsg('');
  };

  return { submit, status, errorMsg, reset, isLoading: status === 'loading', isSuccess: status === 'success' };
}
