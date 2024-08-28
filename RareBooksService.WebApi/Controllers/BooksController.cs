using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RareBooksService.Common.Models;
using RareBooksService.Common.Models.Dto;
using RareBooksService.Data.Interfaces;
using RareBooksService.WebApi.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RareBooksService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authorization for all actions
    public class BooksController : BaseController
    {
        private readonly IRegularBaseBooksRepository _booksRepository;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly ISearchHistoryService _searchHistoryService;
        private readonly IYandexStorageService _yandexStorageService;

        public BooksController(
            IRegularBaseBooksRepository booksRepository,
            IWebHostEnvironment environment,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            ISearchHistoryService searchHistoryService,
            IYandexStorageService yandexStorageService) : base(userManager)
        {
            _booksRepository = booksRepository;
            _environment = environment;
            _configuration = configuration;
            _searchHistoryService = searchHistoryService;
            _yandexStorageService = yandexStorageService;
        }

        private async Task<bool> UserHasSubscriptionAsync()
        {
            var user = await GetCurrentUserAsync();
            return user != null && user.HasSubscription;
        }

        [HttpGet("searchByTitle")]
        public async Task<ActionResult<PagedResultDto<BookSearchResultDto>>> SearchByTitle(string title, bool exactPhrase = false, int page = 1, int pageSize = 10)
        {
            var books = await _booksRepository.GetBooksByTitleAsync(title, page, pageSize, exactPhrase);
            var hasSubscription = await UserHasSubscriptionAsync();

            if (!hasSubscription)
            {
                books.Items.ForEach(b => b.Price = 0);
            }

            if (page == 1)
            {
                var user = await GetCurrentUserAsync();
                await _searchHistoryService.SaveSearchHistory(user.Id, title, "Title");
            }

            return Ok(books);
        }


        [HttpGet("searchByDescription")]
        public async Task<ActionResult<PagedResultDto<BookSearchResultDto>>> SearchByDescription(string description, bool exactPhrase = false, int page = 1, int pageSize = 10)
        {
            if (page == 1)
            {
                var user = await GetCurrentUserAsync();
                await _searchHistoryService.SaveSearchHistory(user.Id, description, "Description");
            }

            var books = await _booksRepository.GetBooksByDescriptionAsync(description, page, pageSize, exactPhrase);
            var hasSubscription = await UserHasSubscriptionAsync();

            if (!hasSubscription)
            {
                books.Items.ForEach(b => b.Price = 0);
            }

            return Ok(books);
        }

        [HttpGet("searchByCategory")]
        public async Task<ActionResult<PagedResultDto<BookSearchResultDto>>> SearchByCategory(int categoryId, int page = 1, int pageSize = 10)
        {
            var books = await _booksRepository.GetBooksByCategoryAsync(categoryId, page, pageSize);
            var hasSubscription = await UserHasSubscriptionAsync();

            if (!hasSubscription)
            {
                books.Items.ForEach(b => b.Price = 0);
            }

            if (page == 1)
            {
                var user = await GetCurrentUserAsync();
                await _searchHistoryService.SaveSearchHistory(user.Id, _booksRepository.GetCategoryByIdAsync(categoryId).Result.Name, "Category");
            }

            return Ok(books);
        }

        [HttpGet("searchByPriceRange")]
        public async Task<ActionResult<PagedResultDto<BookSearchResultDto>>> SearchByPriceRange(double minPrice, double maxPrice, int page = 1, int pageSize = 10)
        {
            if (page == 1)
            {
                var user = await GetCurrentUserAsync();
                await _searchHistoryService.SaveSearchHistory(user.Id, $"от {minPrice} до {maxPrice} рублей", "PriceRange");
            }

            var hasSubscription = await UserHasSubscriptionAsync();

            if (!hasSubscription)
            {
                return Forbid("Subscription required to search by price range.");
            }

            var books = await _booksRepository.GetBooksByPriceRangeAsync(minPrice, maxPrice, page, pageSize);
            return Ok(books);
        }


        [HttpGet("searchBySeller")]
        public async Task<ActionResult<PagedResultDto<BookSearchResultDto>>> SearchBySeller(string sellerName, int page = 1, int pageSize = 10)
        {
            if (page == 1)
            {
                var user = await GetCurrentUserAsync();
                await _searchHistoryService.SaveSearchHistory(user.Id, sellerName, "Seller");
            }

            var books = await _booksRepository.GetBooksBySellerAsync(sellerName, page, pageSize);
            var hasSubscription = await UserHasSubscriptionAsync();

            if (!hasSubscription)
            {
                books.Items.ForEach(b => b.Price = 0);
            }

            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDetailDto>> GetBookById(int id)
        {
            var hasSubscription = await UserHasSubscriptionAsync();

            if (!hasSubscription)
            {
                return Forbid("Subscription required to view book details.");
            }

            var book = await _booksRepository.GetBookByIdAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        [HttpGet("{id}/images")]
        public async Task<ActionResult> GetBookImages(int id)
        {
            var hasSubscription = await UserHasSubscriptionAsync();
            bool useLocalFiles = bool.TryParse(_configuration["TypeOfAccessImages:UseLocalFiles"], out var useLocal) && useLocal;
            string localPathOfImages = _configuration["TypeOfAccessImages:LocalPathOfImages"];

            List<string> images;
            List<string> thumbnails;

            if (useLocalFiles)
            {
                string basePath = Path.Combine(AppContext.BaseDirectory, "books_photos", id.ToString());
                if (localPathOfImages.Trim() != "")
                    basePath = Path.Combine(localPathOfImages, id.ToString());
                var imagesPath = Path.Combine(basePath, "images");
                var thumbnailsPath = Path.Combine(basePath, "thumbnails");

                if (!Directory.Exists(imagesPath) && !Directory.Exists(thumbnailsPath))
                {
                    return NotFound();
                }

                images = Directory.Exists(imagesPath)
                    ? Directory.GetFiles(imagesPath).Select(Path.GetFileName).ToList()
                    : new List<string>();

                thumbnails = Directory.Exists(thumbnailsPath)
                    ? Directory.GetFiles(thumbnailsPath).Select(Path.GetFileName).ToList()
                    : new List<string>();
            }
            else
            {
                images = await _yandexStorageService.GetImageKeysAsync(id);
                thumbnails = await _yandexStorageService.GetThumbnailKeysAsync(id);
            }

            if (!hasSubscription)
            {
                // Limit to the first thumbnail for users without subscription
                images = new List<string>();
                thumbnails = thumbnails.Take(1).ToList();
            }

            return Ok(new { images, thumbnails });
        }

        [HttpGet("{id}/images/{imageName}")]
        public async Task<ActionResult> GetImage(int id, string imageName)
        {
            var hasSubscription = await UserHasSubscriptionAsync();
            bool useLocalFiles = bool.TryParse(_configuration["TypeOfAccessImages:UseLocalFiles"], out var useLocal) && useLocal;
            string localPathOfImages = _configuration["TypeOfAccessImages:LocalPathOfImages"];

            if (!hasSubscription)
            {
                return Forbid("Subscription required to view full images.");
            }

            if (useLocalFiles)
            {
                string basePath = Path.Combine(AppContext.BaseDirectory, "books_photos", id.ToString());

                if (localPathOfImages.Trim() != "")
                    basePath = Path.Combine(localPathOfImages, id.ToString());

                var imagePath = Path.Combine(basePath, "images", imageName);

                if (!System.IO.File.Exists(imagePath))
                {
                    return NotFound();
                }

                var image = System.IO.File.OpenRead(imagePath);
                return File(image, "image/jpeg");
            }
            else
            {
                // Формируем правильный путь к изображению в облаке
                var key = $"{id}/images/{imageName}";
                var imageStream = await _yandexStorageService.GetImageStreamAsync(key);
                if (imageStream == null)
                {
                    Console.WriteLine($"Image not found: {key} in bucket for book {id}");
                    return NotFound();
                }

                return File(imageStream, "image/jpeg");
            }
        }

        [HttpGet("{id}/thumbnails/{thumbnailName}")]
        public async Task<ActionResult> GetThumbnail(int id, string thumbnailName)
        {
            bool useLocalFiles = bool.TryParse(_configuration["TypeOfAccessImages:UseLocalFiles"], out var useLocal) && useLocal;
            string localPathOfImages = _configuration["TypeOfAccessImages:LocalPathOfImages"];

            if (useLocalFiles)
            {
                var basePath = Path.Combine(AppContext.BaseDirectory, "books_photos", id.ToString());
                if (localPathOfImages.Trim() != "")
                    basePath = Path.Combine(localPathOfImages, id.ToString());

                var thumbnailPath = Path.Combine(basePath, "thumbnails", thumbnailName);

                if (!System.IO.File.Exists(thumbnailPath))
                {
                    return NotFound();
                }

                var thumbnail = System.IO.File.OpenRead(thumbnailPath);
                return File(thumbnail, "image/jpeg");
            }
            else
            {
                // Формируем правильный путь к миниатюре в облаке
                var key = $"{id}/thumbnails/{thumbnailName}";
                var thumbnailStream = await _yandexStorageService.GetThumbnailStreamAsync(key);
                if (thumbnailStream == null)
                {
                    return NotFound();
                }

                return File(thumbnailStream, "image/jpeg");
            }
        }



    }
}


