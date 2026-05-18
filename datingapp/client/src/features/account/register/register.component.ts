import { Component, output,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  CancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;

  register()
  {
    this.accountService.register(this.creds).subscribe({
      next: response =>
      {
        console.log(response);
        this.cancel();
      },
      error: error => {
        console.log(error);
      }
    }),
    console.log(this.creds);
    
  }

  cancel()
  {
    this.CancelRegister.emit(false);
    console.log('cancelled');
  }

}
  