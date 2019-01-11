import { ElementRef } from '@angular/core';

export class ResizedEvent {
  constructor(
    readonly newWidth: number,
    readonly newHeight: number,
    readonly oldWidth: number,
    readonly oldHeight: number
  ) {}
}
