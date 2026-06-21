import { ResolveFn, Router } from '@angular/router';
import { MemberServiceService } from '../../core/services/member-service.service';
import { inject } from '@angular/core';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {

  const memberService = inject(MemberServiceService);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');

  if(!memberId)
  {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return memberService.getMember(memberId);
};
