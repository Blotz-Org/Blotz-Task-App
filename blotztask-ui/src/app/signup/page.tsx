'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '../signin/AuthForm.module.css'; // Import CSS styles
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { fetchWithErrorHandling } from '@/utils/http-client';
import { BadRequestError } from '@/model/error/bad-request-error';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertDestructive } from '@/components/ui/alert-destructive';

// Define Zod validation schema with custom email validation
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Define TypeScript type based on Zod schema
type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const router = useRouter(); // Initialize router

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const handleRegister = async (data: SignUpFormData) => {
    try {
      await fetchWithErrorHandling(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      submitSuccess();
    } catch (error) {
      submitFail(error);
    }
  };

  const submitFail = (error: unknown) => {
    if (error instanceof BadRequestError) {
      if (error.details) {
        // Map server-side errors to form fields
        Object.entries(error.details.errors).forEach(([field, messages]) => {
          setError(field as keyof SignUpFormData, {
            type: 'server',
            message: Array.isArray(messages) ? messages.join(', ') : messages,
          });
        });
      } else {
        setError('root', {
          type: 'server',
          message: error.message || 'An unexpected error occurred',
        });
      }
    } else {
      setError('root', {
        type: 'server',
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  const submitSuccess = () => {
    router.push('/signin');
    toast('Account registered', {
      description: 'You can now login with the registered account',
      duration: 3000,
      position: 'top-center',
    });
  };

  return (
    <div className="h-full justify-center flex flex-col items-center">
      <div className="flex flex-col gap-4 bg-white p-5 rounded-lg shadow-md w-4/12">
        <h1 className={styles.title}>User Sign Up</h1>
        {/* Global Error Prompt */}
        {errors?.root?.message && (
          <AlertDestructive
            title="Error"
            description={errors.root.message || 'An unexpected error occurred.'}
          />
        )}

        <form onSubmit={handleSubmit(handleRegister)}>
          <div className={styles.input_group}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              {...register('email')}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
            {/* Inline Error Message */}
            {!errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className={styles.input_group}>
            <label className={styles.label}>Password:</label>
            <input
              type="password"
              {...register('password')}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
            <div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
