using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RareBooksService.Common.Models;
using RareBooksService.Common.Models.Dto;
using RareBooksService.Data.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RareBooksService.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : BaseController
    {
        private readonly IUserService _userService;

        public AdminController(IUserService userService, UserManager<ApplicationUser> userManager)
            : base(userManager)
        {
            _userService = userService;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsers()
        {
            var currentUser = await GetCurrentUserAsync();
            if (!IsUserAdmin(currentUser))
            {
                return Forbid("Просматривать список пользователей может только администратор");
            }
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<ApplicationUser>> GetUser(string userId)
        {
            var currentUser = await GetCurrentUserAsync();
            if (!IsUserAdmin(currentUser))
            {
                return Forbid("Просматривать информацию о пользователе может только администратор");
            }
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Пользователь не найден");
            }
            return Ok(user);
        }

        [HttpGet("user/{userId}/searchHistory")]
        public async Task<ActionResult<IEnumerable<UserSearchHistoryDto>>> GetUserSearchHistory(string userId)
        {
            var currentUser = await GetCurrentUserAsync();
            if (!IsUserAdmin(currentUser))
            {
                return Forbid("Просматривать историю поиска может только администратор");
            }
            var history = await _userService.GetUserSearchHistoryAsync(userId);

            // Преобразование в DTO
            var historyDto = history.Select(h => new UserSearchHistoryDto
            {
                Id = h.Id,
                Query = h.Query,
                SearchDate = h.SearchDate,
                SearchType = h.SearchType
            });

            return Ok(historyDto);
        }


        [HttpPost("user/{userId}/subscription")]
        public async Task<IActionResult> UpdateUserSubscription(string userId, [FromBody] bool hasSubscription)
        {
            Console.WriteLine($"UpdateUserSubscription called with userId: {userId}, hasSubscription: {hasSubscription}");
            var currentUser = await GetCurrentUserAsync();
            if (!IsUserAdmin(currentUser))
            {
                return Forbid("Обновлять информацию о подписке может только администратор");
            }
            var result = await _userService.UpdateUserSubscriptionAsync(userId, hasSubscription);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to update subscription status.");
        }

        [HttpPost("user/{userId}/role")]
        public async Task<IActionResult> AssignRole(string userId, [FromBody] string role)
        {
            Console.WriteLine($"AssignRole called with userId: {userId}, role: {role}");
            var currentUser = await GetCurrentUserAsync();
            if (!IsUserAdmin(currentUser))
            {
                return Forbid("Назначение пользователей может только администратор");
            }
            var result = await _userService.AssignRoleAsync(userId, role);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to assign role.");
        }

    }
}

