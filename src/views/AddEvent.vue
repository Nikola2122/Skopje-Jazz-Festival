<template>
    <div class="artist-form-card">
        <h2 class="form-title">Add New Event</h2>
        <p class="form-subtitle">Fill in all event details</p>

        <form @submit.prevent="addEvent" class="artist-form">
            <!-- Name -->
            <div class="form-group">
                <label>Name</label>
                <input
                    v-model="name"
                    type="text"
                    placeholder="Event name"
                    required
                />
            </div>

            <!-- Date -->
            <div class="form-group">
                <label>Date</label>
                <input
                    ref="dateInput"
                    type="text"
                    placeholder="dd/mm/yyyy"
                    required
                />
            </div>

            <!-- Description -->
            <div class="form-group">
                <label>Description</label>
                <input
                    v-model="description"
                    type="text"
                    placeholder="Short description"
                    required
                />
            </div>

            <!-- Image URL -->
            <div class="form-group">
                <label>Image URL</label>
                <input
                    v-model="imageUrl"
                    type="text"
                    placeholder="https://image..."
                />
            </div>

            <!-- Location -->
            <div class="form-group">
                <label>Location</label>
                <input
                    v-model="location"
                    type="text"
                    placeholder="City, Venue"
                    required
                />
            </div>

            <!-- Ticket Price -->
            <div class="form-group">
                <label>Ticket Price</label>
                <input
                    v-model="ticketPrice"
                    type="number"
                    placeholder="€"
                    required
                />
            </div>

            <!-- Artists -->
            <div class="form-group">
                <label>Artists</label>

                <div
                    v-for="artist in artistStore.artists.map(a => a.Name)"
                    :key="artist"
                    class="checkbox-row"
                >
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            :value="artist"
                            v-model="artists"
                        />
                        <span class="checkmark"></span>
                        <span class="checkbox-label">{{ artist }}</span>
                    </label>
                </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="submit-btn">
                Add Event
            </button>

            <div v-if="error" class="error-message">
                Something went wrong. Try again.
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import flatpickr from "flatpickr"
import "flatpickr/dist/themes/dark.css"
import { addToDb } from "@/firebase/utils/services.js"
import { useRouter } from "vue-router"
import {useEventsStore} from "@/pinia/events.js";
import {useArtistsStore} from "@/pinia/artists.js";

const dateInput = ref(null)
const rawDate = ref("")

const name = ref("")
const description = ref("")
const imageUrl = ref("")
const location = ref("")
const ticketPrice = ref("")
const artists = ref([])

const error = ref(false)
const router = useRouter()
const eventStore = useEventsStore()
const artistStore = useArtistsStore()


onMounted(() => {
    if (artistStore.artists.length < 1) {
        artistStore.fetchArtists()
    }
    flatpickr(dateInput.value, {
        dateFormat: "d/m/Y",
        allowInput: true,
        maxDate: "today",
        onChange: (_, dateStr) => {
            rawDate.value = dateStr
        }
    })
})

const addEvent = async () => {
    try {
        await addToDb("Events", {
            Name: name.value,
            Date: rawDate.value,
            Description: description.value,
            ImageUrl: imageUrl.value,
            Location: location.value,
            TicketPrice: ticketPrice.value,
            Artists: artists.value
        })
        eventStore.fetchEvents()
        router.push({
            name: "AdminPanel",
            query: { tab: "events" }
        })
    } catch (err) {
        error.value = true
        console.error(err)
    }
}
</script>

<style scoped>
/* ================= CARD ================= */
.artist-form-card {
    background: linear-gradient(
        145deg,
        var(--bg-secondary),
        rgba(255, 255, 255, 0.03)
    );
    padding: 30px;
    border-radius: 18px;
    box-shadow: 0 10px 36px rgba(0, 0, 0, 0.35);
    max-width: 500px;
    margin: 20px auto 20px auto;
    animation: fadeInUp 0.6s ease;
}

/* ================= HEADER ================= */
.form-title {
    color: var(--accent);
    font-size: 24px;
    margin-bottom: 6px;
}

.form-subtitle {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 26px;
}

/* ================= FORM ================= */
.artist-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--text-muted);
}

/* ================= INPUTS ================= */
.form-group input {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 200, 80, 0.35);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 15px;
    color: var(--text);
    outline: none;
    transition: all 0.25s ease;
}

.form-group input::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.form-group input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(255, 200, 80, 0.2);
    background: rgba(0, 0, 0, 0.45);
}

/* ================= CHECKBOX ================= */
.checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text);
}
/* ================= DARK CHECKBOX ================= */
.checkbox {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    color: var(--text);
}

/* Hide default checkbox */
.checkbox input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

/* Custom box */
.checkmark {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.4);
    border: 1.5px solid rgba(255, 200, 80, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    box-shadow: inset 0 0 0 0 rgba(255, 200, 80, 0.4);
}

/* Check icon */
.checkmark::after {
    content: "";
    width: 6px;
    height: 10px;
    border: solid var(--bg-main);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    transition: transform 0.2s ease;
}

/* Checked state */
.checkbox input:checked + .checkmark {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(255, 200, 80, 0.25);
}

.checkbox input:checked + .checkmark::after {
    transform: rotate(45deg) scale(1);
}

/* Hover */
.checkbox:hover .checkmark {
    border-color: var(--accent);
}

/* Label text */
.checkbox-label {
    color: var(--text);
}

/* Optional subtle glow */
.checkbox input:checked ~ .checkbox-label {
    color: var(--accent);
}

/* ================= BUTTON ================= */
.submit-btn {
    margin-top: 10px;
    padding: 14px;
    border-radius: 999px;
    border: none;
    background: var(--accent);
    color: var(--bg-main);
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 6px 20px rgba(255, 200, 80, 0.35);
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 200, 80, 0.45);
}

/* ================= ERROR ================= */
.error-message {
    background: rgba(255, 50, 50, 0.15);
    color: #ff4d4d;
    border-left: 4px solid #ff4d4d;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 6px;
    animation: fadeInSlide 0.3s ease forwards;
}

/* ================= FLATPICKR ================= */
:deep(.flatpickr-calendar) {
    background: var(--bg-secondary);
    border-radius: 16px;
    border: 1px solid rgba(255, 200, 80, 0.3);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

:deep(.flatpickr-day) {
    color: var(--text);
    border-radius: 8px;
}

:deep(.flatpickr-day:hover) {
    background: rgba(255, 200, 80, 0.2);
}

:deep(.flatpickr-day.selected) {
    background: var(--accent);
    color: var(--bg-main);
}

:deep(.flatpickr-months),
:deep(.flatpickr-weekdays) {
    color: var(--accent);
}

/* ================= ANIMATIONS ================= */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInSlide {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
