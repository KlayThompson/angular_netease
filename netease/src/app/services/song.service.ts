import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {API_CONFIG, ServicesModule} from './services.module';
import {observable, Observable} from 'rxjs';
import {Song, SongSheet, SongUrl} from './date-type/common.types';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  // 获取banner
  getSongUri(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http.get(this.uri + 'song/url', {params})
      .pipe(map((value: {data: SongUrl[]}) => value.data));
  }

  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const  songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const  ids = songArr.map(item => item.id).join(',');
    return this.getSongUri(ids).pipe(map(urls => this.generateSongList(songArr, urls)));
  }

  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const res = [];
    songs.forEach(song => {
      const url = urls.find(uri => uri.id === song.id).url;
      if (url) {
        res.push({...song, url});
      }
    });
    return res;
  }
}
