using System.Collections.Generic;

namespace BlotzTask.Models
{
    public class MonthlyStatDTO
    {
        public MonthlyStatDTO(int year, int month) {
            Year = year;
            Month = month;
            Tasks = new Tasks();
        }
        public int Year { get; set; }
        public int Month { get; set; }
        public Tasks Tasks { get; set; }
    }

    public class Tasks
    {
        public Tasks () {
            Completed = new Dictionary<string, int>();
            Uncompleted = new Dictionary<string, int>();
        }
        public Dictionary<string, int> Completed { get; set; }
        public Dictionary<string, int> Uncompleted { get; set; }
    }
}