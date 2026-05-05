import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Courses from '../views/Courses.vue'
import About from '../views/About.vue'
import History from '../views/History.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import StartEnrollment from '../views/StartEnrollment.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import Enrollment from '../views/Enrollment.vue'
import Account from '../views/Account.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { layout: 'public', title: 'Home' } },
  {
    path: '/courses',
    name: 'courses',
    component: Courses,
    meta: { layout: 'public', title: 'Courses' },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { layout: 'public', title: 'About' },
  },
  {
    path: '/history',
    name: 'history',
    component: History,
    meta: { layout: 'public', title: 'History' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { layout: 'public', title: 'Contact' },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { layout: 'public', title: 'Login' },
  },
  {
    path: '/register',
    name: 'register',
    redirect: '/enrollment',
  },
  {
    path: '/start-enrollment',
    name: 'start-enrollment',
    redirect: '/enrollment',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: StudentDashboard,
    meta: { layout: 'dashboard', title: 'Student Dashboard' },
  },
  {
    path: '/enrollment',
    name: 'enrollment',
    component: Enrollment,
    meta: { layout: 'public', title: 'Enrollment Form' },
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    meta: { layout: 'dashboard', title: 'Account' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})

export default router
