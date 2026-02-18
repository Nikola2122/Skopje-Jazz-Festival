<template>
    <section class="program">
        <header class="program-header">
            <h2>Festival Program</h2>
            <p>Explore the full schedule of performances and events</p>
        </header>


        <div class="filters" v-if="eventsStore.events.length !== 0">
            <input v-model="categoryQuery"
                   class="category-search"
                   type="text"
                   placeholder="Hip Hop, Rap" />
            <small class="hint">
                Tip: separate multiple genres with a comma (e.g. "hip hop, rap")
            </small>
        </div>

        <Loading v-if="eventsStore.events.length === 0" />


        <div v-else-if="isFiltering" class="events-grid">
            <EventCard v-for="event in filteredEvents"
                       :key="event.id"
                       :Event="event" />
        </div>


        <div v-else>

            <div v-if="newEvents.length > 0" class="section-block">
                <h3 class="section-title">New events</h3>
                <div class="events-grid">
                    <EventCard v-for="event in newEvents"
                               :key="event.id"
                               :Event="event" />
                </div>
            </div>


            <div class="section-block" :class="{ 'mt': newEvents.length > 0 }">
                <h3 v-if="newEvents.length > 0" class="section-title">All events</h3>
                <div class="events-grid">
                    <EventCard v-for="event in oldEventsToShow"
                               :key="event.id"
                               :Event="event" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref, computed, onMounted } from "vue";
    import EventCard from "@/components/EventCard.vue";
    import Loading from "@/components/Loading.vue";
    import { useEventsStore } from "@/pinia/events.js";

    const eventsStore = useEventsStore();
    const categoryQuery = ref("");


    function normalizeToken(s) {
        return (s ?? "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ");
    }

    function splitQuery(q) {
        const s = normalizeToken(q);
        if (!s) return [];

        if (s.includes(",")) {
            return s
                .split(",")
                .map((x) => normalizeToken(x))
                .filter(Boolean);
        }

        return s.split(" ").map(normalizeToken).filter(Boolean);
    }

    const isFiltering = computed(() => normalizeToken(categoryQuery.value).length > 0);

    const filteredEvents = computed(() => {
        const wanted = splitQuery(categoryQuery.value);
        if (wanted.length === 0) return eventsStore.events;

        return eventsStore.events.filter((ev) => {
            const haystack = normalizeToken(ev?.categories ?? "");

            return wanted.every((w) => haystack.includes(w));
        });
    });


    const newEvents = computed(() => {
        return eventsStore.events.filter((e) => e?.isNew === true);
    });

    const oldEvents = computed(() => {
        return eventsStore.events.filter((e) => e?.isNew !== true);
    });


    const oldEventsToShow = computed(() => {
        return newEvents.value.length > 0 ? oldEvents.value : eventsStore.events;
    });

    onMounted(() => {
        if (eventsStore.events.length === 0) {
            eventsStore.fetchEvents();
        }
    });
</script>

<style scoped>
    .program {
        flex: 1;
        padding: 80px 40px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent);
    }
    .section-title {
        text-align: center;
        margin: 0 0 14px 0;
        color: var(--accent);
        letter-spacing: 0.5px;
        font-size: 18px;
    }
    .program-header {
        text-align: center;
        margin-bottom: 30px;
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


    .filters {
        max-width: 560px;
        margin: 0 auto 30px auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .category-search {
        width: 100%;
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(0, 0, 0, 0.35);
        color: white;
        outline: none;
    }

        .category-search::placeholder {
            color: rgba(255, 255, 255, 0.45);
        }

    .hint {
        color: var(--text-muted);
        font-size: 12px;
    }

    .section-block.mt {
        margin-top: 40px;
    }

    .section-title {
        max-width: 1200px;
        margin: 0 auto 14px auto;
        color: var(--accent);
        letter-spacing: 0.5px;
        font-size: 18px;
    }


    .events-grid {
        display: grid;
        gap: 26px;
        grid-template-columns: repeat(4, 1fr);
    }


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
