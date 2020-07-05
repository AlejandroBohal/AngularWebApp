import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',

})
export class PaginatorComponent implements OnInit,OnChanges {
  @Input() paginador : any;
  paginas: number[];
  from: number;
  to: number;
  constructor() { }

  ngOnInit(): void {
    this.initPaginator();

  }
  ngOnChanges(changes: SimpleChanges): void{
    let paginadorActualizado = changes['paginador'];
    if (paginadorActualizado.previousValue){
      this.initPaginator();
    }
  }

  initPaginator() : void{
    this.from = this.paginador.number-2<=0?1:this.paginador.number-2;
    this.to = this.paginador.number-2<=0?5:this.paginador.number+2;

    if (this.to > this.paginador.totalPages){
      this.paginas = new Array(this.to - this.from+1).fill(0).map((_valor,indice) => indice + this.from-1);
    }else{
      this.paginas = new Array(this.to - this.from+1).fill(0).map((_valor,indice) => indice + this.from);
    }
  }
}
