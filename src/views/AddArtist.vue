<template>
    <div class="artist-form-card">
        <h2 class="form-title">Add New Artist</h2>
        <p class="form-subtitle">Fill in all artist details</p>

        <form @submit.prevent="addArtist" class="artist-form">

            <div class="form-group">
                <label>Name</label>
                <input v-model="name"
                       type="text"
                       placeholder="Artist full name"
                       required />
            </div>


            <div class="form-group">
                <label>Birth Place</label>
                <input v-model="place"
                       type="text"
                       placeholder="City, Country"
                       required />
            </div>


            <div class="form-group">
                <label>Date of Birth</label>
                <input ref="dateInput"
                       type="text"
                       placeholder="dd/mm/yyyy"
                       required />
            </div>


            <div class="form-group">
                <label>Role / Instrument</label>
                <input v-model="role"
                       type="text"
                       placeholder="Singer, Guitarist, Drummer..."
                       required />
            </div>
            <div class="form-group">
                <label>Categories</label>
                <input v-model="Categories"
                       type="text"
                       placeholder="Hip Hop, Trap, Pop-Rock, Pop, Rcok"
                       required />
            </div>


            <button type="submit" class="submit-btn">
                Add Artist
            </button>
            <div v-if="error" class="error-message">
                {{ error }}
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import flatpickr from "flatpickr"
import "flatpickr/dist/themes/dark.css"
import {addToDb} from "@/firebase/utils/services.js";
import {useRouter} from "vue-router";
import {useArtistsStore} from "@/pinia/artists.js";

const dateInput = ref(null)
const rawDate = ref("")
const name = ref("")
const place = ref("")
const role = ref("")
const Categories = ref("")
const error = ref(false)
const router = useRouter()
const artistStore = useArtistsStore()

onMounted(() => {
    flatpickr(dateInput.value, {
        dateFormat: "d/m/Y",
        allowInput: true,
        maxDate: "today",
        onChange: (_, dateStr) => {
            rawDate.value = dateStr
        }
    })
})

const addArtist = async () => {
    try {
        await addToDb('Artists', {
            Name: name.value,
            BirthPlace: place.value,
            RoleInstrument: role.value,
            DateOfBirth: rawDate.value,
            Categories: Categories.value
        })
        await artistStore.fetchArtists()
        await router.push({
            name: 'AdminPanel',
            params: {
                tab: 'artists'
            }
        })
    }
    catch (error) {
        error.value = true
        console.error(error)
    }
}
</script>

<style scoped>

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
    margin: 20px auto 0;
    animation: fadeInUp 0.6s ease;
}


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

.date-preview {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
    animation: fadeIn 0.25s ease;
}


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

.submit-btn:active {
    transform: translateY(0);
}

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

:deep(.flatpickr-day.selected),
:deep(.flatpickr-day.startRange),
:deep(.flatpickr-day.endRange) {
    background: var(--accent);
    color: var(--bg-main);
}

:deep(.flatpickr-months),
:deep(.flatpickr-weekdays) {
    color: var(--accent);
}


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
    box-shadow: 0 4px 12px rgba(255, 50, 50, 0.2);
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

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
