<template>
  <HeroSection />

  <section class="preview-events">
    <h2>Upcoming Events</h2>
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
import HeroSection from '@/components/MainSection.vue'
import EventCard from '@/components/EventCard.vue'

const events = [
  { id: 1, title: 'Opening Night', date: '12 Oct', location: 'Main Hall' },
  { id: 2, title: 'Jazz Trio Live', date: '13 Oct', location: 'Stage A' },
  { id: 3, title: 'Saxophone Night', date: '14 Oct', location: 'Stage B' }
]
</script>

<style scoped>
.preview-events {
  padding: 60px 20px;
  text-align: center;
}

.preview-events h2 {
  font-size: 32px;
  margin-bottom: 30px;
  color: var(--accent);
}

.events-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>
