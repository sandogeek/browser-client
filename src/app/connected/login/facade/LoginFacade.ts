import { Injectable } from '@angular/core';
// import { PacketHandler } from 'src/app/shared/decorators/PacketHandler';
import { WebSocketService } from 'src/app/shared/service/web-socket-service.service';

@Injectable({
  providedIn: 'root'
})
// @PacketHandler
export class LoginFacade {
    constructor(
        private wsService: WebSocketService,
    ) {
        console.log(`实例化`);
    }
}
