import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Public } from './decorators/auth/public.decorator';

@Public()
@WebSocketGateway(3002, { namespace: 'notification' })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log('🚀 ~ NotificationGateway ~ handleEvent ~ data:', data);
    this.server.emit('message', 'server emit from notification namespace');
  }

  afterInit(server: Server) {
    this.logger.log('server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(client.id);
    this.logger.log('connected');
  }

  handleDisconnect(client: Socket) {
    this.logger.log('disconnected');
  }
}
