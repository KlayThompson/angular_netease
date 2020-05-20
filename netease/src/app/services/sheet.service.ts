import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_CONFIG, ServicesModule} from './services.module';
import {Observable} from 'rxjs';
import {Song, SongSheet} from './date-type/common.types';
import {map, pluck, switchMap} from 'rxjs/operators';
import {SongService} from './song.service';

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songService: SongService
    ) { }

  // 获取banner
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', {params})
      .pipe(map((value: {playlist: SongSheet}) => value.playlist));
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
      .pipe(pluck('tracks'), switchMap(tracks => this.songService.getSongList(tracks)));
  }
}
