﻿using BlotzTask.Data;
using BlotzTask.Models;
using Microsoft.EntityFrameworkCore;
using BlotzTask.Data.Entities;
using BlotzTask.Models.CustomError;
<<<<<<< Updated upstream
=======
using System.Threading.Tasks;
using Microsoft.VisualBasic;
using System.Runtime.CompilerServices;
>>>>>>> Stashed changes

namespace BlotzTask.Services;

public interface ITaskService
{
    public Task<List<TaskItemDTO>> GetTodoItems();
    public Task<TaskItemDTO> GetTaskByID(int Id);
    public Task<int> EditTask(int Id, EditTaskItemDTO editTaskItem);
    public Task<string> AddTask(AddTaskItemDTO addtaskItem);
    public Task<int> CompleteTask(int id);
}

public class TaskService : ITaskService
{
    private readonly BlotzTaskDbContext _dbContext;

    public TaskService(BlotzTaskDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<TaskItemDTO>> GetTodoItems()
    {
        try
        {
            return await _dbContext.TaskItems
                .Select(x => new TaskItemDTO
                {
                    Id = x.Id,
                    Title = x.Title
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            //TODO: Add some error log throw (havent create PBI)
            throw;
        }
    }
    public async Task<TaskItemDTO> GetTaskByID(int Id)
    {
        var task = await _dbContext.TaskItems.FindAsync(Id);

        if (task == null)
        {
            throw new NotFoundException($"Task with ID {Id} not found.");
        }

        var result = new TaskItemDTO()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            IsDone = task.IsDone,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };

        return result;
    }

    public async Task<string> AddTask(AddTaskItemDTO addtaskItem)
    {
        var addtask = new TaskItem
        {
            Title = addtaskItem.Title,
            Description = addtaskItem.Description,
            CreatedAt = DateTime.UtcNow, 
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.TaskItems.Add(addtask);
        await _dbContext.SaveChangesAsync();

        return addtaskItem.Title;

    }

    public async Task<int> EditTask(int id, EditTaskItemDTO editTaskItem)
    {
        var task = await _dbContext.TaskItems.FindAsync(id);

        if (task == null)
        {
            throw new NotFoundException($"Task with ID {id} not found.");
        }

        task.Title = editTaskItem.Title;
        task.Description = editTaskItem.Description;
        task.UpdatedAt = DateTime.UtcNow;

        _dbContext.TaskItems.Update(task);
        await _dbContext.SaveChangesAsync();

        return id;
    }

    public async Task<int> CompleteTask(int taskId)
    {
        var task = await _dbContext.TaskItems.FindAsync(taskId);

        if (task == null)
        {
            throw new NotFoundException($"Task with ID {taskId} not found.");
        }

        task.IsDone = true;

        _dbContext.TaskItems.Update(task);
        await _dbContext.SaveChangesAsync();

        return taskId;
    }
}

