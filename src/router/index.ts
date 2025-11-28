import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '新語市：職涯探索' }
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('@/views/GamePage.vue'),
    meta: { title: '探索旅程 - 新語市' }
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/ResultPage.vue'),
    meta: { title: '分析報告 - 新語市' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('@/views/TypeGallery.vue'),
    meta: { title: '人格圖鑑 - 新語市' }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('@/views/MyRecords.vue'),
    meta: { title: '我的紀錄 - 新語市' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 更新頁面標題
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = title
  }
  next()
})

export default router
