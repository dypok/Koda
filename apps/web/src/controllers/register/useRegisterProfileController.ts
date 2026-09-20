'use client';

import { useState, useMemo, useCallback } from 'react';
import { RegisterProfileForm } from '@/models/register/register.model';
import { AuthService, RegisterOtpPayload } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterOnboardingData {
  initialLanguageSlug?: string;
  experienceLevel?: string;
  learningStyle?: string;
  dailyGoalId?: string;
  dailyGoalMinutes?: number;
}

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Estados específicos de verificación OTP
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [savedOnboarding, setSavedOnboarding] = useState<RegisterOnboardingData | undefined>();

  const fullNameError = !form.fullName.trim()
    ? null
    : form.fullName.trim().length < 2
      ? 'Mínimo 2 caracteres.'
      : null;
  const emailError = !form.email.trim()
    ? null
    : !EMAIL_REGEX.test(form.email.trim())
      ? 'Ese correo no parece válido.'
      : submitError || null;
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
    setSubmitError(null);
  }, []);

  const setEmail = useCallback((email: string) => {
    setForm((prev) => ({ ...prev, email }));
    setSubmitError(null);
  }, []);

  const setPassword = useCallback((password: string) => {
    setForm((prev) => ({ ...prev, password }));
    setSubmitError(null);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const touch = useCallback((field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  /**
   * Envía los datos de registro al backend NestJS (POST /api/v1/auth/register-otp)
   * e inicializa el flujo de verificación OTP.
   */
  const submit = useCallback(
    async (onboarding?: RegisterOnboardingData) => {
      setTouched({ fullName: true, email: true, password: true });
      if (!isFormValid || isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);
      setSavedOnboarding(onboarding);

      const payload: RegisterOtpPayload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        initialLanguageSlug: onboarding?.initialLanguageSlug || 'python',
        experienceLevel: onboarding?.experienceLevel || 'beginner',
        learningStyle: onboarding?.learningStyle || 'hands-on',
        dailyGoalId: onboarding?.dailyGoalId || 'regular',
        dailyGoalMinutes: onboarding?.dailyGoalMinutes || 10,
      };

      try {
        const result = await AuthService.registerWithOtp(payload);
        if (result.requiresOtp) {
          setIsOtpModalOpen(true);
        } else {
          setIsSuccess(true);
          onSuccess?.();
        }
      } catch (err: any) {
        setSubmitError(err.message || 'No fue posible registrar el estudiante.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, isFormValid, isSubmitting, onSuccess]
  );

  /**
   * Verifica el código OTP de 6 dígitos con el backend (POST /api/v1/auth/verify-otp).
   */
  const verifyOtp = useCallback(
    async (token: string) => {
      if (isVerifyingOtp) return;
      setIsVerifyingOtp(true);
      setOtpError(null);

      try {
        const result = await AuthService.verifyOtp({
          email: form.email.trim(),
          token,
          type: 'signup',
        });

        // Actualizar el estado global del usuario con la sesión y JWT emitidos por el backend
        useAuthStore.getState().setUserSession(result.session, result.accessToken, result.refreshToken);

        setIsOtpModalOpen(false);
        setIsSuccess(true);
        onSuccess?.();
      } catch (err: any) {
        setOtpError(err.message || 'Código OTP inválido o expirado.');
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [form.email, isVerifyingOtp, onSuccess]
  );

  /**
   * Reenvía un nuevo código OTP al correo del usuario.
   */
  const resendOtp = useCallback(async () => {
    if (isResendingOtp) return;
    setIsResendingOtp(true);
    setOtpError(null);

    try {
      await AuthService.registerWithOtp({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        initialLanguageSlug: savedOnboarding?.initialLanguageSlug || 'python',
        experienceLevel: savedOnboarding?.experienceLevel || 'beginner',
        learningStyle: savedOnboarding?.learningStyle || 'hands-on',
        dailyGoalId: savedOnboarding?.dailyGoalId || 'regular',
        dailyGoalMinutes: savedOnboarding?.dailyGoalMinutes || 10,
      });
    } catch (err: any) {
      setOtpError(err.message || 'Error al reenviar el código OTP.');
    } finally {
      setIsResendingOtp(false);
    }
  }, [form, savedOnboarding, isResendingOtp]);

  const closeOtpModal = useCallback(() => {
    setIsOtpModalOpen(false);
    setOtpError(null);
  }, []);

  return {
    form,
    showPassword,
    isSubmitting,
    isSuccess,
    isFormValid,
    submitError,
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

    // OTP
    isOtpModalOpen,
    isVerifyingOtp,
    isResendingOtp,
    otpError,
    verifyOtp,
    resendOtp,
    closeOtpModal,
  };
}

