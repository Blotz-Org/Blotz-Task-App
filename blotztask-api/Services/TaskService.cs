using BlotzTask.Data;
using BlotzTask.Models;
using Microsoft.EntityFrameworkCore;
using BlotzTask.Data.Entities;
using BlotzTask.Models.CustomError;

namespace BlotzTask.Services;

public interface ITaskService
{
    public Task<List<TaskItemDTO>> GetTodoItemsByUser(string userId);
    public Task<TaskItemDTO> GetTaskByID(int Id);
    public Task<int> EditTask(int Id, EditTaskItemDTO editTaskItem);
    public Task<bool> DeleteTaskByID(int Id);
    public Task<string> AddTask(AddTaskItemDTO addtaskItem);
    public Task<int> CompleteTask(int id);
    public Task<List<TaskItemDTO>> GetTaskByDate(DateOnly date);
    public Task<MonthlyStatDTO> GetMonthlyStats(string userId, int year, int month);
}

public class TaskService : ITaskService
{
    private readonly BlotzTaskDbContext _dbContext;

    public TaskService(BlotzTaskDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<TaskItemDTO>> GetTodoItemsByUser(string userId)
    {
        try
        {
            return await _dbContext.TaskItems
                .Where(x => x.UserId == userId)
                .Include(x => x.Label)
                .Select(x => new TaskItemDTO
                {
                    Id = x.Id,
                    Title = x.Title,
                    Label = new LabelDTO { Name = x.Label.Name, Color = x.Label.Color }        
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            //TODO: Add some error log throw 
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
            UpdatedAt = task.UpdatedAt,
            Label = new LabelDTO { Name = task.Label.Name, Color = task.Label.Color }
        };

        return result;
    }

    public async Task<bool> DeleteTaskByID(int Id)
    {
        var taskItem = await _dbContext.TaskItems.FindAsync(Id);
        if (taskItem == null)
        {
            throw new NotFoundException($"Task with ID {Id} not found.");
        }

        _dbContext.TaskItems.Remove(taskItem);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<string> AddTask(AddTaskItemDTO addtaskItem)
    {
        var addtask = new TaskItem
        {
            Title = addtaskItem.Title,
            Description = addtaskItem.Description,
            CreatedAt = DateTime.UtcNow, 
            UpdatedAt = DateTime.UtcNow,
            LabelId = addtaskItem.LabelId,
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
        task.LabelId = editTaskItem.LabelId;

        _dbContext.TaskItems.Update(task);
        await _dbContext.SaveChangesAsync();

        return id;
    }

    public async Task<int> CompleteTask(int taskId)
    {
        var task = await _dbContext.TaskItems.FindAsync(taskId);

        if (task == null)
        {
            throw new NotFoundException($"Task with ID {taskId} was not found.");
        }

        task.IsDone = true;

        _dbContext.TaskItems.Update(task);
        await _dbContext.SaveChangesAsync();

        return taskId;
    }

    public async Task<List<TaskItemDTO>> GetTaskByDate(DateOnly date)
    {
        try
        {
            return await _dbContext.TaskItems
                .Where(task => task.DueDate == date)
                .Select(task => new TaskItemDTO
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    DueDate = task.DueDate,
                    IsDone = task.IsDone,
                    Label = new LabelDTO { Name = task.Label.Name, Color = task.Label.Color }
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception($"Unhandled exception: {ex.Message}");
        }
    }

    public async Task<MonthlyStatDTO> GetMonthlyStats(string userId, int year, int month)
    {

        try
        {
            var filteredTasks = await _dbContext.TaskItems
                .Where(x => x.UserId == userId && x.DueDate.Month == month && x.DueDate.Year == year)
                .GroupBy(x => new { x.Label.Name, x.IsDone })
                .Select(g => new
                {
                    Label = g.Key.Name,
                    IsDone = g.Key.IsDone,
                    Count = g.Count()
                })
                .ToListAsync();

            var result = new MonthlyStatDTO(year, month);

            foreach (var task in filteredTasks)
            {
                if (task.IsDone)
                {
                    result.Tasks.Completed.Add(task.Label, task.Count);
                }
                else
                {
                    result.Tasks.Uncompleted.Add(task.Label, task.Count);
                }
            }
 
            return result;
        }
        catch (Exception ex)
        {
            throw;
        }
    }
}

