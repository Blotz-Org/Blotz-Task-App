import { TaskDTO } from "@/app/today/schema/schema";
import { TaskItemDTO } from "@/model/task-Item-dto";
import { fetchWithAuth } from "@/utils/fetch-with-auth";

export const fetchAllTaskItems = async (): Promise<TaskItemDTO[]> => {
  const result = await fetchWithAuth<TaskItemDTO[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API}/Task/alltask`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return result;
};

export const fetchTaskItemsDueToday = async (): Promise<TaskDTO[]> => {
    //Converting today's date to ISO String format
    const date = new Date().toISOString().split('T')[0];

    const result = await fetchWithAuth<TaskDTO[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API}/Task/due-date/${date}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  
    return result;
  };

  export const completeTaskForToday = async (taskId : number): Promise<string> => {

    try {
      const result = await fetchWithAuth<string>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API}/Task/CompleteTask/${taskId}`,
      {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
      }
      );
    
      return result;
      
    } catch (error) {
      console.error("Error completing task:", error);
      return "Error completing task.";
    } 
    
  };
