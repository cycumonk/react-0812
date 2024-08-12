using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/test")]
    public class FormController : ControllerBase
    {
        [HttpPost]
        public IActionResult PostData([FromBody] DataModel data)
        {
            var message = $"前端的文字: {data.Data}";
            return Ok(new { message });
        }
    }

    public class DataModel
    {
        public string Data { get; set; }
    }
}