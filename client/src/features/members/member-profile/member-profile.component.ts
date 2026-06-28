import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberServiceService } from '../../../core/services/member-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastServiceService } from '../../../core/services/toast-service.service';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe,FormsModule],
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.css'
})
export class MemberProfileComponent implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;

  @HostListener('window:beforeunload', ['$event'])
  notify($event: BeforeUnloadEvent) {
    // handle beforeunload if needed
    if(this.editForm?.dirty)
    {
      $event.preventDefault();
    }
  }
  
  private accountService = inject(AccountService);
  protected memberService = inject(MemberServiceService);
  private toastServive = inject(ToastServiceService);
  
  protected editableMember: EditableMember = {
    displayName :'',
    description :'',
    city:'',
    country:''
  }

  ngOnInit(): void {
    this.editableMember = {
      displayName : this.memberService.member()?.displayName || '',
      description : this.memberService.member()?.description || '',
      city : this.memberService.member()?.city || '',
      country : this.memberService.member()?.country || '',
    }
  }

  updateprofile()
  {
    if(!this.memberService.member) return;
    const updateMember = {...this.memberService.member(), ...this.editableMember}
    console.log(updateMember);
    this.memberService.UpdateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if(currentUser && updateMember.displayName !== currentUser?.displayName)
        {
          currentUser.displayName = updateMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }
        this.toastServive.success("Profile Updated Successfully", 5000);
        this.memberService.editMode.set(false);
        this.memberService.member.set(updateMember as Member);
        this.editForm?.reset(updateMember);
      }
    })
    
  }
  ngOnDestroy(): void {
    if(this.memberService.editMode())
    {
      this.memberService.editMode.set(false);
    }
  }
}
