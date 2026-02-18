<template>
    <div class="artist-tab">

        <div class="artist-card">
            <div class="artist-grid">
                <h3 class="artist-name">{{ artist.Name }}</h3>

                <div class="grid-item dob">
                    <span class="label">Date of Birth</span>
                    <span class="value">{{ artist.DateOfBirth }}</span>
                </div>

                <div class="grid-item birthplace">
                    <span class="label">Birth Place</span>
                    <span class="value">{{ artist.BirthPlace }}</span>
                </div>

                <div class="grid-item role">
                    <span class="label">Role / Instrument</span>
                    <span class="value">{{ artist.RoleInstrument }}</span>
                </div>
                <div class="grid-item Categories">
                    <span class="label">Categories</span>
                    <span class="value">{{ artist.Categories }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    artist: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.artist-tab {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.tab-title {
    color: var(--accent, #ffc850);
    font-size: 24px;
    margin-bottom: 10px;
}

.artist-card {
    background: var(--card-bg, rgba(30,30,30,0.9));
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.3);
    transition: transform 0.3s, box-shadow 0.3s;
}

.artist-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 30px rgba(255,200,80,0.4);
}

.artist-grid {
    display: grid;
    grid-template-areas:
    "name name name"
    "dob birthplace role";
    grid-template-columns: repeat(3, 1fr);
    gap: 12px 20px;
    align-items: start;
}

.artist-name {
    grid-area: name;
    color: var(--accent, #ffc850);
    font-size: 20px;
    margin-bottom: 8px;
}

.grid-item {
    display: flex;
    flex-direction: column;
}

.dob { grid-area: dob; }
.birthplace { grid-area: birthplace; }
.role { grid-area: role; }

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
}
</style>
