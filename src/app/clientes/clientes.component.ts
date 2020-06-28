import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';




@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',

})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes
    );
    //Operador tab para uso del flujo de datos sin alterarlo
    /*
    this.clienteService.getClientes().pipe(
      tap (clientes =>{
        console.log('Clientes component tap')
        clientes.forEach(cliente =>{
          console.log(cliente.nombre);
        })
      })
    ).subscribe();
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
