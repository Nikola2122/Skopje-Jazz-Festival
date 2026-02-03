<template>
  <div class="card">
    <h3>{{ event.title }}</h3>
    <p>{{ event.date }}</p>
    <p>{{ event.location }}</p>
    <button>Details</button>
  </div>
</template>

<script setup>
defineProps({
  event: Object
})
</script>

<style scoped>
.card {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s, border 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  border: 1px solid var(--accent);
}

h3 {
  margin: 0;
  color: var(--accent);
}

p {
  margin: 0;
  color: var(--text-main);
  font-size: 14px;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  background-color: var(--accent);
  color: var(--text-main);
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  opacity: 0.9;
}
</style>