import { Injectable, EventEmitter } from '@angular/core';
import io from 'socket.io-client';
import { Socket } from 'socket.io';
import { Mensaje } from '../models/mensaje.model';
import { Response } from '../models/response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  public mensajes: Mensaje[] = [];
  public id: string;

  public recibirMensaje: EventEmitter<Mensaje> = new EventEmitter();

  constructor() {
    this.socket = io(environment.serverURL);

    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
    });

    this.socket.on('mensaje', (mensaje: Mensaje) => {
      this.recibirMensaje.next(mensaje);
      this.mensajes.push(mensaje);
    });

  }

  public enviarMensaje(mensaje: Mensaje) {
    return new Promise((resolve, reject) => {
      this.socket.emit('mensaje', mensaje, (res: Response) => {
        if (res.status === 200) {
          this.mensajes.push(res.data);
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  public getOwnId() {
    new Promise((resolve, reject) => {
      this.socket.emit('getOwnId', null, (res: Response) => {
        resolve(res.data);
      });
    }).then((data: string) => {
      this.id = data;
      return data;
    });
  }

}
