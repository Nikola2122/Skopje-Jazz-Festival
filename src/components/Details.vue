<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
    Event: {
        type: Object,
        required: true
    },
    showModal: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

const handleEsc = (e) => {
    if (e.key === 'Escape') emit('close')
}

onMounted(() => {
    window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleEsc)
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="showModal"
                class="overlay"
                @click.self="emit('close')"
            >
                <div class="modal">
                    <button class="close-icon" @click="emit('close')">✕</button>

                    <h2>{{ Event.Name }}</h2>

                    <div class="info">
                        <p><strong>Date:</strong> {{ Event.Date }}</p>
                        <p><strong>Location:</strong> {{ Event.Location }}</p>

                        <!-- Ticket Price -->
                        <div class="ticket">
                            Ticket price: € {{ Event.TicketPrice }}
                        </div>

                    </div>
                    <div class="demo-text">
                        Categories: {{ Event.categories }}
                    </div>
                    <div class="demo-text">
                        Source Url: {{ Event.SourceUrl }}
                    </div>
                    <p class="demo-text">
                        {{ Event.Description }}
                    </p>

                    <div class="grid-item artists">
                        <span class="label">Artists</span>
                        <span class="value">
                            <span class="artist"
                                  v-for="(artist, index) in Event.Artists"
                                  :key="index">
                                {{ artist }}
                            </span>
                        </span>
                    </div>

                    <button class="close-btn" @click="emit('close')">
                        Close
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal {
    position: relative;
    background: var(--bg-secondary);
    padding: 28px;
    border-radius: 14px;
    width: 340px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}


.close-icon {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
}

.close-icon:hover {
    color: var(--accent);
}

h2 {
    margin: 0 0 10px;
    color: var(--accent);
}

.info {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.ticket {
    margin-top: 6px;
    align-self: flex-start;
    background: rgba(255, 200, 80, 0.15);
    color: var(--accent);
    padding: 4px 10px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 13px;
}


.demo-text {
    font-size: 14px;
    color: var(--text-main);
    line-height: 1.5;
    margin-bottom: 14px;
}


.label {
    font-size: 12px;
    color: var(--text-muted, #aaa);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.value {
    font-size: 15px;
    color: var(--text, #fff);
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.artists .artist {
    background: rgba(255, 200, 80, 0.15);
    color: #ffc850;
    padding: 2px 6px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 13px;
}


.close-btn {
    margin-top: 18px;
    width: 100%;
    padding: 10px;
    border-radius: 999px;
    border: 1px solid var(--accent);
    background: transparent;
    color: var(--accent);
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: var(--accent);
    color: var(--bg-main);
}


.modal-enter-active,
.modal-leave-active {
    transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
