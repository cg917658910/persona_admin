import { requestClient } from '#/api/request';

export type SimpleEntity = {
  coverUrl?: string;
  id?: number;
  name?: string;
  slug: string;
  status?: string;
  summary: string;
  title?: string;
};
export type OptionItem = {
  code?: string;
  label?: string;
  name: string;
  value?: string;
};

export type Character = SimpleEntity & {
  aliases?: string[];
  colors?: Array<{ hex: string; name: string }>;
  coreConflict: string;
  coreFear: string;
  coreIdentity: string;
  motivationNote?: string;
  culturalRegionCode?: string;
  dominantEmotions?: string[];
  elements?: string[];
  emotionalTone: string;
  gender?: string;
  hasSong: boolean;
  name: string;
  oneLineDefinition: string;
  primaryMotivation?: string;
  regionCode?: string;
  relationshipProfile?: Record<string, string>;
  songSlugs?: string[];
  soundscapeKeywords?: string[];
  suppressedEmotions?: string[];
  symbolicImages?: string[];
  themeNames: string[];
  themeSlugs?: string[];
  timeline?: Array<{ summary: string; title: string }>;
  type: string;
  valuesTags?: string[];
  workNames: string[];
  workSlugs?: string[];
};

export type Song = SimpleEntity & {
  audioUrl?: string;
  characterName: string;
  characterSlug?: string;
  coreTheme: string;
  emotionalCurve?: string[];
  lyrics?: string;
  prompt?: string;
  styles: string[];
  title: string;
};

export type Theme = SimpleEntity & {
  category?: string;
  characterSlugs?: string[];
  relationSlugs?: string[];
  code?: string;
  name: string;
  subjectType?: 'character' | 'relation';
};

export type Work = SimpleEntity & {
  creatorSlugs?: string[];
  title: string;
  workTypeCode?: string;
};

export type Creator = SimpleEntity & {
  creatorTypeCode?: string;
  name: string;
  workSlugs?: string[];
};

export const dashboardStats = {
  characterCount: 19,
  publishedCharacterCount: 19,
  workCount: 17,
  creatorCount: 16,
  themeCount: 12,
  songCount: 19,
  missingCoverCount: 0,
  missingSongCount: 0,
};

