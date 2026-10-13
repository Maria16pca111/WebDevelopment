using datingapp.API.Entities;

namespace datingapp.API.Interface
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);

        string GenerateRefreshToken();
    }
}
