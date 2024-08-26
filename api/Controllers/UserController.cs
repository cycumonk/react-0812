using Microsoft.AspNetCore.Mvc;
using System.IO; // 引入 System.IO 命名空間以使用文件操作
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        private readonly string _dataDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Data");

        public UserController()
        {
            // 如果目錄不存在則創建
            if (!Directory.Exists(_dataDirectory))
            {
                Directory.CreateDirectory(_dataDirectory);
            }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserModel user)
        {
            string filePath = Path.Combine(_dataDirectory, $"{user.Username}.txt");

            if (System.IO.File.Exists(filePath))
            {
                return Conflict(new { message = $"{user.Username} 已經註冊過了!" }); // 409 Conflict
            }

            try
            {
                System.IO.File.WriteAllText(filePath, user.Password);
                var message = $"{user.Username} 註冊成功!";
                return Ok(new { message });
            }
            catch (IOException ex)
            {
                return StatusCode(500, new { message = "註冊過程中發生錯誤。", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserModel user)
        {
            // 設定文件路徑
            string filePath = Path.Combine(_dataDirectory, $"{user.Username}.txt");

            try
            {
                // 檢查文件是否存在
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new { message = "無此帳號，請註冊。" });
                }

                // 讀取文件中的密碼
                string storedPassword = System.IO.File.ReadAllText(filePath).Trim();

                // 驗證密碼
                if (storedPassword == user.Password)
                {
                    return Ok(new { message = $"{user.Username} 登入成功!" });
                }
                else
                {
                    return Unauthorized(new { message = "密碼錯誤。" });
                }
            }
            catch
            {
                return StatusCode(500, new { message = "登錄過程中發生錯誤。" });
            }
        }
    }
}