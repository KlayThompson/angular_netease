import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from './services.module';
import {Observable} from 'rxjs';
import {Banner, HotTag, SongSheet} from './date-type/common.types';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }
  // 获取banner
  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner')
      .pipe(map((value: {banners: Banner[]}) => value.banners));
  }
  // 获取热门标签
  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot')
      .pipe(map((value: {tags: HotTag[]}) => {
        return value.tags.sort((x: HotTag, y: HotTag) => {
          return x.position - y.position;
        }).slice(0, 5);
      }));
  }
  // 获取个人推荐列表
  getPersonalSheetList(): Observable<SongSheet[]> {
    return this.http.get(this.uri + 'personalized')
      .pipe(map((value: {result: SongSheet[]}) => value.result.slice(0, 16)));
  }
}
