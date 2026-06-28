import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AgePipe } from '../../../core/pipes/age.pipe';
import { AccountService } from '../../../core/services/account.service';
import { MemberServiceService } from '../../../core/services/member-service.service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive,RouterOutlet, AgePipe],
  templateUrl: './member-detailed.component.html',
  styleUrl: './member-detailed.component.css'
})
export class MemberDetailedComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  protected memberService = inject(MemberServiceService)
  private router = inject(Router);
  //protected member$?: Observable<Member>;
  protected title = signal('Profile');
  protected isCurrentUser = computed(()=> {
    const currentId = this.accountService.currentUser()?.id ?? null;
    const routeId = this.route.snapshot.paramMap.get('id');
    return currentId !== null && routeId !== null && currentId.toString() === routeId;
  })

  
  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot.title ?? 'Profile');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(
      {
        next: () => {
          this.title.set(this.route.firstChild?.snapshot.title ?? 'Profile')
        }
      }
    )
  }
}
