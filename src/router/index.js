import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/functionalities/PacketCapture',
    name: 'PacketCapture',
    component: () => import(/* webpackChunkName: "packetCapture" */ '../views/functionalities/PacketCapture.vue')
  },
  {
    path: '/functionalities/CheckConn',
    name: 'CheckConn',
    component: () => import(/* webpackChunkName: "CheckConn" */ '../views/functionalities/CheckConn.vue')
  },
  {
    path: '/functionalities/PacketPath',
    name: 'PacketPath',
    component: () => import(/* webpackChunkName: "PacketPath" */ '../views/functionalities/PacketPath.vue')
  },
  {
    path: '/functionalities/FindDevices',
    name: 'FindDevices',
    component: () => import(/* webpackChunkName: "FindDevices" */ '../views/functionalities/FindDevices.vue')
  },
  {
    path: '/functionalities/ActiveSockets',
    name: 'ActiveSockets',
    component: () => import(/* webpackChunkName: "ActiveSockets" */ '../views/functionalities/ActiveSockets.vue')
  },
  {
    path: '/functionalities/TCPconcepts',
    name: 'TCPconcepts',
    component: () => import(/* webpackChunkName: "TCPconcepts" */ '../views/functionalities/TCPconcepts.vue')
  },
  {
    path: '/functionalities/MotherAllProblems',
    name: 'MotherAllProblems',
    component: () => import(/* webpackChunkName: "MotherAllProblems" */ '../views/functionalities/MotherAllProblems.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/grid',
    name: 'Grid',
    component: () => import(/* webpackChunkName: "about" */ '../views/Grid.vue')
  },
  {
    path: '/buttons',
    name: 'Buttons',
    component: () => import(/* webpackChunkName: "about" */ '../views/Buttons.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