const mockCharacters: Character[] = [
  {
    id: 1,
    slug: 'lin-daiyu',
    name: '林黛玉',
    summary: '高敏感、高自尊的真情承受者。',
    oneLineDefinition:
      '她不是脆弱，而是过度敏感、过度清醒、又过度珍视真情的人。',
    coreIdentity: '真情承受者',
    coreFear: '被辜负',
    coreConflict: '自尊与依恋并存',
    emotionalTone: '清冷哀愁',
    type: '文学人物',
    workNames: ['红楼梦'],
    workSlugs: ['dream-of-the-red-chamber'],
    themeNames: ['悲剧人格', '哀愁型人物'],
    themeSlugs: ['tragic', 'melancholic'],
    songSlugs: ['lin-daiyu-theme-v1'],
    hasSong: true,
    coverUrl: '/assets/images/characters/lin-daiyu.webp',
    status: 'published',
    primaryMotivation: '被理解、被珍视的真情',
    dominantEmotions: ['哀愁', '敏感'],
    suppressedEmotions: ['愤怒'],
    valuesTags: ['真情', '自尊'],
    symbolicImages: ['落花', '细雨', '孤灯'],
    elements: ['风', '雨'],
    relationshipProfile: {
      love: '深依恋但极脆弱',
      authority: '疏离',
      friends: '真诚',
      enemies: '少直接对抗',
    },
    timeline: [
      { title: '进入贾府', summary: '在寄居关系中形成高度敏感的观察位置。' },
      { title: '真情压抑', summary: '在爱与礼法之间持续受损。' },
    ],
  },
  {
    id: 2,
    slug: 'sun-wu-kong',
    name: '孙悟空',
    summary: '不愿被驯服的自由反抗者。',
    oneLineDefinition: '他不是不守规矩，而是不愿被不合理的规矩困住。',
    coreIdentity: '自由反抗者',
    coreFear: '被驯服',
    coreConflict: '野性与责任冲突',
    emotionalTone: '热烈桀骜',
    type: '文学人物',
    workNames: ['西游记'],
    workSlugs: ['journey-to-the-west'],
    themeNames: ['反叛者', '热烈人物'],
    themeSlugs: ['rebels', 'fiery'],
    songSlugs: ['sun-wu-kong-theme-v1'],
    hasSong: true,
    coverUrl: '/assets/images/characters/sun-wu-kong.webp',
    status: 'published',
    primaryMotivation: '自由与自我证明',
    dominantEmotions: ['热烈', '不服'],
    suppressedEmotions: ['脆弱'],
    valuesTags: ['自由', '尊严'],
    symbolicImages: ['筋斗云', '金箍棒', '雷火'],
    elements: ['火', '风', '雷'],
    relationshipProfile: {
      love: '不善表达',
      authority: '强烈对抗',
      friends: '护短',
      enemies: '正面碾压',
    },
    timeline: [
      { title: '学艺成仙', summary: '形成强大自我与无边野心。' },
      { title: '取经路', summary: '被责任与秩序重新塑形。' },
    ],
  },
  {
    id: 3,
    slug: 'cao-cao',
    name: '曹操',
    summary: '以秩序与控制对抗乱世的人。',
    oneLineDefinition: '他宁可背负骂名，也不愿失去掌控局势的能力。',
    coreIdentity: '秩序塑造者',
    coreFear: '失控',
    coreConflict: '雄才与猜疑并存',
    emotionalTone: '冷锐压迫',
    type: '历史人物',
    workNames: ['三国语境'],
    workSlugs: ['records-of-the-three-kingdoms'],
    themeNames: ['权谋者', '冷感人物'],
    themeSlugs: ['schemers', 'cold-figures'],
    songSlugs: ['cao-cao-theme-v1'],
    hasSong: true,
    coverUrl: '/assets/images/characters/cao-cao.webp',
    status: 'published',
    primaryMotivation: '掌控、成事、建立秩序',
    dominantEmotions: ['压迫', '冷'],
    suppressedEmotions: ['不安'],
    valuesTags: ['秩序', '效率'],
    symbolicImages: ['黑甲', '夜营', '火把'],
    elements: ['火', '铁'],
    relationshipProfile: {
      authority: '主动成为 authority',
      enemies: '以控制和速度压制',
    },
    timeline: [{ title: '群雄并起', summary: '在乱局中快速塑造政治控制力。' }],
  },
];

const mockWorks: Work[] = [
  {
    id: 1,
    slug: 'dream-of-the-red-chamber',
    title: '红楼梦',
    summary: '家族盛衰与真情消逝。',
    coverUrl: '/assets/images/works/dream-of-the-red-chamber.webp',
    status: 'published',
    workTypeCode: 'novel',
    creatorSlugs: ['cao-xueqin'],
  },
  {
    id: 2,
    slug: 'journey-to-the-west',
    title: '西游记',
    summary: '神魔冒险与修行之路。',
    coverUrl: '/assets/images/works/journey-to-the-west.webp',
    status: 'published',
    workTypeCode: 'novel',
    creatorSlugs: ['wu-chengen'],
  },
  {
    id: 3,
    slug: 'records-of-the-three-kingdoms',
    title: '三国语境',
    summary: '战争、秩序、野心与猜疑。',
    coverUrl: '/assets/images/works/records-of-the-three-kingdoms.webp',
    status: 'published',
    workTypeCode: 'history',
    creatorSlugs: ['chen-shou'],
  },
];

const mockCreators: Creator[] = [
  {
    id: 1,
    slug: 'cao-xueqin',
    name: '曹雪芹',
    summary: '中国古典文学作家。',
    coverUrl: '/assets/images/creators/cao-xueqin.webp',
    status: 'published',
    creatorTypeCode: 'author',
    workSlugs: ['dream-of-the-red-chamber'],
  },
  {
    id: 2,
    slug: 'wu-chengen',
    name: '吴承恩',
    summary: '中国古典文学作家。',
    coverUrl: '/assets/images/creators/wu-chengen.webp',
    status: 'published',
    creatorTypeCode: 'author',
    workSlugs: ['journey-to-the-west'],
  },
  {
    id: 3,
    slug: 'chen-shou',
    name: '陈寿',
    summary: '史家。',
    coverUrl: '/assets/images/creators/chen-shou.webp',
    status: 'published',
    creatorTypeCode: 'historian',
    workSlugs: ['records-of-the-three-kingdoms'],
  },
];

