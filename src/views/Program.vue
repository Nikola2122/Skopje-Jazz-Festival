<template>
  <section class="program">
    <h2>Festival Program</h2>
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
  padding: 40px;
}

.events-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-top: 20px;
}
</style>