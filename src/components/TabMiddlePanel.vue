<template>
    <section class="middle-panel">
        <!-- Header -->
        <div class="panel-header">
            <div class="header-text">
                <h1>Welcome to Your Dashboard</h1>
                <p class="subtitle">Manage events and artists efficiently</p>
            </div>

            <div class="header-actions">
                <button @click="goToAdd" class="add-btn">
                    + Add {{ activeTab === 'artists' ? 'Artist' : 'Event' }}
                </button>
                <LogOut />
            </div>
        </div>

        <!-- Tabs -->
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

        <!-- Tab content -->
        <div class="tab-content">
            <ArtistsTab v-if="activeTab === 'artists'"/>
            <EventsTab v-if="activeTab === 'events'"/>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import ArtistsTab from '@/components/ArtistsTab.vue'
import EventsTab from '@/components/EventsTab.vue'
import LogOut from "@/components/LogOut.vue";
import {useRouter} from "vue-router";

const props = defineProps({
    tab: String
})

const activeTab = ref(props.tab)
const router = useRouter()

const goToAdd = () => {
    if (activeTab.value === 'artists') {
        router.push('/add/artist')
    }
    else{
        router.push('/add/event')
    }
}
</script>

<style scoped>
.middle-panel {
    max-width: 900px;
    margin: 40px auto;
    padding: 40px 30px;
    background: linear-gradient(145deg, var(--bg-secondary), rgba(255, 255, 255, 0.02));
    border-radius: 18px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    gap: 30px;
}

/* HEADER */
.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.header-text h1 {
    font-size: 28px;
    color: var(--accent);
    margin: 0;
}

.header-text .subtitle {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 4px;
}

/* TABS */
.tabs {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 20px;
}

.tabs button {
    padding: 12px 28px;
    border-radius: 999px;
    border: 1px solid var(--accent);
    background: transparent;
    color: var(--accent);
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.tabs button.active {
    background: var(--accent);
    color: var(--bg-main);
    box-shadow: 0 6px 18px rgba(255, 200, 80, 0.3);
}

/* TAB CONTENT */
.tab-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* HEADER ACTIONS */
.header-actions {
    display: flex;
    align-items: center;
    gap: 14px;
}

/* ADD BUTTON */
.add-btn {
    padding: 10px 18px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(
        145deg,
        var(--accent),
        rgba(255, 200, 80, 0.85)
    );
    color: var(--bg-main);
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(255, 200, 80, 0.35);
    transition: all 0.2s ease;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(255, 200, 80, 0.45);
}

.add-btn:active {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(255, 200, 80, 0.3);
}
</style>
