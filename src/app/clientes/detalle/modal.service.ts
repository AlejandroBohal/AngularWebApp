import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal:boolean = false;
  private _notify =new EventEmitter<any>();

  constructor (){}
  get notify(): EventEmitter<any>{
    return this._notify;
  }
  abrirModal(){
    this.modal= true;
  }
  cerrarModal(){
    this.modal =false;
  }

}
