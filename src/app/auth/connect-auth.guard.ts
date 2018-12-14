import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WebSocketService, GameState } from '../shared/service/web-socket-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectAuthGuard implements CanActivate {
  constructor(private wsService: WebSocketService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.wsService.state === GameState.CONNECTED) {
        return true;
      } else {
        this.router.navigateByUrl('');
      }
  }
}
