import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  rememberMe = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private notificationService: NotificationService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.userService.loginUser(loginData.email, loginData.password).subscribe(
        (response: any) => {
          this.notificationService.notify('Login successful', 'success');
          // Save user details to localStorage
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('role', response.role);
          localStorage.setItem('token', response.token);

          // Redirect based on role
          if (response.role === 'admin' || response.role === 'organizer') {
            this.router.navigateByUrl('/admin/analytics');
          } else {
            this.router.navigateByUrl('/users/events');
          }
        },
        (error) => {
          this.notificationService.notify('Login failed', 'error');
        }
      );

    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.touched && control?.invalid;
  }
}
