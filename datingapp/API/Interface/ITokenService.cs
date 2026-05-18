using datingapp.API.Entities;

namespace datingapp.API.Interface
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
