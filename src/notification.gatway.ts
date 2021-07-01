/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(3000)
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private Logger = new Logger('NotificationGateway');
    @WebSocketServer()
    server: Server;

    afterInit() {
        this.Logger.log('Notification Gateway Initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.Logger.log(`New client connected...: ${client.id}`);
        client.emit('connected', 'Successfully connected to the server.');
    }

    handleDisconnect(client: Socket) {
        this.Logger.log(`Client disconnected: ${client.id}`);
    }

    // @SubscribeMessage('test event')
    // handleMessage(client: Socket, text: string): WsResponse<string> {
    //   this.Logger.log(`got new event`);
    // //   client.send('test event',text);
    //   return { event: 'test event', data: text };
    // }

    @SubscribeMessage('test event')
    listenForMessages(@MessageBody() data: string) {
        this.server.sockets.emit('test event', data);
    }


}
