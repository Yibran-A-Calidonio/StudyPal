using Microsoft.EntityFrameworkCore;
using StudyPalAPI.Data;
using StudyPalAPI.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddSingleton<LeaderboardService>(); // Add LeaderboardService as a singleton

// Add DbContext with the connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Allow React app's origin
              .AllowAnyHeader() // Allow any headers (e.g., Content-Type, Authorization)
              .AllowAnyMethod() // Allow any HTTP methods (GET, POST, PUT, DELETE)
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS policy
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHub<StudyPalAPI.Hubs.LeaderboardHub>("/leaderboardHub"); // Map the SignalR hub


app.Run();
