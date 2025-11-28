import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { iniciarSesionService } from '../service/iniciar-sesion.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuarioComponent implements OnInit{
  private router = inject(Router);
  public iniciarSesionService = inject(iniciarSesionService); 
  userForm: FormGroup; 
  submitted = false; 
  user: any; 
  

  constructor(private http: HttpClient, private fb: FormBuilder){
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.getUser();
  }
  submit(){
    this.submitted = true; 

    this.submitted = true; 
    if(this.userForm.invalid) return; 
  }
  getUser(){
    this.user = this.iniciarSesionService.currentUser;
    this.userForm.patchValue({
      username: this.user.Nombre ?? ''
    });
  }
}
