import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Singer, SongSheet} from '../../services/date-type/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {SheetService} from '../../services/sheet.service';
import {Store} from '@ngrx/store';
import {APPStoreModule} from '../../store';
import {SetCurrentIndex, SetPlayList, SetSongList} from '../../store/actions/player.action';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheet: SongSheet[];
  singers: Singer[];
  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;
  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<APPStoreModule>
    ) {
    this.route.data.pipe(map(value => value.homeData)).subscribe(([banners, hotTags, songSheet, singers]) => {
      this.banners = banners;
      this.singers = singers;
      this.hotTags = hotTags;
      this.songSheet = songSheet;
    });
  }

  ngOnInit(): void {
  }

  onBeforeChange({to}) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    console.log(id);
    this.sheetService.playSheet(id).subscribe(value => {
      this.store$.dispatch(SetSongList({songList: value}));
      this.store$.dispatch(SetPlayList({playList: value}));
      this.store$.dispatch(SetCurrentIndex({currentIndex: 0}));
    });
  }

}
