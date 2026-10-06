using API.Extensions;
using API.Helpers;
using API.Interface;
using datingapp.API.Data;
using DatingApp.API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController (IMessageRepository messageRepository,
    IMemberRepository memberRepository) : BaseApiController
    {
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await memberRepository.GetMemberByIdAsync(User.GetMemberId());

            var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if(sender == null || recipient == null || sender.Id == createMessageDto.RecipientId)
                return BadRequest("Cannot send this message");

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };

            messageRepository.AddMessage(message);

            if(await messageRepository.SaveAllAsync());
            return message.ToDto();

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer(
            [FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();

            return await messageRepository.GetMessagesForMember(messageParams);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            return Ok(await messageRepository.GetMessageThread(User.GetMemberId(),recipientId));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            string memberId = User.GetMemberId();

            var message = await messageRepository.GetMessage(id);

            if(message == null) return BadRequest("Cannot delete message");

            if(message.SenderId != memberId && message.RecipientId != memberId)
                return BadRequest("you Cannot delete this message");

            if(message.SenderId == memberId) message.SenderDeleted = true;
            if(message.RecipientId == memberId) message.RecipientDeleted = true;

            if (message is { SenderDeleted: true, RecipientDeleted: true })
            {
                messageRepository.DeleteMessage(message);
            }

            if(await messageRepository.SaveAllAsync()) return Ok();

            return BadRequest("problem deleting message");
        }

    }
}
