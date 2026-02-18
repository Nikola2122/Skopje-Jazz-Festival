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
                    <EventCard v-for="event in interestedEvents"
                               :key="event.id"
                               :Event="event"
                               :class="{ conflict: dateConflict[event.DateKey] }"
                               @interest-changed="onInterestChanged" />
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
import { alterInterested, hasRole } from '@/firebase/utils/services.js';
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
    // Date parsing helper
    // ----------------------------
    const parseEventDate = (str) => {
        if (!str || typeof str !== "string") return null;
        const s = str.trim();
        if (!s || s.toUpperCase() === "TBA") return null;

        if (s.includes("/")) {
            const [d, m, y] = s.split("/").map(Number);
            if (!Number.isNaN(d) && !Number.isNaN(m) && !Number.isNaN(y)) {
                return new Date(y, m - 1, d);
            }
        } else if (s.includes("-")) {
            const raw = s.split("-");
            const parts = raw.map(Number);
            if (parts.length === 3) {
                // yyyy-mm-dd
                if (raw[0].length === 4) {
                    const [y, m, d] = parts;
                    if (!Number.isNaN(d) && !Number.isNaN(m) && !Number.isNaN(y)) {
                        return new Date(y, m - 1, d);
                    }
                } else {
                    // dd-mm-yyyy
                    const [d, m, y] = parts;
                    if (!Number.isNaN(d) && !Number.isNaN(m) && !Number.isNaN(y)) {
                        return new Date(y, m - 1, d);
                    }
                }
            }
        }

        const d = new Date(s);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    // ----------------------------
    // Events with DateKey (no mutation)
    // ----------------------------
    const eventsWithDateKey = computed(() => {
        return (eventsStore.events || []).map((e) => {
            const d = parseEventDate(e.Date);
            const DateKey = d ? d.toISOString().split("T")[0] : null;
            return { ...e, DateKey };
        });
    });

    // ----------------------------
    // Interested events
    // ----------------------------
    const interestedEvents = computed(() => {
        if (!currentUser.value || !canShow.value) return [];
        return eventsWithDateKey.value.filter((e) =>
            e.Interested?.includes(currentUser.value.uid)
        );
    });

    // ----------------------------
    // Helper: normalize categories -> array of tokens
    // ----------------------------
    const splitCategories = (cats) => {
        // your DB field is: categories (string like "Hip Hop, Rap")
        if (!cats) return [];
        if (Array.isArray(cats)) {
            return cats.map((c) => c.toString().trim().toLowerCase()).filter(Boolean);
        }
        return cats
            .toString()
            .split(",")
            .map((c) => c.trim().toLowerCase())
            .filter(Boolean);
    };

    // ----------------------------
    // Suggested events based on categories overlap
    // ----------------------------
    const suggestedEvents = computed(() => {
        if (!currentUser.value || !canShow.value) return [];

        // categories from interested events
        const interestedCategorySet = new Set();
        for (const e of interestedEvents.value) {
            for (const c of splitCategories(e.categories || e.Categories)) {
                interestedCategorySet.add(c);
            }
        }

        // if user has no categories to base suggestions on -> return empty (or you can return all non-interested)
        if (interestedCategorySet.size === 0) return [];

        return eventsWithDateKey.value
            // exclude events already interested
            .filter((e) => !e.Interested?.includes(currentUser.value.uid))
            // keep only events that share at least 1 category
            .filter((e) => {
                const eventCats = splitCategories(e.categories || e.Categories);
                return eventCats.some((c) => interestedCategorySet.has(c));
            });
    });

    // ----------------------------
    // Date conflicts only for interested events
    // ----------------------------
    const dateConflict = computed(() => {
        const counts = {};
        interestedEvents.value.forEach((e) => {
            if (!e.DateKey) return;
            counts[e.DateKey] = (counts[e.DateKey] || 0) + 1;
        });

        const conflicts = {};
        for (const k in counts) if (counts[k] > 1) conflicts[k] = true;
        return conflicts;
    });

    // ----------------------------
    // Remove from interested (NOTE: computed is read-only)
    // ----------------------------
    // This should update Firestore / your store instead of splicing computed.

    const removeFromInterested = async (eventId) => {
        if (!currentUser.value) return;

        try {
            await alterInterested(eventId, currentUser.value.uid, 'remove');
            // refresh local list
            await eventsStore.fetchEvents();
        } catch (err) {
            console.error(err);
        }
    };
    const onInterestChanged = async ({ eventId, action }) => {
        // if user removed interest, refresh data so the event disappears from Interested section
        if (action === "remove") {
            await eventsStore.fetchEvents();
        }
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
