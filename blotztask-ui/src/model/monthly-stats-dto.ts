export interface Tasks {
    completed: { [key: string]: number };
    uncompleted: { [key: string]: number };
  }
  
export interface MonthlyStatDTO {
    year: number;
    month: number;
    tasks: Tasks;
  }
  