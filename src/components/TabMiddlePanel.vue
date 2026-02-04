<template>
  <section class="middle-panel">
    <div class="tabs">
      <button
          :class="{ active: activeTab === 'artists' }"
          @click="activeTab = 'artists'"
      >
        Artists
      </button>
      <button
          :class="{ active: activeTab === 'events' }"
          @click="activeTab = 'events'"
      >
        Events
      </button>
    </div>

    <div class="tab-content">
      <ArtistsTab v-if="activeTab === 'artists'" />
      <EventsTab v-if="activeTab === 'events'" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ArtistsTab from '@/components/ArtistsTab.vue'
import EventsTab from '@/components/EventsTab.vue'

const activeTab = ref('artists')
</script>

<style scoped>
.middle-panel {
  max-width: 900px;
  margin: 40px auto;
  padding: 40px 20px;
  background: linear-gradient(145deg, var(--bg-secondary), rgba(255,255,255,0.02));
  border-radius: 18px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 36px;
}

.tabs button {
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabs button.active {
  background: var(--accent);
  color: var(--bg-main);
  box-shadow: 0 6px 18px rgba(255,200,80,0.3);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
