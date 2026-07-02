using Microsoft.EntityFrameworkCore;
using datingapp.API.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Interface;

namespace datingapp.API.Data
{
    public class MemberRepository(AppDbContext context) : IMemberRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<Member?> GetMemberByIdAsync(string id)
        {
            return await _context.Members.FindAsync(id);
        }

        public async Task<IReadOnlyList<Member>> GetMembersAsync()
        {
            return await _context.Members.ToListAsync();
        }

        public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
        {
            return await _context.Members
                .Where(x => x.Id == memberId)
                .SelectMany(m => m.Photos)
                .ToListAsync();
        }

        public void Update(Member member)
        {
            _context.Entry(member).State = EntityState.Modified;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Member?> GetMemberForUpdate(string id)
        {
            return await _context.Members
            .Include(x => x.User)
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}