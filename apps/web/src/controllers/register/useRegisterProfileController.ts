'use client';

import { useState, useMemo, useCallback } from 'react';
import { RegisterProfileForm } from '@/models/register/register.model';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useRegisterProfileController(onSuccess?: () => void) {
  const [form, setForm] = useState<RegisterProfileForm>({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isFullNameValid = form.fullName.trim().length >= 2;
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = form.password.length >= 8;

  const isFormValid = useMemo(
    () => isFullNameValid && isEmailValid && isPasswordValid,
    [isFullNameValid, isEmailValid, isPasswordValid]
  );

  const setFullName = useCallback((fullName: string) => {
    setForm((prev) => ({ ...prev, fullName }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setForm((prev) => ({ ...prev, email }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setForm((prev) => ({ ...prev, password }));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const submit = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    // Simular registro seguro de estudiante
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
    onSuccess?.();
  }, [isFormValid, isSubmitting, onSuccess]);

  return {
    form,
    showPassword,
    isSubmitting,
    isSuccess,
    isFormValid,
    setFullName,
    setEmail,
    setPassword,
    toggleShowPassword,
    submit,
  };
}
