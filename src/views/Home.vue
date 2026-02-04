<template>
  <HeroSection />

  <section class="preview-events">
    <div class="header">
      <h2>Upcoming Events</h2>
      <p>Experience the best moments of this year’s jazz festival</p>
    </div>

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
  padding: 90px 30px;
  position: relative;
  background:
      radial-gradient(
          circle at top,
          rgba(255, 255, 255, 0.03),
          transparent 60%
      ),
      linear-gradient(
          to bottom,
          transparent,
          rgba(0, 0, 0, 0.18)
      );
}

/* soft divider from hero */
.preview-events::before {
  content: "";
  position: absolute;
  top: -40px;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(
      to bottom,
      transparent,
      var(--bg-main)
  );
}

.header {
  text-align: center;
  margin-bottom: 55px;
}

.preview-events h2 {
  font-size: 36px;
  margin-bottom: 12px;
  color: var(--accent);
  letter-spacing: 1.2px;
}

.header p {
  color: var(--text-muted);
  font-size: 15px;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}

.events-grid {
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

/* stagger animation */
.events-grid > * {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
}

.events-grid > *:nth-child(1) { animation-delay: 0.05s }
.events-grid > *:nth-child(2) { animation-delay: 0.15s }
.events-grid > *:nth-child(3) { animation-delay: 0.25s }
.events-grid > *:nth-child(4) { animation-delay: 0.35s }

/* card glow without touching EventCard */
.events-grid > *:hover {
  filter: drop-shadow(0 0 12px rgba(255, 200, 80, 0.15));
}

/* animation */
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
