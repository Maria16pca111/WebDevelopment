import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { PaginatedResult } from '../../types/pagination';
import { Message } from '../../types/message';
import { DatePipe } from '@angular/common';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  imports: [PaginatorComponent, RouterLink, DatePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);

  tabs = [
    {label: 'Inbox', value: 'Inbox'},
    {label: 'Outbox', value: 'Outbox'},
  ]

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.paginatedMessages.set(response);
        this.fetchedContainer = this.container;
      }
    })
  }
  get isInbox()
  {
    return this.fetchedContainer === 'Inbox';
  }

  setContainer(containter: string)
  {
    this.container = containter;
    this.pageNumber = 1;
    this.loadMessages();
  }

  onPageChange(event: { currentPage: number, pageSize: number})
  {
    this.pageSize = event.pageSize;
    this.pageNumber = event.currentPage;
    this.loadMessages();
  }

  deleteMessage(event: Event, id: string)
  {
    event.stopPropagation();
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        //this.loadmessages();
        const current = this.paginatedMessages();
        if(current?.items){
          this.paginatedMessages.update(prev => {
            if(!prev) return null;

            const newItems = prev.items.filter(x=> x.id !== id) || [];

            return {
              items: newItems,
              metaData: prev.metaData
            }
          })
        }
      }
    })
  }

}
