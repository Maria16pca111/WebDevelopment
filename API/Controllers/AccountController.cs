using System.Security.Cryptography;
using datingapp.API.Data;
using datingapp.API.Entities;
using datingapp.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using System.Security.Cryptography.X509Certificates;
using DatingApp.API.DTOs;
using datingapp.API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using CloudinaryDotNet.Actions;
using System.CodeDom;

namespace API.Controllers
{
    /// <summary>
    /// Controller for managing user account operations (registration, login, etc.)
    /// </summary>
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            /*if (await EmailExists(registerDto.Email))
            {
                return BadRequest("Email is already taken");
            }
            var hmac = new HMACSHA512();*/
            var user = new AppUser
            {
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.Email,
                //PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
                //PasswordSalt = hmac.Key,
                Member = new Member
                {
                    DisplayName = registerDto.DisplayName,
                    Email = registerDto.Email,
                    Gender = registerDto.Gender!,
                    City = registerDto.City!,
                    Country = registerDto.Country!,
                    DateOfBrith = registerDto.DateOfBirth
                }
            };

            //context.Users.Add(user);
            //await context.SaveChangesAsync();

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if(!result.Succeeded)
            {
                foreach(var errors in result.Errors)
                {
                    ModelState.AddModelError("identity", errors.Description);
                }
                return ValidationProblem();
            }

            await userManager.AddToRoleAsync(user, "Member");

            await SetRefreshTokenCookie(user);

            return await user.ToDto(tokenService);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //var user = await context.Users.SingleOrDefaultAsync(x => x.Email!.ToLower() == loginDto.Email.ToLower());

            var user = await userManager.FindByEmailAsync(loginDto.Email);
            

            if(user == null)
            {
                return Unauthorized("Invalid email");
            }

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if(!result)
                return Unauthorized("Invalid Password");
            /*
                        using var hmac = new HMACSHA512(user.PasswordSalt);

                        var ComputeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));

                        for (int i = 0; i < ComputeHash.Length; i++)
                        {
                            if (ComputeHash[i] != user.PasswordHash[i])
                            {
                                return Unauthorized("Invalid password");
                            }
                        }
                        
            */            
            
            await SetRefreshTokenCookie(user);
            
            return await user.ToDto(tokenService);
        }

            /*private async Task<bool> EmailExists(string email)
            {
                return await context.Users.AnyAsync(x => x.Email!.ToLower() == email.ToLower());
            }*/
    [HttpPost("refresh-token")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if(refreshToken == null) return NoContent();

        var user = await userManager.Users.FirstOrDefaultAsync(x=> 
                x.RefreshToken == refreshToken 
                && x.RefreshTokenExpiry > DateTime.UtcNow);

        if(user == null) return Unauthorized();

        await SetRefreshTokenCookie(user);

        return await user.ToDto(tokenService);
            
    }

    private async Task SetRefreshTokenCookie(AppUser user)
        {
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

    }
}
