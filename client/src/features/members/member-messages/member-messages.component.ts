import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MemberServiceService } from '../../../core/services/member-service.service';
import { MessageService } from '../../../core/services/message.service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageEndRef') messageEndRef !: ElementRef
  private memberService = inject(MemberServiceService);
  private messageService = inject(MessageService);
  protected messages = signal<Message[]>([]);
  protected messageContent = '';

  ngOnInit(): void {
    this.loadMessage();
  }

  constructor()
  {
    effect(()=>{
      const currentMessages = this.messages();
      if(currentMessages.length > 0){
        this.scrollToBottom();
      }
    })
  }

  loadMessage(){
    const memberId = this.memberService.member()?.id;

    if(memberId){
      this.messageService.getMessageThread(memberId).subscribe(
        {
          next: messages => this.messages.set(messages.map(message => ({
            ...message, currentUserGender: message.senderId !== memberId
          }))),
          complete: ()=> this.scrollToBottom()
        }
      )
    }
  }
  sendMessage()
  {
    const recipientId = this.memberService.member()?.id;
    if(!recipientId)return;
    this.messageService.sendMessage(recipientId, this.messageContent).subscribe({
      next: message => {
        this.messages.update(messages => {
          message.currentUserGender = true;
          return[...messages,message]
        });
        this.messageContent='';
        }
      })
  }

  scrollToBottom()
  {
    setTimeout(()=> {
      if(this.messageEndRef){
      this.messageEndRef.nativeElement.scrollIntoView({behavior: 'smooth'});
    }
    })
  }
}
