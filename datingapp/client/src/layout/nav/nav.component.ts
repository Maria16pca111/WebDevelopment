import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastServiceService } from '../../core/services/toast-service.service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastServiceService);
  protected creds: any = {};
  
  login() {
    this.accountService.login(this.creds).subscribe({
      next: result =>
      {
        console.log(result);
        this.router.navigateByUrl('/members');
        this.toast.success('Login successful');
        this.creds = {};
      },
      error: error => {
        console.log(error);
        this.toast.error(error.error);

      }
    })
  }
  logout() {
    this.accountService.logout();
    this.toast.info('Logged out');
    this.router.navigateByUrl('/');
    this.creds = {};
  }
}
