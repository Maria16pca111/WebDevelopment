import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { of, tap } from 'rxjs';
import { LikesServicesService } from './likes-services.service';

@Injectable({
  providedIn: 'root'
})
export class InitServiceService {

  private accountService = inject(AccountService);
  private likesService = inject(LikesServicesService);
  
  init()
  {
    return this.accountService.refreshToken().pipe(
      tap(user => {
        if(user)
        {
          this.accountService.currentUser.set(user);
          this.likesService.getLikeIds();
          this.accountService.startTokenRefreshInterval();
        }
      })
    )
  }
}
