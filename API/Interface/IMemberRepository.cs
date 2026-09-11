using API.Helpers;
using datingapp.API.Entities;

namespace DatingApp.API.Interface
{
    public interface IMemberRepository
    {
        void Update(Member member);

        Task<bool> SaveAllAsync();

        Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);

        Task<Member?> GetMemberByIdAsync(string id);

        Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string MemberId);

        Task<Member?> GetMemberForUpdate(string id);
    }
}