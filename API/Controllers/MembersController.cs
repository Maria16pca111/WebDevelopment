using System.Security.Claims;
using API.DTOs;
using API.Extensions;
using datingapp.API.Entities;
using DatingApp.API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// Controller for managing dating app members/users
    /// </summary>
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
         
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member == null)
            {
                return NotFound();
            }
            return Ok(member);
        }
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            if(memberId == null) return BadRequest("OOPS - No ID found in Token");

            var member = await memberRepository.GetMemberForUpdate(memberId);

            if(member == null) return BadRequest("Could not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            //memberRepository.Update(member); //optional

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;

            if(await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to Update a member");
        }
    }
}