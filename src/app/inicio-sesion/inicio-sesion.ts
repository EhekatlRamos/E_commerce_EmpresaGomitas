import { Component, inject, OnInit } from '@angular/core';
import { iniciarSesionService } from '../service/iniciar-sesion.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true, 
  imports: [RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './inicio-sesion.html',
  styleUrls: ['./inicio-sesion.css']
})
export class InicioSesionComponent{
  private iniciarSesionService = inject(iniciarSesionService);
  private router = inject(Router);

  loginForm: FormGroup;
  submitted = false;

  constructor (private http: HttpClient, private fb: FormBuilder){
        this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    }
  submit(){
    this.submitted = true;
    if(this.loginForm.invalid) return;

    this.iniciarSesionService
    .submit(this.loginForm.value.username, this.loginForm.value.password)
    .then(success => {
        if(success){
            this.router.navigate(['/catalogo']);
        }
      })
      .catch(err => {
        console.error('Error en login', err);
      });
  }
}
