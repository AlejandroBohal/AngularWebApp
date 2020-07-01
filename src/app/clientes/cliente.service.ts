import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import swal from 'sweetalert2'
import {DatePipe} from '@angular/common';
import { Router } from '@angular/router';
import { URL_BACKEND } from '../config';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = /*http://localhost:8080/api/clientes;*/ URL_BACKEND + 'api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient,private router:Router) { }
  //return this.http.get<Cliente[]>(this.urlEndPoint);
  getClientes(page: Number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(

      map ( (response : any) => {
          (response.content as Cliente[]).map(cliente =>{
          let nombre = cliente.nombre;
          cliente.nombre = nombre[0].toUpperCase() + nombre.substr(1).toLowerCase();
          let datePipe = new DatePipe('es-CO');
          cliente.createAt = datePipe.transform(cliente.createAt,'fullDate') //formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        });
        return  response;
      } )

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
  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes'])
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }
  subirFoto(file: File,id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("file",file);
    formData.append("id",id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req);

  }

}
