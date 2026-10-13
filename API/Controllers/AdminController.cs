using System.Threading.Tasks;
using datingapp.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController(UserManager<AppUser> userManager) : ControllerBase
    {
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUserWithRoles()
        {
            var users = await userManager.Users.ToListAsync();
            var userList = new List<Object>();

            foreach(var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);

                userList.Add(new
                {
                    user.Id,
                    user.Email,
                    Roles = roles.ToList()
                });
            }
            
            
            return Ok(userList);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{userId}")]
        public async Task<ActionResult<IList<string>>> EditRoles(string userId, [FromQuery]string roles)
        {
            if(string.IsNullOrEmpty(roles))
                return BadRequest("you must select atleast one role");

            var selectedRoles = roles.Split(",").ToArray();

            var user = await userManager.FindByIdAsync(userId);

            if(user == null) return BadRequest("could not retrieve user");

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if(!result.Succeeded)
                return BadRequest("Failed to add to Roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if(!result.Succeeded)
                return BadRequest("Failed to remove from roles");

            return Ok(await userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhototsForModeration()
        {
            return Ok("Admins or Moderators can see this");
        }
    }
}
