import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberServiceService } from '../../core/services/member-service.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member, Photo } from '../../types/member';
import { AsyncPipe } from '@angular/common';
import { ImageUploadComponent } from "../../shared/image-upload/image-upload.component";
import { AccountService } from '../../core/services/account.service';
import { User } from '../../types/user';
import { StarButtonComponent } from "../../shared/star-button/star-button.component";
import { DeleteButtonComponent } from "../../shared/delete-button/delete-button.component";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUploadComponent, StarButtonComponent, DeleteButtonComponent],
  templateUrl: './member-photos.component.html',
  styleUrl: './member-photos.component.css'
})
export class MemberPhotosComponent implements OnInit {
  protected memberService = inject(MemberServiceService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit():void
  {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if(memberId)
    {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      })
    }
  }
  onUploadImage(file:File)
  {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos=> [...photos, photo])
      },
      error: error =>{
        console.log("Error while Uploading image", error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo: Photo)
  {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if(currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setCurrentUser(currentUser as User);

        this.memberService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member);
      }
    })
  }
  deletePhoto(photoID:number)
  {
    this.memberService.deletePhoto(photoID).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(x => x.id != photoID));
      }
    })
  }
}
