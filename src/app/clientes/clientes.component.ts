import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',

})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  constructor(private clienteService: ClienteService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page){
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    }

    )

    //Operador tab para uso del flujo de datos sin alterarlo
    /*
    this.clienteService.getClientes().pipe(
      tap (response =>{
        console.log('Clientes component tap')
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        })
      })
    ).subscribe(response => this.clientes =clientes);
    */

  }
  delete(cliente: Cliente): void{
    const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


swalWithBootstrapButtons.fire({
  title: '¿Está seguro?',
  text: `¿Desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Eliminar',
  cancelButtonText: 'Cancelar',
  reverseButtons: true
}).then((result) => {
  if (result.value) {
      this.clienteService.delete(cliente.id).subscribe(
        response =>{
          this.clientes = this.clientes.filter( cli => cli!== cliente)
          swalWithBootstrapButtons.fire(
          'Eliminado!',
          `Cliente ${cliente.nombre} eliminado con éxito!`,
          'success'
          )
        }
      )
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire(
      'Cancelled',
      'Eliminación cancelada',
      'error'
    )
  }
})
  }

}
