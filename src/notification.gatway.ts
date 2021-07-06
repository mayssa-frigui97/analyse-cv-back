/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
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

    @SubscribeMessage('test event')
    listenForMessages(@MessageBody() data: string) {
        this.server.sockets.emit('test event', data);
    }


}
