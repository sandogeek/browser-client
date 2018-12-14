import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WebSocketService, GameState } from '../shared/service/web-socket-service.service';

@Injectable({
  providedIn: 'root'
})
export class ChooseRoleGuard implements CanActivate {
  constructor(private wsService: WebSocketService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      switch (this.wsService.state) {
        case GameState.LOGINED : {
          return true;
        }
        case GameState.UNCONNECTED : {
          this.router.navigateByUrl('');
          break;
        }
        case GameState.CONNECTED : {
          this.router.navigateByUrl('/connected');
          break;
        }
      }
  }
}
