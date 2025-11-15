import { Component, computed, inject } from '@angular/core';
import { RecuperarContrasenaService } from '../service/recuperar-contrasena.service';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterModule} from '@angular/router'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,   
  imports: [RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './recuperar-contrasena.html',
  styleUrl: './recuperar-contrasena.css'
})
export class RecuperarContrasenaComponent {
  private recuperarContrasenaService = inject(RecuperarContrasenaService);
  private router = inject(Router);

  loginForm: FormGroup;
  submmited = false; 

  constructor (private http: HttpClient, private fb: FormBuilder){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required]
    });
  }
  submit(){
    this.submmited = true;
    if(this.loginForm.invalid) return;
    this.recuperarContrasenaService
    .submit(this.loginForm.value.username, this.loginForm.value.email)
  }
}
