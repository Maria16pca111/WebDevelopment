using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    public class buggyController : Controller
    {
        // GET: buggyController
        public ActionResult Index()
        {
            return View();
        }

    }
}
