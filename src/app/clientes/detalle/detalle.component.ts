import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService} from '../cliente.service';
import swal from 'sweetalert2';
import {HttpEventType} from  '@angular/common/http';
import { URL_BACKEND } from 'src/app/config';
import {ModalService} from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  nombreFoto: string = "Seleccionar Foto";
  titulo: string = "Detalle del cliente.";
  url: string = URL_BACKEND;
  progreso:number = 0;
  fotoSeleccionada: File;


  constructor(private clienteService:ClienteService,
    public modalService: ModalService) { }

  ngOnInit(): void {
    
  }
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada.type.indexOf('image') <0){
      swal.fire('Error al seleccionar imagen: ','El archivo debe ser del tipo imagen.','error');
    }else{
      this.nombreFoto = event.target.files[0].name;
    }

  }
  subirFoto(){

    if(!this.fotoSeleccionada){
      swal.fire('Error al subir: ','Error: debe seleccionar una foto.','error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event =>{
          //this.cliente = cliente;
          if (event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response){
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notify.emit(this.cliente);
            swal.fire('La foto se ha subido con éxito',response.mensaje,'success');
            this.nombreFoto = "Seleccionar foto";
          }

        });
    }

  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada =null;
    this.progreso = 0;
  }

}
