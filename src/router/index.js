import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Program from '@/views/Program.vue'
import Contact from "@/views/Contact.vue";
import About from "@/views/About.vue";
import LoginPage from "@/views/LoginPage.vue";
import {auth} from "@/firebase/firebase.js";
import {onAuthStateChanged} from 'firebase/auth'
import AdminPanel from "@/views/AdminPanel.vue";

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
    {   path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {   path: '/admin',
        name: 'AdminPanel',
        component: AdminPanel
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()

        if (to.path === '/admin') {
            if (user) next()
            else next('/login')
        }
        else if (to.path === '/login') {
            if (user) next('/admin')
            else next()
        }
        else {
            next()
        }
    })
})

export default router