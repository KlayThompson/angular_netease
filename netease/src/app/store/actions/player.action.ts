import {createAction, props} from '@ngrx/store';
import {Song} from '../../services/date-type/common.types';
import {PlayMode} from '../../share/wy-ui/wy-player/player-types';

export const SetPlaying = createAction('[player] set playing', props<{playing: boolean}>());
export const SetPlayList = createAction('[player] set playList', props<{playList: Song[]}>());
export const SetSongList = createAction('[player] set songList', props<{songList: Song[]}>());
export const SetPlayMode = createAction('[player] set playMode', props<{playMode: PlayMode}>());
export const SetCurrentIndex = createAction('[player] set currentIndex', props<{currentIndex: number}>());