const mockThemes: Theme[] = [
  {
    id: 1,
    slug: 'tragic',
    name: '悲剧人格',
    summary: '内在真实与命运难以相容。',
    coverUrl: '/assets/images/themes/tragic.webp',
    status: 'published',
    code: 'tragic',
    subjectType: 'character',
    category: 'destiny',
    characterSlugs: ['lin-daiyu'],
  },
  {
    id: 2,
    slug: 'rebels',
    name: '反叛者',
    summary: '拒绝被不合理秩序驯服。',
    coverUrl: '/assets/images/themes/rebels.webp',
    status: 'published',
    code: 'rebels',
    subjectType: 'character',
    category: 'psychology',
    characterSlugs: ['sun-wu-kong'],
  },
  {
    id: 3,
    slug: 'guardians',
    name: '守护者',
    summary: '承担责任直到耗尽。',
    coverUrl: '/assets/images/themes/guardians.webp',
    status: 'published',
    code: 'guardians',
    subjectType: 'character',
    category: 'psychology',
    characterSlugs: [],
  },
];

const mockSongs: Song[] = [
  {
    id: 1,
    slug: 'lin-daiyu-theme-v1',
    title: '林黛玉之歌',
    characterName: '林黛玉',
    characterSlug: 'lin-daiyu',
    summary: '清冷哀愁的真情独白。',
    coreTheme: '真情无所安放',
    styles: ['国风', '抒情'],
    emotionalCurve: ['压抑', '柔痛', '余冷'],
    coverUrl: '/assets/images/songs/lin-daiyu-theme-v1.webp',
    audioUrl: '/assets/audio/lin-daiyu-theme-v1.mp3',
    status: 'published',
    prompt: '林黛玉人物之歌生成提示词',
    lyrics: '落花无声...',
  },
  {
    id: 2,
    slug: 'sun-wu-kong-theme-v1',
    title: '孙悟空之歌',
    characterName: '孙悟空',
    characterSlug: 'sun-wu-kong',
    summary: '不服与守护交织的火焰。',
    coreTheme: '自由与责任',
    styles: ['摇滚', '热血'],
    emotionalCurve: ['躁动', '爆发', '再燃'],
    coverUrl: '/assets/images/songs/sun-wu-kong-theme-v1.webp',
    audioUrl: '/assets/audio/sun-wu-kong-theme-v1.mp3',
    status: 'published',
    prompt: '孙悟空人物之歌生成提示词',
    lyrics: '雷火穿云...',
  },
  {
    id: 3,
    slug: 'cao-cao-theme-v1',
    title: '曹操之歌',
    characterName: '曹操',
    characterSlug: 'cao-cao',
    summary: '秩序与权力的夜营回响。',
    coreTheme: '宁负天下',
    styles: ['史诗', '暗色'],
    emotionalCurve: ['审势', '压境', '余震'],
    coverUrl: '/assets/images/songs/cao-cao-theme-v1.webp',
    audioUrl: '/assets/audio/cao-cao-theme-v1.mp3',
    status: 'published',
    prompt: '曹操人物之歌生成提示词',
    lyrics: '夜营无眠...',
  },
];

export const dicts = {
  characterTypes: [
    { code: 'historical', name: '历史人物' },
    { code: 'literary', name: '文学人物' },
    { code: 'film_tv', name: '影视人物' },
    { code: 'anime', name: '动漫人物' },
  ],
  workTypes: [
    { code: 'novel', name: '小说' },
    { code: 'history', name: '历史语境' },
    { code: 'anime', name: '动漫作品' },
  ],
  creatorTypes: [
    { code: 'author', name: '作者' },
    { code: 'director', name: '导演' },
    { code: 'historian', name: '史家' },
  ],
  regions: [
    { code: 'china', name: '中国' },
    { code: 'japan', name: '日本' },
    { code: 'russia', name: '俄罗斯' },
  ],
  culturalRegions: [
    { code: 'literature', name: '文学' },
    { code: 'film_tv', name: '影视' },
    { code: 'anime', name: '动漫' },
    { code: 'history', name: '历史' },
  ],
  motivations: [
    { code: 'freedom', name: '自由' },
    { code: 'control', name: '控制' },
    { code: 'love', name: '爱' },
    { code: 'recognition', name: '认可' },
    { code: 'justice', name: '正义' },
  ],
  themeCategories: [
    { code: 'psychology', name: '心理结构' },
    { code: 'destiny', name: '命运气候' },
  ],
  emotionTemperatures: [
    { code: 'low', name: '冷' },
    { code: 'mid', name: '中' },
    { code: 'high', name: '热' },
  ],
  genders: [
    { code: 'male', name: '男' },
    { code: 'female', name: '女' },
    { code: 'unknown', name: '未知' },
  ],
};

