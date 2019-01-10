import { Directive, ElementRef, NgZone, Renderer2, AfterViewInit,
  OnInit, OnDestroy, EventEmitter, Input, Output, HostBinding } from '@angular/core';

@Directive({
  selector: '[appAutoScrollToBottom]',
  exportAs: 'scrollAnchor'
})
export class AutoScrollToBottomDirective implements AfterViewInit, OnInit {
  @Input()
  autoScroll = true;
  @Output()
  autoScrollChange: EventEmitter<boolean> = new EventEmitter();
  @HostBinding('style.overflow-anchor')
  overflowAnchor = 'none';
  @HostBinding('style.overflow-y')
  overflowY = 'auto';
  private scrolling = false;
  // resizeSensor: ResizeSensor = null;

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
        this.renderer.listen(this.element.nativeElement, 'scroll', () => this.onScroll());
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  constructor(
    private element: ElementRef,
    private zone: NgZone,
    private renderer: Renderer2,
  ) {
   }

  onScroll = () => {
    const maxDelta = 2;
    if (this.scrolling) {
        return;
    }
    const el = this.element.nativeElement;
    const bottom = el.scrollTop + el.offsetHeight;
    const height = el.scrollHeight;
    const atBottom = height - bottom < maxDelta;
    if (this.autoScroll !== atBottom) {
        this.zone.run(() => {
            this.autoScroll = atBottom;
            this.autoScrollChange.emit(this.autoScroll);
        });
    }
  }

  scrollToBottom = () => {
    if (!this.autoScroll) {
        return;
    }
    const el = this.element.nativeElement;
    setTimeout(() => {
      el.scrollTop = el.scrollHeight - el.clientHeight;
    });
    this.scrolling = true;
    this.zone.runOutsideAngular(() => setTimeout(() => this.scrolling = false, 1000));
  }


}
