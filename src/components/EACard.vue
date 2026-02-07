<template>
    <div class="row-card">
        <div class="event-grid">
            <h3 class="event-name">{{ Event.Name }}</h3>

            <div class="grid-item date">
                <span class="label">Date</span>
                <span class="value">{{ Event.Date }}</span>
            </div>

            <div class="grid-item location">
                <span class="label">Location</span>
                <span class="value">{{ Event.Location }}</span>
            </div>

            <div class="grid-item ticket">
                <span class="label">Ticket Price</span>
                <span class="value">{{ Event.TicketPrice }}</span>
            </div>

            <div class="grid-item artists">
                <span class="label">Artists</span>
                <span class="value">
          <span class="artist" v-for="(artist, index) in Event.Artists" :key="index">
            {{ artist }}
          </span>
        </span>
            </div>
        </div>

        <p class="description">{{ Event.Description }}</p>
    </div>
</template>

<script setup>

defineProps({
    Event: {
        type: Object,
        required: true
    }
})

</script>

<style scoped>
.row-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background: var(--card-bg, rgba(30, 30, 30, 0.9));
    border-radius: 16px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s, box-shadow 0.3s;
}

.row-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 30px rgba(255, 200, 80, 0.4);
}

.event-grid {
    display: grid;
    grid-template-areas:
    "name name name"
    "date location ticket"
    "artists artists artists";
    grid-template-columns: repeat(3, 1fr);
    gap: 12px 20px;
    align-items: start;
    margin-bottom: 12px;
}

.event-name {
    grid-area: name;
    color: var(--accent, #ffc850);
    font-size: 22px;
    margin-bottom: 8px;
}

.grid-item {
    display: flex;
    flex-direction: column;
}

.date {
    grid-area: date;
}

.location {
    grid-area: location;
}

.ticket {
    grid-area: ticket;
}

.artists {
    grid-area: artists;
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
    margin-top: 2px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.artists .artist {
    background: rgba(255, 200, 80, 0.15);
    color: #ffc850;
    padding: 2px 6px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 13px;
}

.description {
    font-style: italic;
    color: #ccc;
    margin-top: 10px;
    line-height: 1.4;
}
</style>
