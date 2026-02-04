<template>
  <div class="events-tab">
    <div v-for="event in events" :key="event.id" class="row-card">
      <div class="event-info">
        <h3>{{ event.title }}</h3>
        <p>{{ event.date }} — {{ event.location }}</p>
      </div>
      <button class="more-btn">Details</button>
    </div>
  </div>
</template>

<script setup>
const events = [
  { id: 1, title: 'Opening Night', date: '12 Oct', location: 'Main Hall' },
  { id: 2, title: 'Jazz Trio Live', date: '13 Oct', location: 'Stage A' },
  { id: 3, title: 'Saxophone Night', date: '14 Oct', location: 'Stage B' }
]
</script>

<style scoped>
.events-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.row-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255,200,80,0.2);
}

.event-info h3 {
  font-size: 18px;
  margin-bottom: 4px;
  color: var(--accent);
}

.event-info p {
  font-size: 14px;
  color: var(--text-muted);
}

.more-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.more-btn:hover {
  filter: drop-shadow(0 0 12px rgba(255,200,80,0.4));
}
</style>
