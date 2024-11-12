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

//釋放Nlog使用的資源 確保應用程式正常退出 有些日誌訊息會放在記憶體緩衝區，如果沒有正確關閉Nlog會導致資料還在緩衝區來不及寫入就被關閉，導致日誌沒寫入
LogManager.Shutdown();
