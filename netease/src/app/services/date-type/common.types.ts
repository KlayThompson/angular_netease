// banner
export type Banner = {
  targetId: number,
  url: string,
  imageUrl: string
};

// 热门推荐
export  type HotTag = {
  name: string,
  id: number,
  position: number
};

// 歌手
export type Singer = {
  name: string,
  id: number,
  albumSize: number,
  picUrl: string
};

// 歌曲
export type Song = {
  name: string,
  id: number,
  albumSize: number,
  url: string,
  ar: Singer[],
  al: {id: number, name: string, picUrl: string},
  dt: number
};


// 歌单
export type SongSheet = {
  name: string,
  id: number,
  playCount: number,
  picUrl: string,
  tracks: Song[]
};

// 歌曲地址
export type SongUrl = {
  id: number,
  url: string,
};
