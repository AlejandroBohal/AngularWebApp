import { Cliente } from './cliente'
import { from } from 'rxjs';
import { first } from 'rxjs/operators';
export const EJEMPLOCLIENTES: Cliente[] = [
  {id: 1,nombre:'Alejandro',apellido:'Bohorquez',email:'sergiobohal@gmail.com',createAt: '2020-02-11'},
  {id: 2,nombre:'Felipe',apellido:'Gomez',email:'felipegomez@gmail.com',createAt: '2020-02-12'},
  {id: 3,nombre:'Diego',apellido:'Mora',email:'DiegoMora@gmail.com',createAt: '2020-02-12'},
];
export const clientes$  = from (EJEMPLOCLIENTES);
export const CLIENTESOBSERVABLE = clientes$.pipe(first(response => response.id%2 === 0));
