<template>
    <section class="program">
        <header class="program-header">
            <h2>Festival Program</h2>
            <p>Explore the full schedule of performances and events</p>
        </header>

        <Loading v-if="eventsStore.events.length === 0" />
        <div v-if="eventsStore.events.length !== 0" class="events-grid">
            <EventCard v-for="event in eventsStore.events
                       .slice()
                       .filter((e)=>
                {
                const loc = (e?.Location ?? '').toString().toLowerCase();
                return loc.includes('skopje') || loc.includes('скопје');
                })
                .filter((e) => {
                const parseDate = (str) => {
                if (!str || typeof str !== 'string') return null;
                const s = str.trim();
                if (!s || s.toUpperCase() === 'TBA') return null;

                // dd/mm/yyyy
                if (s.includes('/')) {
                const [day, month, year] = s.split('/').map(Number);
                if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                return new Date(year, month - 1, day);
                }
                }

                // dd-mm-yyyy OR yyyy-mm-dd
                if (s.includes('-')) {
                const raw = s.split('-');
                const parts = raw.map(Number);
                if (parts.length === 3) {
                if (raw[0].length === 4) {
                const [year, month, day] = parts;
                if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                return new Date(year, month - 1, day);
                }
                } else {
                const [day, month, year] = parts;
                if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                return new Date(year, month - 1, day);
                }
                }
                }
                }

                const d = new Date(s);
                return Number.isNaN(d.getTime()) ? null : d;
                };

                const d = parseDate(e.Date);
                if (!d) return false;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                d.setHours(0, 0, 0, 0);

                return d >= today;
                })
                .sort((a, b) => {
                const parseDate = (str) => {
                if (!str || typeof str !== 'string') return new Date(0);
                const s = str.trim();
                if (!s || s.toUpperCase() === 'TBA') return new Date(0);

                if (s.includes('/')) {
                const [day, month, year] = s.split('/').map(Number);
                if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                return new Date(year, month - 1, day);
                }
                }

                if (s.includes('-')) {
                const raw = s.split('-');
                const parts = raw.map(Number);
                if (parts.length === 3) {
                if (raw[0].length === 4) {
                const [year, month, day] = parts;
                if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                return new Date(year, month - 1, day);
                }
                } else {
                const [day, month, year] = parts;
                if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                return new Date(year, month - 1, day);
                }
                }
                }
                }

                const d = new Date(s);
                return Number.isNaN(d.getTime()) ? new Date(0) : d;
                };

                return parseDate(b.Date) - parseDate(a.Date);
                })"
                :key="event.id"
                :Event="event"
                />
</div>
    </section>
</template>

<script setup>
import EventCard from '@/components/EventCard.vue'
import {useEventsStore} from "@/pinia/events.js";
import {onMounted} from "vue";
import Loading from "@/components/Loading.vue";
const eventsStore = useEventsStore();

onMounted(() => {
    if (eventsStore.events.length === 0) {
        eventsStore.fetchEvents()
    }
    console.log(eventsStore.events);
})
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

.events-grid {
    display: grid;
    gap: 26px;
    grid-template-columns: repeat(4, 1fr);
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
