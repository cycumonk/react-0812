using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class UploadController : ControllerBase
    {
        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "請選擇一個檔案" });

            var filePath = Path.Combine("uploads", $"{DateTime.Now:yyyyMMddHHmmssfff}_{file.FileName}");

            try
            {
                // 創建目錄如果它不存在
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { message = "檔案上傳成功！", filePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"內部伺服器錯誤: {ex.Message}" });
            }
        }
    }
}
