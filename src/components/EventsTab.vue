<template>
    <div class="events-tab">
        <EACard
            v-for="event in eventsStore.events"
            :key="event.id"
            :Event="event"
        />
    </div>
</template>

<script setup>
import {onMounted} from "vue";
import {useEventsStore} from "@/pinia/events.js";
import EACard from "@/components/EACard.vue";

const eventsStore = useEventsStore();

onMounted(() => {
    if (eventsStore.events.length === 0) {
        eventsStore.fetchEvents()
    }
    console.log(eventsStore.events);
})
</script>

<style scoped>
.events-tab {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
</style>
