import { Component, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age.pipe';

@Component({
  selector: 'app-member-cards',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-cards.component.html',
  styleUrl: './member-cards.component.css'
})
export class MemberCardsComponent {
  member = input.required<Member>();
  

}
