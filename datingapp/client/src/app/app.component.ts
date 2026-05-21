import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NavComponent } from "../layout/nav/nav.component";
import { AccountService } from '../core/services/account.service';
import { HomeComponent } from "../features/home/home.component";
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected accountService = inject(AccountService);
  protected router = inject(Router);
  protected title = 'Dating App';
  private http = inject(HttpClient);


  async ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if(!userString)
    {
      return;
    }
    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.currentUser.set(user);
    }
  }

  async getMembers()
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
    
  }
}

