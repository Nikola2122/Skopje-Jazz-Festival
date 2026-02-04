<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  event: {
    type: Object,
    required: true
  },
  showModal: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const handleEsc = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
          v-if="showModal"
          class="overlay"
          @click.self="emit('close')"
      >
        <div class="modal">
          <button class="close-icon" @click="emit('close')">✕</button>

          <h2>{{ event.title }}</h2>

          <div class="info">
            <p><strong>Date:</strong> {{ event.date }}</p>
            <p><strong>Location:</strong> {{ event.location }}</p>
          </div>

          <p class="demo-text">
            This is a demo popup with some extra info about the event.
            You can later replace this with artist details, lineup,
            or a description from Firebase.
          </p>

          <button class="close-btn" @click="emit('close')">
            Close
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Modal */
.modal {
  position: relative;
  background: var(--bg-secondary);
  padding: 28px;
  border-radius: 14px;
  width: 340px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* Close icon */
.close-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
}

.close-icon:hover {
  color: var(--accent);
}

/* Text */
h2 {
  margin: 0 0 10px;
  color: var(--accent);
}

.info {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.demo-text {
  font-size: 14px;
  color: var(--text-main);
  line-height: 1.5;
}

/* Close button */
.close-btn {
  margin-top: 18px;
  width: 100%;
  padding: 10px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--accent);
  color: var(--bg-main);
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
