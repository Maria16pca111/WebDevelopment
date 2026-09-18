import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { of } from 'rxjs';
import { LikesServicesService } from './likes-services.service';

@Injectable({
  providedIn: 'root'
})
export class InitServiceService {

  private accountService = inject(AccountService);
  private likesService = inject(LikesServicesService);
  
  init()
  {
    const userString = localStorage.getItem('user');
    if(!userString)return of(null);
    
    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.currentUser.set(user);
      this.likesService.getLikeIds();
    }
    return of(null);
  }
}
