import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Program from '@/views/Program.vue'
import Contact from "@/views/Contact.vue";
import About from "@/views/About.vue";
import AdminLogin from "@/views/AdminLogin.vue";
import {auth} from "@/firebase/firebase.js";
import {onAuthStateChanged} from 'firebase/auth'
import AdminPanel from "@/views/AdminPanel.vue";
import AddArtist from "@/views/AddArtist.vue";
import AddEvent from "@/views/AddEvent.vue";
import UserLogin from "@/views/UserLogin.vue";
import SignUpPage from "@/views/SignUpPage.vue";
import {hasRole} from "@/firebase/utils/services.js";
import UserEvents from "@/views/UserEvents.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/program',
        name: 'Program',
        component: Program
    },
    {   path: '/contact',
        name: 'Contact',
        component: Contact
    },
    {   path: '/about',
        name: 'About',
        component: About
    },
    {   path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin,
        props: true
    },
    {   path: '/admin',
        name: 'AdminPanel',
        component: AdminPanel,
        props: true
    },
    {   path: '/add/artist',
        name: 'AddArtist',
        component: AddArtist,
    },
    {   path: '/add/event',
        name: 'AddEvent',
        component: AddEvent,
    },
    {   path: '/user/login',
        name: 'UserLogin',
        component: UserLogin,
        props: true
    },
    {   path: '/user/signup',
        name: 'UserSignup',
        component: SignUpPage,
    },
    {   path: '/user/events',
        name: 'UserEvents',
        component: UserEvents,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const user = auth.currentUser

    let isAdmin = false

    if (user) {
        try {
            isAdmin = await hasRole(user.uid, 'admin')
        } catch (err) {
            console.error('Role check failed', err)
        }
    }


    if (
        to.path === '/admin' ||
        to.path === '/add/artist' ||
        to.path === '/add/event'
    ) {
        if (user && isAdmin) next()
        else next('/admin/login')
        return
    }


    if(to.path === '/user/events') {
        if (user && !isAdmin) next()
        else next('/user/login')
        return
    }


    if (to.path === '/admin/login') {
        if (user && isAdmin) next('/admin')
        else next()
        return
    }

    if (to.path === '/user/login') {
        if (user && !isAdmin) next('/user/events')
        else next()
        return
    }

    next()
})


export default router