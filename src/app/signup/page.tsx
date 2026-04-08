"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/common/ToastContainer';

// Create schema factory function to support translations with stronger password validation
const createSignupSchema = (t: (key: string, fallback: string) => string) => z.object({
  first_name: z.string().min(1, t('AuthSignup.firstNameRequired', 'First name is required')),
  last_name: z.string().min(1, t('AuthSignup.lastNameRequired', 'Last name is required')),
  email: z.string().email(t('AuthSignup.invalidEmail', 'Invalid email address')),
  phone: z.string().optional(),
  password: z.string()
    .min(8, t('AuthSignup.passwordMinLength', 'Password must be at least 8 characters'))
    .regex(/[a-z]/, t('AuthSignup.passwordLowercase', 'Password must contain at least one lowercase letter'))
    .regex(/[A-Z]/, t('AuthSignup.passwordUppercase', 'Password must contain at least one uppercase letter'))
    .regex(/[0-9]/, t('AuthSignup.passwordNumber', 'Password must contain at least one number')),
  confirm_password: z.string().min(1, t('AuthSignup.confirmPasswordRequired', 'Please confirm your password')),
}).refine((data) => data.password === data.confirm_password, {
  message: t('AuthSignup.passwordMismatch', "Passwords do not match"),
  path: ["confirm_password"],
});

export default function SignupPage() {
  const { t } = useHydratedTranslation();
  const { register } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  // Create schema with translations
  const signupSchema = createSignupSchema(t);
  type SignupFormData = z.infer<typeof signupSchema>;

  const [formData, setFormData] = useState<SignupFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      router.push('/');
    } catch (err) {
      // Try to parse backend field errors
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (typeof errorData === 'object') {
            const fieldErrors: Record<string, string> = {};
            Object.keys(errorData).forEach((key) => {
              const messages = errorData[key];
              if (Array.isArray(messages) && messages.length > 0) {
                let errorMessage = messages[0];

                // Translate common backend errors and show toast for duplicate errors
                if (errorMessage.includes('with this email already exists') ||
                    errorMessage.includes('Хэрэглэгч with this email already exists')) {
                  errorMessage = t('backendErrors.emailExists', 'User with this email already exists');
                  addToast({ type: 'error', title: errorMessage });
                } else if (errorMessage.includes('with this phone already exists') ||
                           errorMessage.includes('Хэрэглэгч with this phone already exists')) {
                  errorMessage = t('backendErrors.phoneExists', 'User with this phone already exists');
                  addToast({ type: 'error', title: errorMessage });
                }

                fieldErrors[key] = errorMessage;
              }
            });
            setErrors(fieldErrors);
            return;
          }
        } catch {
          // Not JSON, show general error
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: t('AuthSignup.registrationFailed', 'Registration failed') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            {t('AuthSignup.createAccount', 'Create Account')}
          </h2>
          <p className="text-sm text-gray-600 text-center">
            {t('AuthSignup.subtitle', 'Start your journey with us today')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('AuthSignup.firstNameLabel', 'First Name')}
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500 ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('AuthSignup.lastNameLabel', 'Last Name')}
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500 ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('AuthSignup.emailLabel', 'Email Address')}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('AuthSignup.emailPlaceholder', 'you@example.com')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('AuthSignup.phoneLabel', 'Phone Number')} <span className="text-gray-500">({t('AuthSignup.optional', 'Optional')})</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('AuthSignup.passwordLabel', 'Password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('AuthSignup.passwordPlaceholder', '••••••••')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('AuthSignup.confirmPasswordLabel', 'Confirm Password')}
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  autoComplete="new-password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500 ${
                    errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('AuthSignup.confirmPasswordPlaceholder', '••••••••')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 shadow-lg shadow-slate-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('AuthSignup.creatingAccount', 'Creating account...') : t('AuthSignup.signUpButton', 'Sign Up')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          {t('AuthSignup.haveAccount', 'Already have an account?')}{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            {t('AuthSignup.signIn', 'Sign in')}
          </Link>
        </p>
      </div>
    </div>
  );
}
