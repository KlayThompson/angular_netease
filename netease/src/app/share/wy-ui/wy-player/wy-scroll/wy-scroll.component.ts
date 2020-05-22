import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges, SimpleChanges
} from '@angular/core';
import BScroll from 'better-scroll'

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `.wy-scroll{width: 100%; height: 100%; overflow: hidden}`
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit , AfterViewInit, OnChanges{
  @Input() data: any[];
  @Input() refreshTime = 50;
  private bs: BScroll;
  @ViewChild('wrap', {static: true}) private wrapRef: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement);
  }

  refresh() {
    setTimeout(() => {
      this.bs.refresh();
    }, this.refreshTime);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      console.log('1111111');
      this.refresh();
    }
  }
}
