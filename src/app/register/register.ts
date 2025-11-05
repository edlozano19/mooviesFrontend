import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, RegisterRequest } from '../core/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(3),
        Register.usernameValidator
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
      ]],
      firstName: ['', 
        [Validators.required, 
        Validators.minLength(2),
        Register.nameValidator
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Register.nameValidator
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Register.strongPasswordValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.registerForm.reset();
    this.errorMessage.set(null);
    this.isLoading.set(false);

    this.registerForm.markAsUntouched();
    this.registerForm.markAsPristine();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const request: RegisterRequest = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        password: this.registerForm.value.password
      };

      this.authService.register(request).subscribe({
        next: (result) => {
          this.isLoading.set(false);

          if (result.success) {
            this.router.navigate(['/login'], {
              queryParams: { message: 'Registration successful. Please log in '}
            });
          }
          else {
            this.errorMessage.set(result.error || 'Registration failed');
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set('Registration failed. Please try again');
        }
      });
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return {passwordMismatch: true};
    }
    return null;
  }

  static nameValidator(control:any): {[key: string]: any} | null {
    const namePattern = /^[a-zA-Z\s\-']+$/;
    if (control.value && !namePattern.test(control.value)) {
      return {invalidName: true};
    }
    return null;
  }

  static usernameValidator(control: any): {[key: string]: any} | null {
    const usernamePattern = /^[a-zA-Z0-9_\-]+$/;
    if (control.value && !usernamePattern.test(control.value)) {
      return {invalidUsername: true};
    }
    return null;
  }

  static strongPasswordValidator(control: any): {[key: string]: any} | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isValidLength = password.length >= 8;

    const passwordIsValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

    if (!passwordIsValid) {
      return {
        strongPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar,
          isValidLength,
          passwordIsValid
        }
      };
    }
    return null;
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['email']) return 'Invalid email address';
      if (field.errors['invalidName']) return 'Invalid name';
      if (field.errors['invalidUsername']) return 'Invalid username';
      if (field.errors['strongPassword']) {
        const errors = field.errors['strongPassword'];
        const missing = [];
        if (!errors.hasUpperCase) missing.push('uppercase letter');
        if (!errors.hasLowerCase) missing.push('lowercase letter');
        if (!errors.hasNumeric) missing.push('number');
        if (!errors.hasSpecialChar) missing.push('special character');
        if (!errors.isValidLength) missing.push('8+ characters');
        return `Password must contain: <ul style="margin: 0.5rem; padding-left: 1.5rem;">
          ${missing.map(item => `<li>${item}</li>`).join('')}
        </ul>`;
      }
    }
    return '';
  }

  hasPasswordMismatch(): boolean {
    return !!(this.registerForm.errors?.['passwordMismatch'] && this.registerForm.get('confirmPassword')?.touched);
  }
}
