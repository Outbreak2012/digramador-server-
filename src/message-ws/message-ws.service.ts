import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
interface ConectedClients{
    [id:string]:Socket
}

@Injectable()
export class MessageWsService {
  private connectedClients={}



   //cuando se conecta el cliente 
   registerClient(client:Socket){
    this.connectedClients[client.id]=client
   }

   //cuando se desconecta el cliente 
   removeClient(clientId:string){
     delete this.connectedClients[clientId]
   }
 
   //conteo de clientes
   getConectedClients():string[] {
    return Object.keys(this.connectedClients);
   }

}
