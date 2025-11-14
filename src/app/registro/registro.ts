import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { registroService } from '../service/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  private registroService = inject(registroService);
  private router = inject(Router);

  loginForm: FormGroup;
  submitted = false; 

  constructor(private http: HttpClient, private fb: FormBuilder){
    this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        email: ['', Validators.required],
        rol: ['', Validators.required]
    });
  }
  submit(){
    this.submitted = true;
    if(this.loginForm.invalid) return;

    this.registroService
    .submit(this.loginForm.value.username, this.loginForm.value.password, this.loginForm.value.email, this.loginForm.value.rol)
    .then(success => {
        if(success){
            this.router.navigate(['/catalogo']);
        }
      })
      .catch(err => {
        console.error('Error en registro', err);
      });
  }
}
