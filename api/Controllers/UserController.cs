using Microsoft.AspNetCore.Mvc;
using api.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;


namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;


        public UserController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

            // JWT 設定
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, existingUser.Username),
                    new Claim("UserId", existingUser.Id.ToString()), // Custom Claim
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                message = $"{existingUser.Username} 登入成功!",
                token = tokenHandler.WriteToken(token)
            });
        }


    }
}
