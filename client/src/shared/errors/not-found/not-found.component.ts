import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  private location = inject(Location);

  goBack()
  {
    this.location.back();
  }

}
