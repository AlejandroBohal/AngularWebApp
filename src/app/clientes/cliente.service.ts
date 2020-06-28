import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import swal from 'sweetalert2'
import {DatePipe} from '@angular/common';
import { Router } from '@angular/router';
import { URL_BACKEND } from '../config';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = /*"http://localhost:8080/api/clientes";*/ URL_BACKEND + 'api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient,private router:Router) { }
  //return this.http.get<Cliente[]>(this.urlEndPoint);
  getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint).pipe(

      map ( (response) => {
        let clientes = response as Cliente[];
        return clientes.map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es-CO');
          cliente.createAt = datePipe.transform(cliente.createAt,'fullDate') //formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        });} ),

    );
  }

  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint,cliente, {headers: this.httpHeaders}).pipe(
      map ( (response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire('Error al crear el cliente',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  getCliente(id:Number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status == 400){
          return throwError(e);
        }
        this.router.navigate(['/clientes'])
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`,cliente, {headers: this.httpHeaders}).pipe(
      map ((response:any) => response.cliente as Cliente),
      catchError(e => {
        this.router.navigate(['/clientes'])
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  delete(id:Number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes'])
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
}
