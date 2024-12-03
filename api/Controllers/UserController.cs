using Microsoft.AspNetCore.Mvc;
using api.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequestModel request)
        {
            if (_context.Users.Any(u => u.Username == request.Username))
            {
                return Conflict(new { message = $"{request.Username} 已經註冊過了!" }); // 409 Conflict
            }

            try
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var newUser = new UserModel
                {
                    Username = request.Username,
                    PasswordHash = hashedPassword
                };

                _context.Users.Add(newUser);
                _context.SaveChanges();

                return Ok(new { message = $"{request.Username} 註冊成功!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "註冊過程中發生錯誤。", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestModel request)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == request.Username);

            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(request.Password, existingUser.PasswordHash))
            {
                return Unauthorized(new { message = "帳號或密碼錯誤。" });
            }

            return Ok(new { message = $"{existingUser.Username} 登入成功!" });
        }


    }
}
