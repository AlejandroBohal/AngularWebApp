import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router,ActivatedRoute} from '@angular/router'
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  cliente: Cliente = new Cliente()
  titulo: string = "Crear cliente"
  errores: string[];
  constructor(private clienteService: ClienteService,
    private router:Router,
    private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }
  public cargarCliente(): void{
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(
          cliente => this.cliente = cliente
        )
      }
    })
  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito!`, 'success');
      },
      err =>{
        this.errores = err.error.errors as string[]
        console.error("Error: "+ err.status);
        console.error(err.error.errors);
      }
    )
  }
  public update(): void{
    this.clienteService.update(this.cliente).subscribe(cliente =>{
      this.router.navigate(['/clientes'])
      swal.fire('Cliente actualizado', `Cliente ${cliente.nombre} actualizado con éxito!`, 'success');
    },
    err =>{
      this.errores = err.error.errors as string[]
      console.error("Error: "+ err.status);
      console.error(err.error.errors);
      }
    )
  }


}
