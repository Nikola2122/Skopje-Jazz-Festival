<template>
  <div class="artists-tab">
    <div v-for="artist in artists" :key="artist.id" class="row-card">
      <div class="artist-info">
        <h3>{{ artist.name }}</h3>
        <p>{{ artist.genre }}</p>
      </div>
      <button class="more-btn">View</button>
    </div>
  </div>
</template>

<script setup>
const artists = [
  { id: 1, name: 'John Doe', genre: 'Saxophone' },
  { id: 2, name: 'Jane Smith', genre: 'Vocal Jazz' },
  { id: 3, name: 'Mike Jazzman', genre: 'Piano' }
]
</script>

<style scoped>
.artists-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.row-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255,200,80,0.2);
}

.artist-info h3 {
  font-size: 18px;
  margin-bottom: 4px;
  color: var(--accent);
}

.artist-info p {
  font-size: 14px;
  color: var(--text-muted);
}

.more-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.more-btn:hover {
  filter: drop-shadow(0 0 12px rgba(255,200,80,0.4));
}
</style>
