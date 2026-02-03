import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Program from '@/views/Program.vue'
import Contact from "@/views/Contact.vue";
import About from "@/views/About.vue";
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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router