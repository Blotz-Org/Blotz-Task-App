﻿namespace BlotzTask.Models
{
    public class TaskItemDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateOnly DueDate { get; set; }
        public bool IsDone { get; set; }
        public LabelDTO Label { get; set; }
    }
}
