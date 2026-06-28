using datingapp.API.Entities;

namespace DatingApp.API.Interface
{
    public interface IMemberRepository
    {
        void Update(Member member);

        Task<bool> SaveAllAsync();

        Task<IReadOnlyList<Member>> GetMembersAsync();

        Task<Member?> GetMemberByIdAsync(string id);

        Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string MemberId);

        Task<Member?> GetMemberForUpdate(string id);
    }
}