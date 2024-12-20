'use client';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { DatePicker } from './component/calendar';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TaskTabs from './component/task-tabs';

export type AddTaskForm = z.infer<typeof AddTaskFormSchema>

const AddTaskFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.date(),
  labelId: z.number()
})

export default function Home() {

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddTaskForm>({
    resolver: zodResolver(AddTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      labelId: 1,
    },
  });

  const onSubmit = (data: AddTaskForm) => {
    console.log('Form Submitted:', data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 mx-24">
        <Input
          className="bg-add-task-title-bg text-center text-add-task-title-text placeholder-add-task-title-placeholder"
          placeholder="Write Your Title Here"
          {...register('title')}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <TaskTabs
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />

      {/* Date Picker (Controlled via react-hook-form) */}
      <div className="flex justify-between items-center w-full">
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value} // Controlled value
              onChange={(date) => field.onChange(date)} // Update form state
              error={errors.dueDate?.message} // Show error message
            />
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </Button>
        </div>
      </form>
    </>
  );
}
