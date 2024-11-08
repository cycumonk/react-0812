using NLog;
using NLog.Web;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog.Extensions.Logging;


var config = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory) // 確保在不同平台上取得正確的路徑
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

var logger = LogManager.Setup()
    .SetupExtensions(s => s.RegisterConfigSettings(config))
    .LoadConfigurationFromSection(config)
    .GetCurrentClassLogger();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS 設定
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin()
                     .AllowAnyMethod()
                     .AllowAnyHeader();
    });
});

// 加入控制器服務
builder.Services.AddControllers();

var app = builder.Build();

// Middlewares
app.UseRouting();
app.UseCors("AllowAllOrigins");
app.UseAuthorization();

// Swagger 設定
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();


try
{
    using var servicesProvider = new ServiceCollection()
        .AddTransient<Runner>() // Runner is the custom class
        .AddLogging(loggingBuilder =>
        {
            // configure Logging with NLog
            loggingBuilder.ClearProviders();
            loggingBuilder.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
            loggingBuilder.AddNLog(config);
        }).BuildServiceProvider();

    // 確保NLog的初始化成功
    logger.Debug("Starting application");

    var runner = servicesProvider.GetRequiredService<Runner>();
    runner.DoAction("Action1");

    Console.WriteLine("Press ANY key to exit");
    Console.ReadKey();
}
catch (Exception ex)
{
    // NLog: catch any exception and log it.
    logger.Error(ex, "Stopped program because of exception");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
    LogManager.Shutdown();
}

public class Runner
{
    private readonly ILogger<Runner> _logger;

    public Runner(ILogger<Runner> logger)
    {
        _logger = logger;
    }

    public void DoAction(string name)
    {
        _logger.LogDebug("Doing hard work! {Action}", name);
        _logger.LogInformation("Doing hard work! {Action}", name);
        _logger.LogWarning("Doing hard work! {Action}", name);
        _logger.LogError("Doing hard work! {Action}", name);
        _logger.LogCritical("Doing hard work! {Action}", name);
    }
}
