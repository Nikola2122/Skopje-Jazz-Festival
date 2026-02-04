<template>
  <div class="card">
    <!-- Image -->
    <div class="image-wrapper">
      <img
          :src="event.image || fallbackImage"
          alt="Event image"
      />
    </div>

    <div class="card-content">
      <h3>{{ event.title }}</h3>

      <div class="meta">
        <span>{{ event.date }}</span>
        <span class="dot">•</span>
        <span>{{ event.location }}</span>
      </div>
    </div>

    <button @click="showModal = true">View details</button>

    <Details
        :event="event"
        :showModal="showModal"
        @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Details from '@/components/Details.vue'

defineProps({
  event: {
    type: Object,
    required: true
  }
})

const showModal = ref(false)

const fallbackImage =
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80'
</script>

<style scoped>
.card {
  background: linear-gradient(
      145deg,
      var(--bg-secondary),
      rgba(255, 255, 255, 0.02)
  );
  padding: 22px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 18px;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  border-color: var(--accent);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
}

/* Image */
.image-wrapper {
  width: 100%;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .image-wrapper img {
  transform: scale(1.06);
}

/* Content */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

h3 {
  margin: 0;
  font-size: 18px;
  color: var(--accent);
  letter-spacing: 0.5px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
}

.dot {
  opacity: 0.6;
}

/* Button */
button {
  align-self: flex-start;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

button:hover {
  background: var(--accent);
  color: var(--bg-main);
}
</style>
