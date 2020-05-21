import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {APPStoreModule} from '../../../store';
import {getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList} from '../../../store/selectors/player.selector';
import {Song} from '../../../services/date-type/common.types';
import {PlayMode} from './player-types';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  sliderValue = 35;
  bufferOffset = 75;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  @ViewChild('audio', {static: true}) private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  constructor(
    private store$: Store<APPStoreModule>
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
  }

  ngOnInit(): void {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    if (type === 'songList') {
      this.songList = list;
    } else {
      this.playList = list;
    }
  }
  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {

  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    console.log('song', this.currentSong);
  }

  canPlay() {
    this.play();
  }

  play() {
    this.audioEl.play();
  }
}
