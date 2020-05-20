import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from './services.module';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Singer} from './date-type/common.types';
import {map} from 'rxjs/operators';
import queryString from 'query-string';

type SingleParams = {
  offset: number;
  limit: number;
  cat?: string;
};

const defaultParams: SingleParams = {
  offset: 0,
  limit: 9,
  cat: '5001',
};

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }
  // 获取banner
  getEnterSinger(args: SingleParams = defaultParams): Observable<Singer[]> {
    // const params = new HttpParams({fromString: JSON.stringify(args)});
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(this.uri + 'artist/list', {params})
      .pipe(map((value: {artists: Singer[]}) => value.artists));
  }
}
