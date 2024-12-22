'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AlertDestructive } from '@/components/ui/alert-destructive';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

type LoginFormField = z.infer<typeof loginFormSchema>

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(9)
})

const LoginPage = () => {

  const { 
    register, 
    handleSubmit, 
    setError,
    formState : { errors, isSubmitting }  
  } = useForm<LoginFormField>({
    resolver: zodResolver(loginFormSchema)
  });
  const router = useRouter(); // Get the router instance

  const onSubmit: SubmitHandler<LoginFormField> = async (formData) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email : formData.email,
        password : formData.password,
      });

      if (result?.error) {
        setError("root",{
          message: "Login Failed. Please check you credential"
        });
      } else {
        router.push('/today'); 
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError("root",{
        message: error
      });
    }
  }

  return (
    <div className="h-full justify-center flex flex-col items-center">
      <div className="flex flex-col gap-4 bg-white p-5 rounded-lg shadow-md w-4/12">
        <h1 className={styles.title}>User Login</h1>
        {errors.root && (
          <AlertDestructive 
            title="Error" 
            description={errors.root.message}
          />
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.input_group}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              {...register("email")}
              className={styles.input}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <div className="text-warn mb-3">{errors.email.message}</div>
          )}
          <div className={styles.input_group}>
            <label className={styles.label}>Password:</label>
              <input
                type="password"
                {...register("password")}              
                className={styles.input}
                placeholder="Enter your password"
              />
          </div>
          {errors.password && (
              <div className="text-warn mb-3">{errors.password.message}</div>
          )} 
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : 'Sign In'}
          </Button>
        </form>
        <p className={styles.registerPrompt}>
          Don’t have an account?
          <a href="/signup" className={styles.registerLink}>
            Register here
          </a>  
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
