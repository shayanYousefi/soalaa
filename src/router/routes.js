import { auth } from './middleware/middleware'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          middlewares: [auth]
        }
      },
      {
        path: '/sub_category/edit',
        name: 'subCategory.edit',
        component: () => import('pages/Admin/subCategory/LessonsList'),
        meta: { middlewares: [auth] }
      },
      {
        path: '/coefficient/edit/:exam_id',
        name: 'coefficient.edit',
        component: () => import('src/pages/Admin/subGroup/editCoefficients.vue'),
        meta: {
          middlewares: [auth]
        }
      },
      {
        path: '/onlineQuiz/exams/lessons/:quizId/:quizTitle',
        name: 'onlineQuiz.exams.lessons',
        component: () => import('src/pages/Admin/exam/lessons.vue'),
        meta: {
          middlewares: [auth]
        }
      },
      // user list
      // admin list
      {
        path: 'exam-list',
        name: 'exam-list',
        component: () => import('pages/Admin/exam/index'),
        meta: {
          middlewares: [auth]
        },
        children: [
          {
            path: '',
            name: 'list',
            component: () => import('pages/Admin/exam/list'),
            meta: {
              middlewares: [auth]
            }
          },
          {
            path: 'edit-exam',
            name: 'edit-exam',
            component: () => import('pages/Admin/exam/edit/editExam'),
            meta: {
              middlewares: [auth]
            }
          },
          {
            path: ':examId/edit-exam-report',
            name: 'edit-exam-report',
            component: () => import('pages/Admin/exam/edit/editExamReport'),
            meta: {
              middlewares: [auth]
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Auth/Login.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Auth/Login.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('pages/Auth/test.vue'),
    meta: {
      middlewares: [auth]
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
