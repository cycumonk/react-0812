using Microsoft.AspNetCore.Mvc;
using System.IO; // 引入 System.IO 命名空間以使用文件操作
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserModel user)
        {
            // 設定文件路徑，例如：存放在 "Data" 文件夾下
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", $"{user.Username}.txt");

            // 如果目錄不存在則創建
            if (!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "Data")))
            {
                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "Data"));
            }

            // 創建或寫入文件
            System.IO.File.WriteAllText(filePath, $"Username: {user.Username}");

            var message = $"{user.Username} 註冊成功!";
            return Ok(new { message });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserModel user)
        {
            // 設定文件路徑
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", $"{user.Username}.txt");

            // 檢查文件是否存在
            if (System.IO.File.Exists(filePath))
            {
                // 可以在這裡執行更多的登錄驗證
                return Ok(new { message = $"{user.Username} 登錄成功!" });
            }
            else
            {
                return NotFound(new { message = "用戶未找到，請註冊。" });
            }
        }
    }
}

