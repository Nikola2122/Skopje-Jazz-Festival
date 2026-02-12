<template>
    <button class="logout-btn" @click="logout">Log Out</button>
</template>

<script setup>
import {signOut} from 'firebase/auth'
import {auth} from '@/firebase/firebase.js'
import {useRouter} from "vue-router"

const router = useRouter()
const logout = async () => {
    try {
        await signOut(auth)
        router.push('/')
    }catch(error) {
        console.log(error)
    }
}
</script>

<style scoped>
.logout-btn {
    padding: 10px 24px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #ff4d4f, #ff1a1a);
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
    transition: all 0.2s ease;
}

.logout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 77, 79, 0.5);
    background: linear-gradient(135deg, #ff1a1a, #ff4d4f);
}

.logout-btn:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
}
</style>