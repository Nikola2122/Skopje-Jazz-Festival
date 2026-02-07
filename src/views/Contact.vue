<template>
    <section class="contact-page">
        <div class="contact-wrapper">
            <div class="contact-left">
                <h2>Contact Us</h2>
                <p>Have questions? Reach out to us!</p>

                <form @submit.prevent="submitForm" class="contact-form">
                    <input type="text" placeholder="Your Name" v-model="name" required/>
                    <input type="email" placeholder="Your Email" v-model="email" required/>
                    <textarea placeholder="Your Message" v-model="message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>

            <div class="contact-info">

                <p>
                    📍 <strong>Address:</strong><br/>
                    Maksim Gorki 5,
                    1000 Skopje,
                    North Macedonia
                </p>

                <p>
                    📞 <strong>Phone:</strong><br/>
                    +389 (0)2 31 31 090
                </p>
                <p>
                    👤 <strong>Contact persons:</strong><br/>
                    OLIVER BELOPETA
                </p>
                <p>
                    ✉️ <strong>Email:</strong><br/>
                    sjf@skopjejazzfest.com.mk
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref} from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

function submitForm() {
    alert(`Thank you ${name.value}! Your message has been sent.`)
    name.value = ''
    email.value = ''
    message.value = ''
}
</script>

<style scoped>
.contact-page {
    max-width: 1200px;
    margin: 80px 0 80px 80px;
    padding-right: 40px;
    text-align: center;
}

.contact-page h2 {
    color: var(--accent);
    font-size: 32px;
    margin-bottom: 10px;
}

.contact-page p {
    color: var(--text-muted);
    margin-bottom: 30px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

input, textarea {
    padding: 12px;
    border: none;
    border-radius: 6px;
    background-color: var(--bg-secondary);
    color: var(--text-main);
    font-size: 14px;
    resize: none;
}

input:focus, textarea:focus {
    outline: 2px solid var(--accent);
}

input:hover,
textarea:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

button {
    padding: 12px;
    font-size: 16px;
    background-color: var(--accent);
    color: var(--text-main);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.2s;
}

button:hover {
    opacity: 0.9;
}

.contact-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-top: 50px;
    align-items: start;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.contact-info {
    background-color: var(--bg-secondary);
    padding: 10px;
    border-radius: 15px;
    min-height: 100%;
}

.contact-info h3 {
    color: var(--accent);
    margin-bottom: 30px;
    font-size: 26px;
}

.contact-info p {
    color: var(--text-muted);
    margin-bottom: 22px;
    line-height: 1.7;
    font-size: 22px;
}

.contact-left {
    max-width: 700px;
}

.contact-left h2 {
    color: var(--accent);
    font-size: 32px;
    margin-bottom: 10px;
}

.contact-left p {
    color: var(--text-muted);
    margin-bottom: 30px;
}

@media (max-width: 768px) {
    .contact-wrapper {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .contact-left {
        max-width: 100%;
        text-align: center;
    }

    .contact-info {
        text-align: center;
    }
}
</style>