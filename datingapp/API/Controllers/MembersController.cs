using datingapp.API.Data;
using datingapp.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    /// <summary>
    /// Controller for managing dating app members/users
    /// </summary>
    public class MembersController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await context.Users.ToListAsync();
            return members;
        }

        [HttpGet("{id}")]
        public ActionResult<AppUser> GetMember(string id)
        {
            var member = context.Users.Find(id);
            if (member == null)
            {
                return NotFound();
            }
            return Ok(member);
        }

    }
}