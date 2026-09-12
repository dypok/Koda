import { useState, useMemo, useCallback } from 'react';
import { RegisterProfileForm } from '@/models/register/register.model';
import { RegisterRequestDto, ExperienceLevel, LearningStyle, DailyGoalId } from '@koda/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegistrationContextData {
  selectedLanguageId?: string | null;
  selectedExperienceId?: string | null;
  selectedStyleId?: string | null;
  selectedGoalId?: string | null;
}

export function useRegisterProfileController(
  onSuccess?: (payload: RegisterRequestDto) => void,
  contextData?: RegistrationContextData
) {
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

    const payload: RegisterRequestDto = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      selectedLanguageId: contextData?.selectedLanguageId || 'python',
      selectedExperienceId: (contextData?.selectedExperienceId || 'beginner') as ExperienceLevel,
      selectedStyleId: (contextData?.selectedStyleId || 'hands-on') as LearningStyle,
      selectedGoalId: (contextData?.selectedGoalId || 'regular') as DailyGoalId,
    };

    // Simular registro seguro de estudiante con payload completo de onboarding
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
    onSuccess?.(payload);
  }, [isFormValid, isSubmitting, onSuccess, form, contextData]);

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
