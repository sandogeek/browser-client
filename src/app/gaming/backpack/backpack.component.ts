import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { BackpackService } from './service/backpack.service';
import { IItemUiInfo, ItemType, UseItemReq } from 'src/app/shared/model/proto/bundle';
import { Long } from 'protobufjs';
import { WebSocketService } from 'src/app/shared/service/web-socket-service.service';

@Component({
  selector: 'app-backpack',
  templateUrl: './backpack.component.html',
  styleUrls: ['./backpack.component.css']
})
export class BackpackComponent implements OnInit {
  itemList: Array<IItemUiInfo>;
  visibles: Array<boolean>;
  ItemType = ItemType;

  constructor(
    private modal: NzModalRef,
    private packService: BackpackService,
    private wsService: WebSocketService,
  ) {
    this.itemList = packService.itemList;
    this.visibles = new Array(this.itemList.length);
  }

  useNormalItem = (itemInfo: IItemUiInfo) => {
    this.removeAmount(itemInfo);
    this.wsService.sendPacket(UseItemReq, {key: itemInfo.key, amount: 1});
  }

  equipItem = (itemInfo: IItemUiInfo) => {
    this.removeAmount(itemInfo);
    this.wsService.sendPacket(UseItemReq, {objectId: itemInfo.objectId, amount: 1});
  }
  /**
   * 减少物品数量
   */
  private removeAmount = (itemInfo: IItemUiInfo) => {
    itemInfo.amount = itemInfo.amount - 1;
    if (itemInfo.amount === 0) {
      const index = this.itemList.indexOf(itemInfo);
      this.itemList.splice(index, 1);
    }
  }

  ngOnInit() {
  }

  isNormalItem (itemInfo: IItemUiInfo) {
    return itemInfo.itemType === ItemType.NORMAL;
  }

  isEquip (itemInfo: IItemUiInfo) {
    return itemInfo.itemType === ItemType.EQUIP;
  }

}
