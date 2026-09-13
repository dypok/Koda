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
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false });

  const fullNameError = !form.fullName.trim()
    ? null
    : form.fullName.trim().length < 2
      ? 'Mínimo 2 caracteres.'
      : null;
  const emailError = !form.email.trim()
    ? null
    : !EMAIL_REGEX.test(form.email.trim())
      ? 'Ese correo no parece válido.'
      : null;
  const passwordError = !form.password
    ? null
    : form.password.length < 8
      ? 'Mínimo 8 caracteres.'
      : null;

  const isFullNameValid = form.fullName.trim().length >= 2;
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = form.password.length >= 8;

  /** Fuerza 0-4: longitud, longitud+, variedad, símbolo. */
  const passwordStrength =
    (form.password.length >= 8 ? 1 : 0) +
    (form.password.length >= 12 ? 1 : 0) +
    (/[A-Z]/.test(form.password) && /[a-z]/.test(form.password) && /\d/.test(form.password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0);

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

  const touch = useCallback((field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const submit = useCallback(async () => {
    setTouched({ fullName: true, email: true, password: true });
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
    errors: {
      fullName: touched.fullName ? fullNameError : null,
      email: touched.email ? emailError : null,
      password: touched.password ? passwordError : null,
    },
    passwordStrength,
    setFullName,
    setEmail,
    setPassword,
    toggleShowPassword,
    touch,
    submit,
  };
}
