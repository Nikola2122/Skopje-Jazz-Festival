<template>
    <section class="login-page">
        <div class="login-card">
            <h2>CREATE ACCOUNT</h2>
            <p>Sign up to get started</p>

            <form @submit.prevent="signup">
                <input v-model="email" type="email" placeholder="Email"/>
                <input v-model="password" type="password" placeholder="Password"/>
                <input v-model="confirmPassword" type="password" placeholder="Confirm Password"/>
                <button type="submit">Sign Up</button>
            </form>


            <p v-if="error" class="error">{{ error }}</p>


            <div class="signup-link">
                <span>Already have an account?</span>
                <button class="secondary" @click="goToLogin">
                    Login
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {createUserWithEmailAndPassword, signOut} from 'firebase/auth'
import {auth} from "@/firebase/firebase.js";
import {addUserToDb} from "@/firebase/utils/services.js";

const router = useRouter();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref('');

const signup = async () => {
    if (password.value !== confirmPassword.value) {
        error.value = 'Please enter the same password'
    } else {
        let userCredential
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        } catch (err) {
            console.error(err);
            error.value = err.message || "Signup failed";

            return;
        }

        try {
            await addUserToDb(userCredential.user.uid);
            await signOut(auth);
            router.push({
                name: "UserLogin",
                query: { success: true }
            })
        } catch (err) {
            console.error(err);
            error.value = err.message || "Could not save user data";
        } finally {
            password.value = "";
            confirmPassword.value = "";
            email.value = "";
        }

    }
}

const goToLogin = () => {
    router.push('/user/login')
};
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

.login-card p.error {
    color: red;
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
