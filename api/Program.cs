using NLog;
using NLog.Web;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog.Extensions.Logging;
using System.IO;

// 應用的根目錄
var rootPath = AppContext.BaseDirectory;

// 設定日誌資料夾路徑
var logDirectory = Path.Combine(rootPath, "logs");

// 檢查資料夾是否存在，若不存在則創建
if (!Directory.Exists(logDirectory))
{
    Directory.CreateDirectory(logDirectory);
}

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
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
                     .AllowAnyMethod()
                     .AllowAnyHeader();
    });
});

// 加入控制器服務
builder.Services.AddControllers();

var app = builder.Build();

var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
// app關閉的時候關閉LogMannger
lifetime.ApplicationStopping.Register(() =>
{
    LogManager.Shutdown();
});

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

