import { Component, output,inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds } from '../../../types/user';
import { ToastServiceService } from '../../../core/services/toast-service.service';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from "../../../shared/text-input/text-input.component";
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent{
  private toast = inject(ToastServiceService);
  private router = inject(Router);
  private accountService = inject(AccountService)
  private fb = inject(FormBuilder);
  CancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected credentialsForm: FormGroup;
  protected profileForm : FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor()
  {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.credentialsForm.controls['password'].valueChanges.subscribe(()=>{
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    })

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth:['', Validators.required],
      city:['', Validators.required],
      country:['', Validators.required],
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const parent = control.parent;
      if(!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : {passwordMismatch: true};
    }
  }

  nextStep()
  {
    if(this.credentialsForm.value)
    {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }

  prevStep()
  {
    this.currentStep.update(prevStep => prevStep - 1);
  }

  getMaxDate()
  {
    const today = new Date();
    today.setFullYear(today.getFullYear()-18);
    return today.toISOString().split('T')[0];
  }

  register()
  {
    if(this.credentialsForm.valid && this.profileForm.valid)
    {
      const formData = {...this.credentialsForm.value, ...this.profileForm.value};
      
      this.accountService.register(formData).subscribe({
      next: () =>
      {
        this.router.navigateByUrl('/members');
        this.toast.success('Registration successful');
      },
      error: error => {
        console.log(error);
        this.toast.error('Registration failed');
        this.validationErrors.set(error);
      }
    })
    }
  }

  cancel()
  {
    this.CancelRegister.emit(false);
    console.log('cancelled');
    this.toast.info('Registration cancelled');
  }

}
  