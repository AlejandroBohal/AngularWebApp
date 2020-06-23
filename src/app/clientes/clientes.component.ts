import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { CLIENTESOBSERVABLE } from './clientes.json';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { from } from 'rxjs';


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
    CLIENTESOBSERVABLE.subscribe(
      value => console.log(value)
    )
    // let cliente$ = this.clienteService.getClientes();
    // let firstCliente$ = cliente$.pipe(first(cliente => cliente.id%2 === 0))

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
