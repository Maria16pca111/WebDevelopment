import { Component, inject } from '@angular/core';
import { MemberServiceService } from '../../../core/services/member-service.service';
import { Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCardsComponent } from "../member-cards/member-cards.component";

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, MemberCardsComponent], //used for subscribing to observables
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent {
  private memberService = inject(MemberServiceService);
  protected members$: Observable<Member[]>;
  
  constructor() {
    this.members$ = this.memberService.getMembers();
  }


}
