using System;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;
public class PaginatedResult<T>
{
    public PaginationMetaData MetaData { get; set; } = default!;
    public List<T> Items { get; set; } = [];
};

public class PaginationMetaData
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; } = 1;
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }
};

public class PaginationHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query,
    int pageNumber, int pageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PaginatedResult<T>
        {
            MetaData = new PaginationMetaData
            {
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize),
                TotalCount = count
            },
            Items = items
        };
    }
}