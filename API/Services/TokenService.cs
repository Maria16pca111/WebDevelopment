using System.Security.Claims;
using datingapp.API.Entities;
using datingapp.API.Interface;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.IdentityModel.Tokens;

namespace datingapp.API.Services
{
    public class TokenService(IConfiguration config) : ITokenService
    {

        public string CreateToken(AppUser user)
        {
            //getting the token key from appsettings

            var token = config["TokenKey"] ?? throw new Exception("Token key is missing");

            if(token.Length <= 64)
            {
                throw new Exception("Token key must be at least 64 characters long");
            }

            //Encrypting the key

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(token));

            //claims for the token

            var claims = new List<Claim>
            {
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.NameIdentifier, user.Id)
            };

            //Signing credentials

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
        }
    }
}
