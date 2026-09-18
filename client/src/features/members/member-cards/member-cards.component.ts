import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age.pipe';
import { LikesServicesService } from '../../../core/services/likes-services.service';

@Component({
  selector: 'app-member-cards',
  standalone: true,
  imports: [RouterLink, AgePipe],
  templateUrl: './member-cards.component.html',
  styleUrl: './member-cards.component.css'
})
export class MemberCardsComponent {
  private likeService = inject(LikesServicesService);
  member = input.required<Member>();

  protected hasLiked = computed(() =>
    this.likeService.likeIds().includes(this.member().id)
  );

  toggleLike(event: Event)
  {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if(this.hasLiked())
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id));
        else
          this.likeService.likeIds.update(ids => [...ids, this.member().id]);
      }
    })
  }
}
