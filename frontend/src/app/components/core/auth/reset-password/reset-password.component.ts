import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  showResetFields = false;
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService, private notificationService: NotificationService, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      resetCode: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  isInvalid(controlName: string): boolean {
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    this.notificationService.notify('Passwords do not match', 'warning')
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  requestResetCode(): void {
    if (this.resetPasswordForm.get('email')?.valid) {
      this.loading = true;
      this.userService.generateResetCode(this.resetPasswordForm.get('email')?.value).subscribe(() => {
        this.loading = false;
        this.showResetFields = true;
        this.notificationService.notify(`Email with reset code sent to ${this.resetPasswordForm.get('email')}`, 'info')
      }, error => {
        this.loading = false;
        this.notificationService.notify('Error requesting reset code:', 'error');
      });
    } else {
      this.resetPasswordForm.get('email')?.markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const { email, resetCode, password } = this.resetPasswordForm.value;
      this.userService.resetPassword(email, resetCode, password).subscribe(() => {
        this.notificationService.notify('Password reset successfully', 'success');
        this.router.navigateByUrl('/users/auth/login')
      }, error => {
        this.notificationService.notify('Error resetting password:', 'error');
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}
