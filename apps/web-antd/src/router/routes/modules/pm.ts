import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Pm',
    path: '/pm',
    meta: {
      icon: 'heroicons-outline:collection',
      order: 90,
      title: '人物集管理',
    },
    children: [
      {
        name: 'PmCharacter',
        path: '/pm/character',
        meta: {
          icon: 'mdi:card-account-details-outline',
          title: '人物管理',
        },
        component: () => import('#/views/pm/character/list.vue'),
      },
      {
        name: 'PmWork',
        path: '/pm/work',
        meta: {
          icon: 'mdi:book-open-page-variant-outline',
          title: '作品管理',
        },
        component: () => import('#/views/pm/work/list.vue'),
      },
      {
        name: 'PmCreator',
        path: '/pm/creator',
        meta: {
          icon: 'mdi:account-edit-outline',
          title: '创作者管理',
        },
        component: () => import('#/views/pm/creator/list.vue'),
      },
      {
        name: 'PmSong',
        path: '/pm/song',
        meta: {
          icon: 'mdi:music-note-outline',
          title: '歌曲管理',
        },
        component: () => import('#/views/pm/song/list.vue'),
      },
      {
        name: 'PmRelation',
        path: '/pm/relation',
        meta: {
          icon: 'mdi:source-branch',
          title: '关系管理',
        },
        component: () => import('#/views/pm/relation/list.vue'),
      },
      {
        name: 'PmTheme',
        path: '/pm/theme',
        meta: {
          icon: 'mdi:shape-outline',
          title: '主题集管理',
        },
        component: () => import('#/views/pm/theme/list.vue'),
      },
      {
        name: 'PmDict',
        path: '/pm/dict',
        meta: {
          icon: 'mdi:format-list-bulleted-square',
          title: '字典数据',
        },
        component: () => import('#/views/pm/dict/list.vue'),
      },
      {
        name: 'PmImport',
        path: '/pm/import',
        meta: {
          icon: 'mdi:database-import-outline',
          title: '数据导入',
        },
        component: () => import('#/views/pm/import/page.vue'),
      },
    ],
  },
];

export default routes;
