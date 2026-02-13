<template>
    <section class="login-page">
        <div class="login-card">
            <h2>WELCOME BACK</h2>
            <p>Sign in to your account</p>
            <p v-if="success" class="success">
                Your account has been created successfully. You can log in now.
            </p>

            <form @submit.prevent="login">
                <input v-model="email" type="email" placeholder="Email" />
                <input v-model="password" type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>

            <!-- error message -->
            <p v-if="error" class="error">{{ error }}</p>

            <!-- signup link -->
            <div class="signup-link">
                <span>Don’t have an account?</span>
                <button class="secondary" @click="goToSignup">
                    Sign up
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref} from "vue";
import {auth} from "@/firebase/firebase.js";
import {signInWithEmailAndPassword} from 'firebase/auth'
import router from "@/router/index.js";


const email = ref('')
const password = ref('')
const error = ref(null)
defineProps({
    success: Boolean
})

const login = async () => {

    error.value = null
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        console.log("Logged in as:", user.email);

        await router.push("/user/events");
    } catch (err) {
        console.error(err);
        error.value = err.message;
    }
}

const goToSignup = () => {
    router.push("/user/signup")
};
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent 60%),
    linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.18));
}

.login-card p.success {
    margin: -10px 0 22px;
    padding: 12px 14px;
    border-radius: 10px;

    background: rgba(60, 180, 120, 0.12);
    border: 1px solid rgba(60, 180, 120, 0.35);
    color: #3cb478;

    font-size: 14px;
    line-height: 1.4;
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

.error {
    color: red;
    margin-top: 12px;
}

.signup-link {
    margin-top: 26px;
    display: flex;
    justify-content: center;
    gap: 6px;
    align-items: center;
    color: var(--text-muted);
    font-size: 14px;
}

.signup-link .secondary {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 14px;
    padding: 0;
}

.signup-link .secondary:hover {
    text-decoration: underline;
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
