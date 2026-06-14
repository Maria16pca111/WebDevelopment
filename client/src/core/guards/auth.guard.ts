import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ToastServiceService } from '../services/toast-service.service';


export const authGuard: CanActivateFn = () => {
  const accountservice = inject(AccountService);
  const toast = inject(ToastServiceService);
  
  if(accountservice.currentUser()) {
    return true;}
    else
    {
      toast.error('You shall not pass!');
      return false;
    }
};