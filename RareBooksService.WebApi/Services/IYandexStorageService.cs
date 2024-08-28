namespace RareBooksService.WebApi.Services
{
    public interface IYandexStorageService
    {
        Task<List<string>> GetImageKeysAsync(int bookId);
        Task<List<string>> GetThumbnailKeysAsync(int bookId);
        //Task<Stream> GetImageStreamAsync(int bookId, string imageName);
        //Task<Stream> GetThumbnailStreamAsync(int bookId, string thumbnailName);
        Task<Stream> GetImageStreamAsync(string key);
        Task<Stream> GetThumbnailStreamAsync(string key);
    }
}
