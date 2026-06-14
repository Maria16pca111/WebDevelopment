using System;
using datingapp.API.Entities;
using datingapp.API.Interface;
using DatingApp.API.DTOs;

public static class AppUserExtensions
{
    public static UserDto ToDto(this AppUser user,ITokenService tokenService)
    {
        return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = tokenService.CreateToken(user)
            };
    }
}