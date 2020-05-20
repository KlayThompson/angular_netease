import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {HomeService} from '../../services/home.service';
import {SingerService} from '../../services/singer.service';
import {Banner, HotTag, Singer, SongSheet} from '../../services/date-type/common.types';
import {first} from 'rxjs/operators';

type homeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];
@Injectable()
export class HomeResolverService implements Resolve<homeDataType> {
  constructor(
    private homeService: HomeService,
    private singerService: SingerService,
  ) {}

  resolve(): Observable<homeDataType> {
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger(),
    ]).pipe(first());
  }
}
