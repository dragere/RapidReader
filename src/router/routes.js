
const routes = [
  {
    path: '/:readText?',
    // component: () => import('layouts/MainLayout.vue'),
    // children: [
    //   { path: '', component: () => import('pages/Index.vue') }
    // ]
    component: () => import('pages/Index.vue'),
    props: true
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