const delay = async <T>(data: T) => {
  await new Promise((r) => setTimeout(r, 80));
  return data;
};
const USE_MOCK = import.meta.env.VITE_PM_ADMIN_USE_MOCK !== 'false';
const API_BASE = import.meta.env.VITE_PM_ADMIN_API_BASE_URL || '/api/v1/admin';

type ApiEnvelope<T> = { code: number; data: T; message: string; meta?: any };
type ListEnvelope<T> = { list: T[] };

async function tryApi<T>(
  method: 'delete' | 'get' | 'patch' | 'post',
  url: string,
  payload?: any,
): Promise<null | T> {
  if (USE_MOCK) return null;
  try {
    let res: any;
    if (method === 'get') res = await requestClient.get<ApiEnvelope<T>>(url);
    if (method === 'post')
      res = await requestClient.post<ApiEnvelope<T>>(url, payload);
    if (method === 'patch')
      res = await requestClient.request<ApiEnvelope<T>>(url, {
        data: payload,
        method: 'PATCH',
      });
    if (method === 'delete')
      res = await requestClient.delete<ApiEnvelope<T>>(url);
    return res?.data ?? null;
  } catch (error) {
    console.warn('[pm-admin] api fallback to mock:', method, url, error);
    return null;
  }
}

const nextId = (list: Array<{ id?: number }>) =>
  Math.max(0, ...list.map((i) => i.id || 0)) + 1;

export const getDashboardStats = async () => {
  const data = await tryApi<typeof dashboardStats>(
    'get',
    `${API_BASE}/dashboard/stats`,
  );
  return delay(data ?? dashboardStats);
};

export const getCharacters = async () => {
  const data = await tryApi<Character[] | ListEnvelope<Character>>(
    'get',
    `${API_BASE}/characters`,
  );
  const list = Array.isArray(data) ? data : data?.list;
  return delay(list ?? mockCharacters);
};
export const getCharacter = async (id: string) => {
  const data = await tryApi<Character>('get', `${API_BASE}/characters/${id}`);
  return delay(
    data ??
      mockCharacters.find((i) => String(i.id) === String(id) || i.slug === id),
  );
};
export const createCharacter = async (
  payload: Character | Record<string, any>,
) => {
  const data = await tryApi<Character>(
    'post',
    `${API_BASE}/characters`,
    payload,
  );
  if (data) return data;
  const item = {
    ...payload,
    id: nextId(mockCharacters),
    hasSong: !!(payload as any).songSlugs?.length,
    type: (payload as any).type || '文学人物',
    workNames: (payload as any).workNames || [],
    themeNames: (payload as any).themeNames || [],
    status: 'draft',
  } as Character;
  mockCharacters.unshift(item);
  return delay(item);
};
export const updateCharacter = async (
  id: string,
  payload: Character | Record<string, any>,
) => {
  const data = await tryApi<Character>(
    'patch',
    `${API_BASE}/characters/${id}`,
    payload,
  );
  if (data) return data;
  const idx = mockCharacters.findIndex(
    (i) => String(i.id) === String(id) || i.slug === id,
  );
  if (idx !== -1)
    mockCharacters[idx] = { ...mockCharacters[idx], ...(payload as any) };
  return delay(mockCharacters[idx]);
};
export const deleteCharacter = async (id: string) => {
  const data = await tryApi<any>('delete', `${API_BASE}/characters/${id}`);
  if (data) return data;
  const idx = mockCharacters.findIndex(
    (i) => String(i.id) === String(id) || i.slug === id,
  );
  if (idx !== -1) mockCharacters.splice(idx, 1);
  return delay({ success: true });
};

