<template>
    <div class="card">
        <!-- Image -->
        <div class="image-wrapper">
            <img :src="props.Event.ImageUrl || fallbackImage" alt="Event image" />
        </div>

        <div class="card-content">
            <h3>{{ props.Event.Name }}</h3>

            <div class="meta">
                <span>{{ props.Event.Date }}</span>
                <span class="dot">•</span>
                <span>{{ props.Event.Location }}</span>
            </div>
        </div>

        <div class="buttons">
            <button @click="showModal = true">View details</button>

            <!-- Interested Heart Button -->
            <button
                v-if="showInterestedBtn"
                class="heart-btn"
                :class="{ interested: isInterested }"
                @click="toggleInterested"
            >
                <span :class="{ filled: isInterested }">❤️</span>
                Interested
            </button>
        </div>

        <Details
            :Event="props.Event"
            :showModal="showModal"
            @close="showModal = false"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Details from "@/components/Details.vue";
import { auth } from "@/firebase/firebase.js";
import { alterInterested, hasRole } from "@/firebase/utils/services.js";

const props = defineProps({
    Event: {
        type: Object,
        required: true
    }
});

const showModal = ref(false);
const fallbackImage =
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80";

const currentUser = ref(auth.currentUser);
const userRole = ref(null);

// Only show Interested button if logged in and role is 'user'
const showInterestedBtn = computed(() => {
    return currentUser.value && userRole.value === "user";
});

// Check if current user's UID is in Event.Interested
const isInterested = computed(() => {
    if (!props.Event.Interested || !currentUser.value) return false;
    return props.Event.Interested.includes(currentUser.value.uid);
});

// Toggle Interested
const toggleInterested = async () => {
    if (!currentUser.value) return;

    const action = isInterested.value ? "remove" : "add";
    try {
        await alterInterested(props.Event.id, currentUser.value.uid, action);

        if (!props.Event.Interested) props.Event.Interested = [];
        if (action === "add") props.Event.Interested.push(currentUser.value.uid);
        else
            props.Event.Interested = props.Event.Interested.filter(
                (uid) => uid !== currentUser.value.uid
            );
    } catch (err) {
        console.error("Failed to update interest:", err);
    }
};

// On mounted, check user role
onMounted(async () => {
    if (currentUser.value) {
        const isUser = await hasRole(currentUser.value.uid, "user");
        userRole.value = isUser ? "user" : null;
    }
});
</script>

<style scoped>
.card {
    background: linear-gradient(
        145deg,
        var(--bg-secondary),
        rgba(255, 255, 255, 0.02)
    );
    padding: 22px;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 18px;
    border: 1px solid transparent;
    transition: all 0.25s ease;
}

.card:hover {
    transform: translateY(-6px);
    border-color: var(--accent);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
}

/* Image */
.image-wrapper {
    width: 100%;
    height: 160px;
    border-radius: 10px;
    overflow: hidden;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.card:hover .image-wrapper img {
    transform: scale(1.06);
}

/* Content */
.card-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

h3 {
    margin: 0;
    font-size: 18px;
    color: var(--accent);
    letter-spacing: 0.5px;
}

.meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-muted);
}

.dot {
    opacity: 0.6;
}

/* Buttons */
.buttons {
    display: flex;
    gap: 12px;
    align-items: center;
}

button {
    align-self: flex-start;
    padding: 8px 18px;
    border-radius: 999px;
    border: 1px solid var(--accent);
    background: transparent;
    color: var(--accent);
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease;
}

button:hover {
    background: var(--accent);
    color: var(--bg-main);
}


/* Heart button specific */
.heart-btn {
    display: flex;
    align-items: center;
    margin-top: -2px;
    gap: 6px;
}

.heart-btn span {
    font-size: 16px;
    transition: transform 0.2s ease;
}

.heart-btn.filled {
    background: var(--accent);
    color: var(--bg-main);
}

.heart-btn.interested {
    background: var(--accent);
    color: var(--bg-main);
}

.heart-btn span.filled {
    color: red;
    transform: scale(1.2);
}
</style>
