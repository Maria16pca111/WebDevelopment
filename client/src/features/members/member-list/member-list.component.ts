import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberServiceService } from '../../../core/services/member-service.service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCardsComponent } from "../member-cards/member-cards.component";
import { PaginatedResult } from '../../../types/pagination';
import { PaginatorComponent } from "../../../shared/paginator/paginator.component";
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

@Component({
  selector: 'app-member-list',
  imports: [MemberCardsComponent, PaginatorComponent, FilterModalComponent], //used for subscribing to observables
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  @ViewChild('filterModal') modal! : FilterModalComponent; 
  private memberService = inject(MemberServiceService);
  //protected paginatedMembers$?: Observable<PaginatedResult<Member>>;
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  protected updatedparams = new MemberParams();
  
  constructor()
  {
    const filters = localStorage.getItem('filters');
    if(filters)
      this.memberParams = JSON.parse(filters);
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers()
  {
    this.memberService.getMembers(this.memberParams).subscribe({
      next : result => this.paginatedMembers.set(result)
    })
  }
  onPageChange(event: {currentPage: number, pageSize: number})
  {
    this.memberParams.pageNumber = event.currentPage;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  openModal()
  {
    this.modal.open();
  }

  onClose()
  {
    console.log("Modal Closed");
  }

  onFilterChange(data: MemberParams)
  {
    this.memberParams = {...data};
    this.updatedparams = {...data};
    console.log('Modal Submitted Data', data);
    this.loadMembers();
  }

  resetFilters()
  {
    this.memberParams = new MemberParams();
    this.updatedparams = new MemberParams();
    this.loadMembers();
  }
  get displayMessage(): string
  {
     const defaultParams = new MemberParams();

     const filters: string[] = [];

     if(this.updatedparams.gender)
     {
      filters.push(this.updatedparams.gender + 's')
     }
     else
      filters.push('Males', 'Females');

     if(this.updatedparams.minAge !== defaultParams.minAge
      || this.updatedparams.maxAge !== defaultParams.maxAge)
      {
        filters.push(` ages ${this.updatedparams.minAge} - ${this.updatedparams.maxAge}`)
      }

      filters.push(this.updatedparams.orderBy === 'lastActive' ? 'Recently active':'Newest members');

      return filters.length > 0 ? `Selected: ${filters.join(' | ')}` : 'All members';
  }

}
