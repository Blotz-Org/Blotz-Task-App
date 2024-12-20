import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import * as React from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { AddTaskForm } from '../page';

// Enum for task labels and their corresponding IDs
enum TaskLabel {
    WORK = 'work',
    PERSONAL = 'personal',
    ACADEMIC = 'academic',
    OTHERS = 'others',
}
  
enum TaskLabelId {
    WORK = 1,
    PERSONAL = 2,
    ACADEMIC = 3,
    OTHERS = 4,
}

// Map TaskLabel to TaskLabelId dynamically
const labelIdMap: Record<TaskLabel, TaskLabelId> = {
    [TaskLabel.WORK]: TaskLabelId.WORK,
    [TaskLabel.PERSONAL]: TaskLabelId.PERSONAL,
    [TaskLabel.ACADEMIC]: TaskLabelId.ACADEMIC,
    [TaskLabel.OTHERS]: TaskLabelId.OTHERS,
};

interface TaskTabsProps {
  register: UseFormRegister<AddTaskForm>;
  setValue: UseFormSetValue<AddTaskForm>;
  watch: UseFormWatch<AddTaskForm>;
  errors: FieldErrors<AddTaskForm>;
}

const TaskTabs: React.FC<TaskTabsProps> = ({ register, setValue, errors }) => {
  const [selectedTab, setSelectedTab] = React.useState<TaskLabel>(TaskLabel.WORK);

  React.useEffect(() => {
    setValue('labelId', labelIdMap[selectedTab]);
  }, [selectedTab, setValue]);

  return (
    <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as TaskLabel)} className="w-full">
      <TabsList className="grid w-full grid-cols-4 gap-2 px-2">
      {Object.values(TaskLabel).map((tab) => (
          <TabsTrigger
            key={tab}
            className={`${
              tab === TaskLabel.WORK
                ? 'bg-add-task-work-label-bg text-add-task-work-label-text'
                : tab === TaskLabel.PERSONAL
                ? 'bg-add-task-personal-label-bg text-add-task-personal-label-text'
                : tab === TaskLabel.ACADEMIC
                ? 'bg-add-task-academic-label-bg text-add-task-academic-label-text'
                : 'bg-add-task-others-label-bg text-add-task-others-label-text'
            }`}
            value={tab}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.values(TaskLabel).map((tab) => (
        <TabsContent key={tab} value={tab}>
          <div className="p-1">
            <Card>
              <CardContent
                className={`space-y-2 ${
                  tab === TaskLabel.WORK
                    ? 'bg-add-task-work-label-bg'
                    : tab === TaskLabel.PERSONAL
                    ? 'bg-add-task-personal-label-bg'
                    : tab === TaskLabel.ACADEMIC
                    ? 'bg-add-task-academic-label-bg'
                    : 'bg-add-task-others-label-bg'
                }`}
              >
                <Textarea
                  className={`text-primary-dark ${
                    tab === TaskLabel.WORK
                      ? 'bg-add-task-work-input-area-bg border-add-task-work-label-bg placeholder-add-task-work-label-text'
                      : tab === TaskLabel.PERSONAL
                      ? 'bg-add-task-personal-input-area-bg border-add-task-personal-label-bg placeholder-add-task-personal-label-text'
                      : tab === TaskLabel.ACADEMIC
                      ? 'bg-add-task-academic-input-area-bg border-add-task-academic-label-bg placeholder-add-task-academic-label-bg'
                      : 'bg-add-task-others-input-area-bg border-add-task-others-label-bg placeholder-add-task-others-label-text'
                  } placeholder:text-center placeholder:leading-[10rem]`}
                  rows={10}
                  placeholder="Type your message here."
                  {...register('description')}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      ))}
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}
    </Tabs>
  );
};

export default TaskTabs;
