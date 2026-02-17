<template>
    <section class="user-events">
        <div class="header-top">
            <LogOut toWhere="/user/login"/>
        </div>

        <header class="user-events-header">
            <h2>My Events</h2>
            <p>Manage events you are interested in and discover new ones</p>
        </header>

        <Loading v-if="!currentUser || loading || eventsStore.events.length === 0" />

        <div v-else>
            <!-- Interested Events -->
            <div v-if="interestedEvents.length">
                <h3>Events You're Interested In</h3>
                <div class="events-grid">
                    <EventCard
                        v-for="event in interestedEvents"
                        :key="event.id"
                        :Event="event"
                        :class="{ conflict: dateConflict[event.DateKey] }"
                        @uninterested="removeFromInterested(event.id)"
                    />
                </div>
            </div>

            <!-- Suggested Events -->
            <div v-if="suggestedEvents.length" style="margin-top: 50px;">
                <h3>Suggested Events</h3>
                <div class="events-grid">
                    <EventCard
                        v-for="event in suggestedEvents"
                        :key="event.id"
                        :Event="event"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { auth } from '@/firebase/firebase.js';
import { hasRole } from '@/firebase/utils/services.js';
import { useEventsStore } from '@/pinia/events.js';
import EventCard from '@/components/EventCard.vue';
import Loading from '@/components/Loading.vue';
import LogOut from "@/components/LogOut.vue";

const eventsStore = useEventsStore();
const currentUser = ref(auth.currentUser);
const loading = ref(true);
const canShow = ref(false);

onMounted(async () => {
    auth.onAuthStateChanged(async (user) => {
        currentUser.value = user;
        if (user) canShow.value = await hasRole(user.uid, 'user');
        if (eventsStore.events.length === 0) await eventsStore.fetchEvents();
        loading.value = false;
    });
});

// ----------------------------
// Date parsing and DateKey
// ----------------------------
const parseEventDate = (str) => {
    if (!str) return null;
    const s = str.trim();
    if (s.includes('/')) {
        const [d, m, y] = s.split('/').map(Number);
        return new Date(y, m - 1, d);
    } else if (s.includes('-')) {
        const parts = s.split('-').map(Number);
        if (parts[0] > 1000) return new Date(parts[0], parts[1] - 1, parts[2]);
        return new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
        const d = new Date(s);
        return Number.isNaN(d.getTime()) ? null : d;
    }
};

// Add DateKey to all events
eventsStore.events.forEach(e => {
    const d = parseEventDate(e.Date);
    e.DateKey = d ? d.toISOString().split('T')[0] : null;
});

// ----------------------------
// Filter events
// ----------------------------
const interestedEvents = computed(() => {
    if (!currentUser.value || !canShow.value) return [];
    return eventsStore.events
        .filter(e => e.Interested?.includes(currentUser.value.uid))
});

const suggestedEvents = computed(() => {
    if (!currentUser.value || !canShow.value) return [];

    // get the names of events the user is interested in
    const interestedNames = new Set(
        eventsStore.events
            .filter(e => e.Interested?.includes(currentUser.value.uid))
            .map(e => e.Name.toLowerCase())
    );

    console.log(interestedNames);

    return eventsStore.events
        // exclude events the user is already interested in
        .filter(e => !e.Interested?.includes(currentUser.value.uid))
        // filter for suggested events that contain any name from interested events
        .filter(e => {
            const eventName = e.Name.toLowerCase();
            for (let name of interestedNames) {
                for (let word of eventName.split(" ")){
                    console.log(word)
                    console.log(name)
                    if (name.includes(word)) return true;
                }

            }
            return false;
        });
});

// ----------------------------
// Date conflicts only for interested events
// ----------------------------
const dateConflict = computed(() => {
    const counts = {};
    interestedEvents.value.forEach(e => {
        if (!e.DateKey) return;
        counts[e.DateKey] = (counts[e.DateKey] || 0) + 1;
    });
    const conflicts = {};
    for (const k in counts) if (counts[k] > 1) conflicts[k] = true;
    return conflicts;
});

// ----------------------------
// Remove from interested
// ----------------------------
const removeFromInterested = (eventId) => {
    const idx = interestedEvents.value.findIndex(e => e.id === eventId);
    if (idx > -1) interestedEvents.value.splice(idx, 1);
};
</script>

<style scoped>
.user-events {
    flex: 1;
    padding: 80px 40px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent);
}

.user-events-header {
    text-align: center;
    margin-bottom: 50px;
}

.user-events-header h2 {
    font-size: 36px;
    color: var(--accent);
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.user-events-header p {
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

.events-grid > * {
    animation: fadeUp 0.4s ease forwards;
}

/* highlight events on the same date (only interested events) */
.conflict {
    border: 2px solid red;
    border-radius: 12px;
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
.header-top {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}
</style>
