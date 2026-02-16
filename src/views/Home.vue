<template>
    <HeroSection/>

    <section class="preview-events">
        <div class="header">
            <h2>Closest 3 Upcoming Events</h2>
            <p>Experience the best moments of this year’s jazz festival</p>
        </div>

        <Loading v-if="eventsStore.events.length === 0"/>
        <div v-if="eventsStore.events.length !== 0" class="events-grid">
            <EventCard v-for="event in eventsStore.events
                       .slice(0,3)
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
      <EventCalendar/>
    </section>
</template>

<script setup>
import HeroSection from '@/components/MainSection.vue'
import EventCard from '@/components/EventCard.vue'
import EventCalendar from "@/components/EventCalendar.vue";
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
.preview-events {
    padding: 90px 30px;
    position: relative;
    background: radial-gradient(
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

.events-grid > * {
    opacity: 0;
    animation: fadeUp 0.6s ease forwards;
}

.events-grid > *:nth-child(1) {
    animation-delay: 0.05s
}

.events-grid > *:nth-child(2) {
    animation-delay: 0.15s
}

.events-grid > *:nth-child(3) {
    animation-delay: 0.25s
}

.events-grid > *:nth-child(4) {
    animation-delay: 0.35s
}

.events-grid > *:hover {
    filter: drop-shadow(0 0 12px rgba(255, 200, 80, 0.15));
}

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
