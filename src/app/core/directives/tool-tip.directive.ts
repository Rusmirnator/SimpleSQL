import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[toolTip]',
  standalone: true
})
export class ToolTipDirective implements OnDestroy {

  @Input() toolTip?: string;
  @Input() delay?: number = 200;

  private _myPopup?: HTMLElement;
  private _timer?: number;
  private _x!: number;
  private _y!: number;

  constructor(private element: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this._timer = setTimeout(() => {
      this.createTooltipPopup();
    }, this.delay);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    if (this._myPopup) {
      this._myPopup.remove();
    }
  }

  private createTooltipPopup() {
    this._myPopup = this.createElement();
  }

  private createElement(): HTMLElement {
    let popup = document.createElement('div');
    document.body.appendChild(popup);

    popup.setAttribute("class", "tooltip-container");
    popup.innerHTML = this.toolTip ?? "";

    return this.addStyle(popup);
  }

  private calculatePosition(): void {
    this._x = (this.element.nativeElement as HTMLElement).getBoundingClientRect().left + this.element.nativeElement.offsetWidth / 2;
    this._y = (this.element.nativeElement as HTMLElement).getBoundingClientRect().top + this.element.nativeElement.offsetHeight + 6;
  }

  private addStyle(popup: HTMLElement): HTMLElement {
    this.calculatePosition();

    popup.style.top = this._y.toString() + "px";
    popup.style.left = this._x.toString() + "px";
    popup.style.textAlign = "center";
    popup.style.zIndex = "100";
    popup.style.position = "fixed";
    popup.style.padding = "6px 12px";
    popup.style.fontSize = "0.8rem";
    popup.style.fontWeight = "600";
    popup.style.lineHeight = "initial";
    popup.style.color = "white";
    popup.style.width = "auto";
    popup.style.background = "#111111ee";
    popup.style.boxSizing = "border-box";
    popup.style.transform = "translate(-50%, -30%)";
    popup.style.animationFillMode = "forwards";
    popup.style.pointerEvents = "none";

    return popup;
  }

  ngOnDestroy(): void {
    if (this._myPopup) {
      this._myPopup.remove();
    }
  }

}