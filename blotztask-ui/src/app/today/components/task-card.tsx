import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

const TaskCard = ({ task, handleCheckboxChange }) => {
  return (
    <div key={task.id} className="w-full">
      <div className="flex flex-row space-x-4">
        <div className="flex flex-row justify-start items-center space-x-4">
          <Checkbox
            onCheckedChange={() => handleCheckboxChange(task.id)}
            className="h-8 w-8 rounded-md border-transparent bg-gray-400"
          />
        </div>

        <div className="flex justify-center items-center rounded-xl bg-monthly-stats-work-label mr-2 w-1/3 p-4">
          <p>{task.title}</p>
        </div>

        <div className="flex justify-center items-center rounded-xl bg-monthly-stats-work-label grow">
          <p>{task.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
