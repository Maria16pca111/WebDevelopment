import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../types/member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberServiceService {
  private http = inject(HttpClient);
  //private accountService = inject(AccountService);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers(memberparams: MemberParams) {
    let params = new HttpParams();
    params = params.append('pageNumber', memberparams.pageNumber);
    params = params.append('pageSize', memberparams.pageSize);
    params = params.append('minAge', memberparams.minAge);
    params = params.append('maxAge', memberparams.maxAge);
    params = params.append('orderBy',memberparams.orderBy);

    if(memberparams.gender) params = params.append('gender',memberparams.gender);

    return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'members', { params }).pipe(
      tap(
        ()=>{
          localStorage.setItem('filters',JSON.stringify(memberparams))
        }
      )
    )

  }

  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member=> {
        this.member.set(member);
      })
    )
  }

  getMemberPhotos(id: string){
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos')}

  UpdateMember(member: EditableMember){
    return this.http.put(this.baseUrl + 'members', member);}

  uploadPhoto(file:File){
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo){
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoID: number){
    return this.http.delete(this.baseUrl +'members/delete-photo/' + photoID)
  }

  /*private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer' + this.accountService.currentUser()?.token
      })
    }
  }*/
}
