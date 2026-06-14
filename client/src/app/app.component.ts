import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from "../layout/nav/nav.component";

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected router = inject(Router);
  /*async ngOnInit() {
    this.setCurrentUser();
  }*/

  /*setCurrentUser() {
    const userString = localStorage.getItem('user');
    if(!userString)
    {
      return;
    }
    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.currentUser.set(user);
    }
  }*/

  /* async getMembers()
  {
    try
    {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members')); // promises are not stream of data
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }*/
}

