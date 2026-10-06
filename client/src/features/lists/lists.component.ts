import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesServicesService } from '../../core/services/likes-services.service';
import { Member } from '../../types/member';
import { MemberCardsComponent } from '../members/member-cards/member-cards.component';
import { PaginatedResult } from '../../types/pagination';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

@Component({
  selector: 'app-lists',
  imports: [MemberCardsComponent, PaginatorComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit{
  protected likeService = inject(LikesServicesService);
  protected paginatedResult = signal<PaginatedResult<Member> | null>(null);
  protected predicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;

  tabs = [
    {label:'Liked',value:'liked'},
    {label:'Liked me',value:'likedBy'},
    {label:'Mutual',value:'mutual'},
  ]

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string)
  {
    if(this.predicate != predicate){
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes()
  {
    this.likeService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next: result => this.paginatedResult.set(result)
    });
  }

  onPageChange(event: {currentPage: number, pageSize: number})
  {
    this.pageNumber = event.currentPage;
    this.pageSize = event.pageSize;
    this.loadLikes();
  }

}
