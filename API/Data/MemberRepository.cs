using Microsoft.EntityFrameworkCore;
using datingapp.API.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Threading.Tasks;
using DatingApp.API.Interface;
using API.Helpers;

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
            var query = _context.Members.AsQueryable();
            
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

        public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
        {
            var query = _context.Members.AsQueryable();

            query = query.Where((x => x.Id != memberParams.CurrentMemberId));

            if (memberParams.Gender != null)
            {
                query = query.Where(x => x.Gender == memberParams.Gender);
            }
            
            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

            query = query.Where(x => x.DateOfBrith >= minDob && x.DateOfBrith <= maxDob);

            query = memberParams.OrderBy switch
            {
                "created" => query.OrderByDescending(x=> x.Created),
                _ => query.OrderByDescending(x=> x.LastActive)
            };
            
            return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
        }
    }
}