using System.Threading.Tasks;
using CloudinaryDotNet.Actions;

namespace DatingApp.API.Interface
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> UploadPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
