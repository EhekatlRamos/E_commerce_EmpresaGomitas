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
  

  constructor(private http: HttpClient, private fb: FormBuilder){
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.getUser();
  }
  async submit(){
    this.submitted = true; 

    if(this.userForm.invalid) return; 
    const usuarioActual = this.iniciarSesionService.currentUser();

    if(usuarioActual && usuarioActual.Id_Clie){
      const {username, password} = this.userForm.value;
      const exito = await this.iniciarSesionService.actualizarUsuario(
            usuarioActual.Id_Clie, 
            username, 
            password
        );

        if (exito) {
            alert('Usuario actualizado correctamente');
        } else {
            alert('Error al actualizar el usuario');
        }
    }
  }
  getUser(){
    const usuarioActual = this.iniciarSesionService.currentUser();
    if(usuarioActual){
      this.userForm.patchValue({
        username: usuarioActual.Nombre,
        password: usuarioActual.Contrasena
      })
    }
  }
}
