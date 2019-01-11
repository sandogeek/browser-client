import { Directive, Input, Output, EventEmitter, HostBinding, AfterViewInit, OnInit, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { ResizedEvent } from '../model/ResizeEvent';


export class Rect {
  width: number;
  height: number;
}
@Directive({
  selector: '[appAutoScrollToBottom]',
  exportAs: 'autoScrollDirective'
})
export class AutoScrollToBottomDirective implements AfterViewInit, OnInit {

  @Input()
  autoScroll = true;
  @Input()
  scrollToBottomPreset: (event: ResizedEvent) => void;
  @Output()
  autoScrollChange: EventEmitter<boolean> = new EventEmitter();
  @Output()
  resized: EventEmitter<ResizedEvent> = new EventEmitter();
  @HostBinding('style.overflow-anchor')
  overflowAnchor = 'none';
  @HostBinding('style.overflow-y')
  overflowY = 'auto';
  private scrolling = false;

  constructor(
    private element: ElementRef,
    private zone: NgZone,
    private renderer: Renderer2,
  ) {
    this.scrollToBottomPreset = this.scrollToBottom;
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
        this.renderer.listen(this.element.nativeElement, 'scroll', () => this.onScroll());
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      // scroll to bottom at the beginning
      this.scrollToBottom(null);
      // create a wrapper div element which wrap all directive childNodes
      const el: HTMLBaseElement = this.element.nativeElement;
      const wrapper = document.createElement('div');
      wrapper.setAttribute('style', 'position: relative;');
      const childNodes = el.childNodes;
      const length = childNodes.length;
      for (let i = 0; i < length; i++) {
        const node = childNodes.item(0);
        wrapper.appendChild(node);
      }
      el.appendChild(wrapper);
      this.resized.subscribe((event) => {
        this.scrollToBottomPreset(event);
      });
      this.onResizeFn(wrapper, (oldVal, newVal) => {
        this.resized.emit(new ResizedEvent(newVal.width, newVal.height, oldVal.width, oldVal.height));
      });
    });
  }

  onResizeFn(el: HTMLElement, callback: (oldVal: Rect, currentVal: Rect) => void) {
    // 创建iframe标签，设置样式并插入到被监听元素中
    const iframe = document.createElement('iframe');
    iframe.setAttribute('style',
      `
      width: 100%;
      height: 100%;
      position: absolute;
      visibility:hidden;
      margin: 0;
      padding: 0;
      border: 0;
      left: 0;
      top: 0;
      `
    );
    el.appendChild(iframe);

    // 记录元素当前宽高
    let oldWidth = el.offsetWidth;
    let oldHeight = el.offsetHeight;

    // iframe 大小变化时的回调函数
    const sizeChange = () => {
      // 记录元素变化后的宽高
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      // 不一致时触发回调函数 callback，并更新元素当前宽高
      if (width !== oldWidth || height !== oldHeight) {
        callback({ width: width, height: height }, { width: oldWidth, height: oldHeight });
        oldWidth = width;
        oldHeight = height;
      }
    };

    // 设置定时器用于节流
    let timer: NodeJS.Timer = null;
    // 将 sizeChange 函数挂载到 iframe 的resize回调中
    iframe.contentWindow.onresize = () => {
      clearTimeout(timer);
      timer = setTimeout(sizeChange, 33);
    };
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

  scrollToBottom = (event: ResizedEvent) => {
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
