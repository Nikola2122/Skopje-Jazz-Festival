<template>
    <section class="event-calendar-wrapper">
        <div class="calendar-container">
            <h1>Events Calendar</h1>
            <div class="calendar-header">
                <button @click="prevMonth">&lt;</button>
                <h3>{{ monthName }} {{ currentYear }}</h3>
                <button @click="nextMonth">&gt;</button>
            </div>

            <div class="calendar-grid">
                <div v-for="day in calendarDays" :key="day.date" class="calendar-day">
                    <div @click="selectDate(day.date)">
                        {{ day.day }}
                        <span v-if="eventsByDate[convertToFirebaseDate(day.date)]" class="event-indicator"></span>
                    </div>
                </div>
            </div>

            <div v-if="selectedEvent" class="event-details">
                <img :src="selectedEvent.ImageUrl || fallbackImage" alt="Event Image"/>
                <h3>{{ selectedEvent.Name }}</h3>
                <p><strong>Artists:</strong> {{ selectedEvent.Artists.join(', ') }}</p>
                <p><strong>Ticket Price:</strong> {{ selectedEvent.TicketPrice || 'Unknown' }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useEventsStore} from "@/pinia/events.js";

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedEvent = ref(null)
const events = computed(() => {
    return eventStore.events
})
const fallbackImage = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80'
const eventStore = useEventsStore()


const eventsByDate = computed(() => {
    const map = {}
    events.value.forEach(e => {
        if (e.Date) {
            map[e.Date.trim()] = e
        }
    })
    return map
})

const calendarDays = computed(() => {
    const days = []
    const firstDay = new Date(currentYear.value, currentMonth.value, 1)
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        days.push({day: i, date: dateStr})
    }
    return days
})

function convertToFirebaseDate(date) {
    const [year, month, day] = date.split('-')
    return `${day}-${month}-${year}`
}

function prevMonth() {
    currentMonth.value--
    if (currentMonth.value < 0) {
        currentMonth.value = 11
        currentYear.value--
    }
}

function nextMonth() {
    currentMonth.value++
    if (currentMonth.value > 11) {
        currentMonth.value = 0
        currentYear.value++
    }
}

function selectDate(date) {
    const [year, month, day] = date.split('-')
    const firebaseDate = `${day}-${month}-${year}`.trim()
    selectedEvent.value = eventsByDate.value[firebaseDate] || null
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]
const monthName = computed(() => monthNames[currentMonth.value])
</script>

<style scoped>
.event-calendar-wrapper {
    display: flex;
    justify-content: center;
    padding: 40px 20px;
}

.calendar-container {
    background-color: #6a6868;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    max-width: 900px;
    width: 100%;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.calendar-header h3 {
    margin: 0;
}

h1 {
    color: var(--accent);
    text-align: center;
}

.calendar-header button {
    padding: 6px 12px;
    cursor: pointer;
    background: var(--accent);
    border: none;
    color: var(--text-main);
    border-radius: 5px;
    transition: opacity 0.2s;
}

.calendar-header button:hover {
    opacity: 0.8;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
}

.calendar-day {
    background-color: var(--bg-secondary);
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s, background 0.2s;
}

.calendar-day:hover {
    transform: translateY(-3px);
    background-color: var(--accent);
    color: var(--text-main);
}

.event-indicator {
    display: block;
    width: 6px;
    height: 6px;
    background-color: var(--accent);
    border-radius: 50%;
    margin: 4px auto 0;
}

.event-details {
    margin-top: 20px;
    padding: 20px;
    background-color: var(--bg-secondary);
    border-radius: 10px;
    text-align: center;
}

.event-details img {
    width: 600px;
    height: 400px;
    max-width: 100%;
    border-radius: 10px;
    margin-bottom: 15px;
}
</style>