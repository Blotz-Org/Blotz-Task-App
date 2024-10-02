using BlotzTask.Models.ApiResponse;

public class ErrorHandlingMiddleware
{ 
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
    
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new ApiResponse<object> { Success = false, Message = "Unauthorized access." });
        }
        
        catch (Exception ex)
        {
            //TODO: Implement logging
            Console.WriteLine($"Unhandled Exception: {ex}");

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new ApiResponse<object> { Success = false, Message = "An error occurred while processing your request." });
        }
    }
}