export const getWorks = async () => {
  const data = await tryApi<ListEnvelope<Work> | Work[]>(
    'get',
    `${API_BASE}/works`,
  );
  const list = Array.isArray(data) ? data : data?.list;
  return delay(list ?? mockWorks);
};
export const getWork = async (id: string) => {
  const data = await tryApi<Work>('get', `${API_BASE}/works/${id}`);
  return delay(
    data ?? mockWorks.find((i) => String(i.id) === String(id) || i.slug === id),
  );
};

export const getCreators = async () => {
  const data = await tryApi<Creator[] | ListEnvelope<Creator>>(
    'get',
    `${API_BASE}/creators`,
  );
  const list = Array.isArray(data) ? data : data?.list;
  return delay(list ?? mockCreators);
};
export const getCreator = async (id: string) => {
  const data = await tryApi<Creator>('get', `${API_BASE}/creators/${id}`);
  return delay(
    data ??
      mockCreators.find((i) => String(i.id) === String(id) || i.slug === id),
  );
};

export const getThemes = async () => {
  const data = await tryApi<ListEnvelope<Theme> | Theme[]>(
    'get',
    `${API_BASE}/themes`,
  );
  const list = Array.isArray(data) ? data : data?.list;
  return delay(list ?? mockThemes);
};
export const getTheme = async (id: string) => {
  const data = await tryApi<Theme>('get', `${API_BASE}/themes/${id}`);
  return delay(
    data ??
      mockThemes.find((i) => String(i.id) === String(id) || i.slug === id),
  );
};
export const createTheme = async (payload: Record<string, any> | Theme) => {
  const data = await tryApi<Theme>('post', `${API_BASE}/themes`, payload);
  if (data) return data;
  const item = { ...payload, id: nextId(mockThemes), status: 'draft' } as Theme;
  mockThemes.unshift(item);
  return delay(item);
};
export const updateTheme = async (
  id: string,
  payload: Record<string, any> | Theme,
) => {
  const data = await tryApi<Theme>(
    'patch',
    `${API_BASE}/themes/${id}`,
    payload,
  );
  if (data) return data;
  const idx = mockThemes.findIndex(
    (i) => String(i.id) === String(id) || i.slug === id,
  );
  if (idx !== -1) mockThemes[idx] = { ...mockThemes[idx], ...(payload as any) };
  return delay(mockThemes[idx]);
};
export const deleteTheme = async (id: string) => {
  const data = await tryApi<any>('delete', `${API_BASE}/themes/${id}`);
  if (data) return data;
  const idx = mockThemes.findIndex(
    (i) => String(i.id) === String(id) || i.slug === id,
  );
  if (idx !== -1) mockThemes.splice(idx, 1);
  return delay({ success: true });
};

export const getSongs = async () => {
  const data = await tryApi<ListEnvelope<Song> | Song[]>(
    'get',
    `${API_BASE}/songs`,
  );
  const list = Array.isArray(data) ? data : data?.list;
  return delay(list ?? mockSongs);
};
export const getSong = async (id: string) => {
  const data = await tryApi<Song>('get', `${API_BASE}/songs/${id}`);
  return delay(
    data ?? mockSongs.find((i) => String(i.id) === String(id) || i.slug === id),
  );
};
export const createSong = async (payload: Record<string, any> | Song) => {
  const data = await tryApi<Song>('post', `${API_BASE}/songs`, payload);
  if (data) return data;
  const item = {
    ...payload,
    id: nextId(mockSongs),
    status: 'draft',
    characterName:
      (payload as any).characterName || (payload as any).characterSlug || '',
  } as Song;
  mockSongs.unshift(item);
  return delay(item);
};
export const updateSong = async (
  id: string,
  payload: Record<string, any> | Song,
) => {
  const data = await tryApi<Song>('patch', `${API_BASE}/songs/${id}`, payload);
  if (data) return data;
  const idx = mockSongs.findIndex(
    (i) => String(i.id) === String(id) || i.slug === id,
  );
  if (idx !== -1) mockSongs[idx] = { ...mockSongs[idx], ...(payload as any) };
  return delay(mockSongs[idx]);
};
export const deleteSong = async (id: string) => {
  const data = await tryApi<any>('delete', `${API_BASE}/songs/${id}`);
  if (data) return data;
  const idx = mockSongs.findIndex(
    (i) => String(i.id) === String(id) || i.slug === id,
  );
  if (idx !== -1) mockSongs.splice(idx, 1);
  return delay({ success: true });
};

export const getDicts = async () => delay(dicts);
