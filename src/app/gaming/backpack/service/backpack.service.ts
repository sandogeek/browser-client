import { Injectable } from '@angular/core';
import { ItemUiInfo, GetPackContentResp, IItemUiInfo, GetPackContentReq, ItemType, UseItemResp } from 'src/app/shared/model/proto/bundle';
import { WebSocketService, CustomMessage } from 'src/app/shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class BackpackService {
  itemList: Array<IItemUiInfo> = new Array();

  private backpackObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === GetPackContentResp) {
        const resp = <GetPackContentResp>message.resp;
        this.itemList = resp.itemUiInfoList;
      }
    },
    error: err => console.log(err)
  };

  private useItemRespObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === UseItemResp) {
        const resp = <UseItemResp>message.resp;
        if (resp.result) {
          this.message.success('物品使用成功');
        } else {
          this.message.error('物品使用失败');
        }
      }
    },
    error: err => console.log(err)
  };

  constructor(
    private wsService: WebSocketService,
    private message: NzMessageService,
  ) {
    this.wsService.observable.subscribe(this.backpackObserver);
    this.wsService.observable.subscribe(this.useItemRespObserver);
    wsService.sendPacket(GetPackContentReq, {});
  }

}
