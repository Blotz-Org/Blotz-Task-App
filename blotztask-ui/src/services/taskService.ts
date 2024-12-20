import { TaskDTO } from "@/app/task-dayview/schema/schema";
import { MonthlyStatDTO } from "@/model/monthly-stats-dto";
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

  export const fetchMonthlyStats = async (year: number, month: number): Promise<MonthlyStatDTO> => {
      const getCookie = (name: string): string | null => {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find(c => c.startsWith(`${name}=`));
      return cookie ? cookie.split("=")[1] : null;
    };
  
    const token = getCookie("authToken");
  
    if (!token) {
      throw new Error("No auth token found in cookies");
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API}/Task/monthly-stats/${year}-${month}`;
  
    //console.log(`Fetching monthly stats from: ${url}`);
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
  
    //console.log('Raw response:', response);
  
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null);
      console.error("Error Response:", errorResponse);
      throw new Error(`API returned an error: ${errorResponse?.message || response.statusText}`);
  }
  
    const result = await response.json();
  
    //console.log('Parsed response:', result);
  
    return result as MonthlyStatDTO;
  };
  