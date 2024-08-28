using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;

namespace RareBooksService.WebApi.Services
{
    public class YandexStorageService : IYandexStorageService
    {
        private readonly AmazonS3Client _s3Client;
        private readonly string _bucketName;

        public YandexStorageService(IConfiguration configuration)
        {
            var accessKey = configuration["YandexCloud:AccessKey"];
            var secretKey = configuration["YandexCloud:SecretKey"];
            var serviceUrl = configuration["YandexCloud:ServiceUrl"];
            _bucketName = configuration["YandexCloud:BucketName"];

            _s3Client = new AmazonS3Client(accessKey, secretKey, new AmazonS3Config
            {
                ServiceURL = serviceUrl,
                ForcePathStyle = true
            });
        }
        public async Task<List<string>> GetImageKeysAsync(int bookId)
        {
            return await GetKeysAsync($"{bookId}/images/");
        }

        public async Task<List<string>> GetThumbnailKeysAsync(int bookId)
        {
            return await GetKeysAsync($"{bookId}/thumbnails/");
        }

        private async Task<List<string>> GetKeysAsync(string prefix)
        {
            var request = new ListObjectsV2Request
            {
                BucketName = _bucketName,
                Prefix = prefix
            };

            var response = await _s3Client.ListObjectsV2Async(request);

            return response.S3Objects
                .Select(o => o.Key.Replace(prefix, "")) // Убираем префикс для получения имен файлов
                .ToList();
        }
        public async Task<Stream> GetImageStreamAsync(string key)
        {
            try
            {
                var response = await _s3Client.GetObjectAsync(_bucketName, key);
                return response.ResponseStream;
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine($"Error encountered ***. Message:'{e.Message}' when getting an object");
                return null;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Unknown encountered on server. Message:'{e.Message}' when getting an object");
                return null;
            }
        }

        public async Task<Stream> GetThumbnailStreamAsync(string key)
        {
            try
            {
                var response = await _s3Client.GetObjectAsync(_bucketName, key);
                return response.ResponseStream;
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine($"Error encountered ***. Message:'{e.Message}' when getting an object");
                return null;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Unknown encountered on server. Message:'{e.Message}' when getting an object");
                return null;
            }
        }
    }
}
