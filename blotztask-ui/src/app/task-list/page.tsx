'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash } from 'lucide-react';
import { DeleteDialog } from './components/delete-confirmation-dialog';
import { H1 } from '@/components/ui/heading-with-anchor';

import { TaskCard } from './components/task-card';
import { fetchAllTaskItems } from '@/services/taskService';
import { TaskItemDTO } from '@/model/task-Item-dto';

export default function Page() {
  const [taskList, setTaskList] = useState<TaskItemDTO[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const loadTasks = async () => {
    const data = await fetchAllTaskItems();
    setTaskList(data);
  };

  const [isDeleteTriggered, setIsDeleteTriggered] = useState(false);

  /**
   * Fetch the tasks once and set the hook on the first rendering
   */
  useEffect(() => {
    loadTasks();
  }, []); // Runs on the first render using [] parameter and rerun when state changes, e.g add task

  const toggleDeleteTrigger = () => {
    setIsDeleteTriggered((prev) => !prev); 
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setIsDeleteTriggered(false);
  };

  return (
      <div className="flex flex-col items-end mt-5">

        <div className="flex w-full justify-between">
          <H1>All Task</H1>
          <div className="flex items-center gap-3">
            <Link href="/add-task">
              <Button className="bg-all-task-add-button-bg text-all-task-add-button-text border-2 border-all-task-add-button-border">
                <span className="">+ </span>Add Task
              </Button>
            </Link>

            {!isDeleteTriggered ? (
              <Button
                variant="outline"
                className="bg-all-task-delete-button-bg text-white border-2"
                onClick={toggleDeleteTrigger}
              >
                <Trash />
              </Button>
            ) : (
              <Button
                className="bg-all-task-delete-button-bg text-white border-2"
                onClick={() => setDialogOpen(true)}
              >
                Delete Task
              </Button>
            )}
          </div>
        </div>

        <DeleteDialog isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} onClose={handleDialogClose}/>
        <TaskCard tasks={taskList} />

      </div>
    );
}
