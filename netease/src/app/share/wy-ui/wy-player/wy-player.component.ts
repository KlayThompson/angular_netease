import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {APPStoreModule} from '../../../store';
import {getCurrentIndex, getCurrentSong, getPlayer, getPlayList, getPlayMode, getSongList} from '../../../store/selectors/player.selector';
import {Song} from '../../../services/date-type/common.types';
import {PlayMode} from './player-types';
import {SetCurrentIndex, SetPlayList, SetPlayMode} from '../../../store/actions/player.action';
import {fromEvent, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {shuffle} from '../../../utils/array';

const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环'
  },
  {
    type: 'random',
    label: '随机'
  },
  {
    type: 'singleLoop',
    label: '单曲循环'
  }
];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  percent = 0;
  bufferOffset = 0;
  // 音量默认60
  volume = 60;
  showVolumePanel = false; // 音量显示面板
  showListPanel = false; // 控制是否显示列表面板
  selfClick = false; // 当前点击部分是否是面板本身
  private winClick: Subscription;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  currentMode: PlayMode = modeTypes[0]; // 当前播放模式
  modeCount = 0; // 切换播放模式点了多少次

  duration: number;
  currentTime: number;

  playing: boolean;
  playReady: boolean;

  @ViewChild('audio', {static: true}) private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  constructor(
    private store$: Store<APPStoreModule>,
    @Inject(DOCUMENT) private doc: Document
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
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (this.currentMode.type === 'random') {
        list = shuffle(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({playList: list}));
      }
    }
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = list.findIndex(item => item.id === song.id);
    this.store$.dispatch(SetCurrentIndex({currentIndex: newIndex}));
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }
    console.log('song', this.currentSong);
  }

  canPlay() {
    this.playReady = true;
    this.play();
  }

  play() {
    this.audioEl.play();
    this.playing = true;
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const bufferd = this.audioEl.buffered;
    if (bufferd.length && this.bufferOffset < 100) {
      this.bufferOffset = (bufferd.end(0) / this.duration) * 100;
      console.log('buffer', this.bufferOffset);
    }
  }

  // 播放暂停
  onToggleClick() {
    if (!this.currentSong) {
      console.log(1);
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else if (this.playReady) {
      console.log(2);
      this.playing = !this.playing;
      this.playing ? this.audioEl.play() : this.audioEl.pause();
    }
  }

  // 上一曲
  onPrevClick(index: number) {
    if (!this.playReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一曲
  onNextClick(index: number) {
    if (!this.playReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({currentIndex: index}));
    this.playReady = false;
  }

  onPercentChange(per) {
    console.log('百分比', per);
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (per / 100);
    }
  }

  // 调整音量
  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }

  // 控制音量面板显示与否
  toggleVolumePanel() {
    // e.stopPropagation();
    this.togglePanel('showVolumePanel');
  }

  // 控制播放列表面板显示与否
  toggleListPanel() {
    if (this.songList) {
      this.togglePanel('showListPanel');
    }
  }

  // 改变播放模式
  changeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode({playMode: temp}));
  }

  togglePanel(type: string) {
    this[type] = !this[type];
    if (this.showVolumePanel || this.showListPanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }

  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {
          this.showVolumePanel = false;
          this.showListPanel = false;
          this.unbindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  private unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  // 歌曲结束播放
  onSongEnd() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNextClick(this.currentIndex + 1);
    }
  }

  onChangeSong(song: Song) { // 改边歌曲
    this.updateCurrentIndex(this.playList, song);
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : 'https://p1.music.126.net/uA-HPiVGnk4nWNbHhitO9w==/109951164717267776.jpg';
  }
}
