<template>
  <section class="program">
    <header class="program-header">
      <h2>Festival Program</h2>
      <p>Explore the full schedule of performances and events</p>
    </header>

    <div class="events-grid">
      <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
      />
    </div>
  </section>
</template>

<script setup>
import EventCard from '@/components/EventCard.vue'

const events = [
  { id: 1, title: 'Opening Night', date: '12 Oct', location: 'Main Hall' },
  { id: 2, title: 'Jazz Trio Live', date: '13 Oct', location: 'Stage A' },
  { id: 3, title: 'Saxophone Night', date: '14 Oct', location: 'Stage B' }
]
</script>

<style scoped>
.program {
  flex: 1;
  padding: 80px 40px;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1),
      transparent
  );
}

.program-header {
  text-align: center;
  margin-bottom: 50px;
}

.program-header h2 {
  font-size: 36px;
  color: var(--accent);
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.program-header p {
  color: var(--text-muted);
  font-size: 15px;
  max-width: 560px;
  margin: 0 auto;
}

.events-grid {
  display: grid;
  gap: 26px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

/* subtle entrance animation */
.events-grid > * {
  animation: fadeUp 0.4s ease forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
