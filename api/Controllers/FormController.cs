using Microsoft.AspNetCore.Mvc;
using NLog;
using NLog.Web;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/test")]
    public class FormController : ControllerBase
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        [HttpPost]
        public IActionResult PostData([FromBody] DataModel data)
        {
            var message = $"前端的文字: {data.Data}";
            logger.Info(message);
            return Ok(new
            {
                message
            });
        }

        [HttpGet]
        public IActionResult GetData()
        {
            // 讀取 JSON 文件的內容
            string jsonString = System.IO.File.ReadAllText("response.json");
            logger.Info(jsonString);
            return Content(jsonString, "application/json");
        }
    }

    public class DataModel
    {
        public string Data { get; set; }
    }
}