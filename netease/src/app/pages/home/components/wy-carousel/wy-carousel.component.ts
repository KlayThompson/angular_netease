import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush // 只在input属性发生变化之后才会触发变更检测
})
export class WyCarouselComponent implements OnInit {
  @Input() activeIndex = 0;
  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();
  @ViewChild('dot', {static: true })
  dot: TemplateRef<any>;
  constructor() { }

  ngOnInit(): void {
  }

  onchangeSlide(val: 'pre' | 'next') {
    this.changeSlide.emit(val);
  }
}
