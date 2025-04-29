import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import {  NewMessageDto } from './dto/create-message-w.dto';

import { Server, Socket } from 'socket.io';
import { subscribe } from 'diagnostics_channel';
@WebSocketGateway({cors:true})
export class MessageWsGateway implements OnGatewayConnection , OnGatewayDisconnect {
  
  sala:string
  @WebSocketServer() wss:Server;//info de todos los clientes conectados
  constructor(private readonly messagesWsService: MessageWsService) {}





  //cuando se conecta el cliente
  handleConnection(client: Socket, ) {

    //console.log(client.id,'que envia')
    //console.log({conectados:this.messagesWsService.getConectedClients()}) 

     //cuando un cliente se conecta 
    this.messagesWsService.registerClient(client);
 

     //emitir los clientes conectados a todos los clientes
     //despues de la coma se puede enviar lo que uno quiera 
     this.wss.emit('clients-updated',this.messagesWsService.getConectedClients());
    
    

      
    //console.log({conectados:this.messagesWsService.getConectedClients()})
     console.log('cliente conectado',client.id)
  }


  //cuando se desconecta el cliente
  handleDisconnect(client:Socket) {
      this.messagesWsService.removeClient(client.id)

      this.wss.emit('clients-updated',this.messagesWsService.getConectedClients())
    //console.log('cliente desconectado',client.id)
  }

  @SubscribeMessage('updateDiagram')
  onMessageFromClient(client:Socket,payload:any){
    //console.log(payload,'datos del diagram')

    /// para devolver mensaje a al mismo usuario solo emite al mismo
    //  client.emit('message',{
    //     fullname:'soy yo',
    //     message:payload  || ' no message'
    //  })
    this.sala=payload.diagramId
    //console.log(payload.diagramId,'aver como llega')
    //emitir a todos menos al cliente inicial 
    // client.broadcast.emit('message-form-server',{
    //    //fullname:'soy yo',
    //   //    message:payload  || ' no message'
    // })
    

  /*   client.broadcast.to(this.sala).emit('diagramUpdated',{
     
         payload
    }) */
    client.broadcast.emit('diagramUpdated',{
     
         payload
    })

 
          

  }



  //message-from-client

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client:Socket,payload:NewMessageDto){
   
     console.log(payload)

  }




}
