<template>
    <div class="spinner-wrapper">
        <div class="spinner"></div>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: "Loading..."
    }
})
</script>

<style scoped>
.spinner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px;
    color: var(--accent, #ffc850);
}

.spinner {
    width: 48px;
    height: 48px;
    border: 5px solid rgba(255, 200, 80, 0.2);
    border-top-color: var(--accent, #ffc850);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.spinner-wrapper p {
    font-size: 14px;
    color: var(--text-muted, #aaa);
}
</style>
