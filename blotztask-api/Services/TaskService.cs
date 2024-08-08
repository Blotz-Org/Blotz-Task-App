﻿using BlotzTask.Data;
using BlotzTask.Models;
using Microsoft.EntityFrameworkCore;


namespace BlotzTask.Services;

public interface ITaskService
{
    public Task<List<TaskItemDTO>> GetTodoItems();
    public Task<TaskItemDTO> GetBtID(int id);
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
                    DisplayId = $"Task-{x.Id}",
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
    public async Task<TaskItemDTO> GetBtID(int id)
    {
        try
        {
            var taskItem = await _dbContext.TaskItems
                .Where(x => x.Id == id)
                .Select(x => new TaskItemDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    IsDone = x.IsDone,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync();

            return taskItem;
        }
        catch (Exception ex)
        {
            // TODO: Add some error logging here
            throw;
        }
    }


}

