<template>
  <section class="contact-page">
    <h2>Contact Us</h2>
    <p>Have questions? Reach out to us!</p>

    <form @submit.prevent="submitForm">
      <input type="text" placeholder="Your Name" v-model="name" required />
      <input type="email" placeholder="Your Email" v-model="email" required />
      <textarea placeholder="Your Message" v-model="message" required></textarea>
      <button type="submit">Send Message</button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

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
  max-width: 600px;
  margin: 60px auto;
  padding: 0 20px;
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
</style>