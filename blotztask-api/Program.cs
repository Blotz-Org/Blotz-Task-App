using Azure.Identity;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Azure.Security.KeyVault.Secrets;
using BlotzTask.Data;
using BlotzTask.Data.Entities;
using BlotzTask.Models.Validators;
using BlotzTask.Services;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.OpenApi.Models;
using Serilog;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();  
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
builder.Services.AddApplicationInsightsTelemetry();

builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ILabelService, LabelService>();

builder.Services.AddIdentityApiEndpoints<User>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<BlotzTaskDbContext>();

builder.Services.AddAuthorization();

builder.Host.UseSerilog((hostingContext, loggerConfiguration) =>
    loggerConfiguration.ReadFrom.Configuration(hostingContext.Configuration));

if (builder.Environment.IsDevelopment())
{
    var databaseConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.AddDbContext<BlotzTaskDbContext>(options => options.UseSqlServer(databaseConnectionString));
}

if (builder.Environment.IsProduction())
{
    var keyVaultEndpoint = builder.Configuration.GetSection("KeyVault").GetValue<string>("VaultURI");

    var keyVaultClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(new AzureServiceTokenProvider().KeyVaultTokenCallback));

    builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new DefaultKeyVaultSecretManager());

    var client = new SecretClient(new Uri(keyVaultEndpoint), new DefaultAzureCredential());
    builder.Services.AddDbContext<BlotzTaskDbContext>(options => options.UseSqlServer(client.GetSecret("db-string-connection").Value.Value.ToString()));
}

builder.Services.AddOpenTelemetry().UseAzureMonitor(options => {
    var connectionString = builder.Configuration.GetSection("ApplicationInsights:ConnectionString").Value;
    options.ConnectionString = connectionString;
});

builder.Services.AddCors(options =>
{
    // CORS Best Practice https://q240iu43yr.feishu.cn/docx/JTkcdbwtloFHJWxvi0ocmTuOnjd?from=from_copylink
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000" // DEV frontend origin
                , "https://blotz-task-app.vercel.app") // Prod frontend origin    
                .WithMethods("GET", "POST", "OPTIONS","PUT") // Specify allowed methods, do not allow method never used.
                .WithHeaders("Content-Type", "Authorization") // Specify allowed headers,may be more headers to added.
                .AllowCredentials(); // TODO: anti-csrf need to be built.
        });
});

// Auto-Register Validator
builder.Services.AddValidatorsFromAssemblyContaining<SampleValidationValidator>();
// Register FluentValidation AutoValidation
builder.Services.AddFluentValidationAutoValidation();

var app = builder.Build();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<UserContextMiddleware>();

app.MapIdentityApi<User>();
// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    // Seed roles and super admin
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;

        try
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<User>>();
            var dbContext = services.GetRequiredService<BlotzTaskDbContext>();

            // Call the seed methods
            await BlotzContextSeed.SeedBlotzContextAsync(userManager,roleManager,dbContext);

        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}

app.UseHttpsRedirection();


app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();

app.MapSwagger().RequireAuthorization();
app.MapControllers().RequireAuthorization();

app.Run();