<template>
    <section class="login-page">
        <div class="login-card">
            <h2>ADMIN PANEL</h2>
            <p>Sign in to access the admin panel</p>

            <form @submit.prevent="login">
                <input v-model="email" type="email" placeholder="Email"/>
                <input v-model="password" type="password" placeholder="Password"/>
                <button type="submit">Login</button>
            </form>


            <p v-if="error" style="color:red; margin-top:10px">{{ error }}</p>
        </div>
    </section>
</template>

<script setup>
import {computed, ref} from "vue";
import {auth} from "@/firebase/firebase.js";
import {signInWithEmailAndPassword, signOut} from 'firebase/auth'
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import {hasRole} from "@/firebase/utils/services.js";


const email = ref('')
const password = ref('')
const localError = ref('')
const route = useRoute()

const routeError = computed(() => route.query.error || null)

const error = computed(() => {
    return routeError.value || localError.value
})


const login = async () => {

    error.value = null
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        const isAdmin = await hasRole(user.uid, 'admin');
        if (!isAdmin) {
            await signOut(auth)
            await router.push({
                name: 'AdminLogin',
                query: { error: 'Not authorized' }
            });
            return;
        }
        console.log("Logged in as:", user.email);

        await router.push("/admin");
    } catch (err) {
        console.error(err);
        localError.value = err.message;
    }
}

</script>

<style scoped>
.login-page {
    margin-top: -100px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent 60%),
    linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.18));
}

.login-card {
    background: var(--bg-main);
    padding: 50px 30px;
    border-radius: 16px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
    text-align: center;
    max-width: 400px;
    width: 100%;
    animation: fadeUp 0.6s ease forwards;
}

.login-card h2 {
    color: var(--accent);
    font-size: 32px;
    margin-bottom: 12px;
}

.login-card p {
    color: var(--text-muted);
    font-size: 15px;
    margin-bottom: 30px;
}

.login-card form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.login-card input {
    padding: 14px 16px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
    font-size: 15px;
    transition: all 0.2s;
}

.login-card input:focus {
    outline: none;
    border-color: var(--accent);
    background: rgba(255, 255, 255, 0.08);
}

.login-card button {
    padding: 14px 0;
    border-radius: 10px;
    border: none;
    background: var(--accent);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.login-card button:hover {
    filter: drop-shadow(0 0 12px rgba(255, 200, 80, 0.3));
}

.login-links {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.login-links .secondary {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.login-links .secondary:hover {
    color: var(--accent);
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
