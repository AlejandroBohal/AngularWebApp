import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',

})
export class DirectivaComponent {

  listaLenguaje: string[] = ['Angular','Spring','TypeScript'];
  mostrarLenguajes: boolean = true;
  constructor() { }
  setHabilitar(): void {
    this.mostrarLenguajes = (this.mostrarLenguajes == true)? false:true;
  }

}
