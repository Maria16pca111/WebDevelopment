import { Component, inject } from '@angular/core';
import { MemberServiceService } from '../../core/services/member-service.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../types/member';
import { AsyncPipe } from '@angular/common';
import { ImageUploadComponent } from "../../shared/image-upload/image-upload.component";

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe, ImageUploadComponent],
  templateUrl: './member-photos.component.html',
  styleUrl: './member-photos.component.css'
})
export class MemberPhotosComponent {
  protected memberService = inject(MemberServiceService);
  private route = inject(ActivatedRoute);
  protected photos$? : Observable<Photo[]>;

  constructor()
  {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if(memberId)
    {
      this.photos$ = this.memberService.getMemberPhotos(memberId);
    }
  }

  get photoMocks()
  {
    return Array.from({length:20}, (_,i)=> ({
      url:'/userAvatar.png'
    }))
  }

}
