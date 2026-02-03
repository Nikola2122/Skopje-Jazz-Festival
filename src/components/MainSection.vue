<template>
  <section class="hero">
    <div class="hero-content">
      <h2>Skopje Jazz Festival 2026</h2>
      <p>Experience the magic of international jazz!</p>
      <router-link to="/program">
        <button>View Program</button>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-main), var(--bg-secondary));
  text-align: center;
  padding: 0 20px;
}

.hero-content h2 {
  font-size: 56px;
  margin-bottom: 15px;
  color: var(--accent);
}

.hero-content p {
  font-size: 18px;
  margin-bottom: 25px;
  color: var(--text-muted);
}

.hero-content button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: var(--accent);
  border: none;
  color: var(--text-main);
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.hero-content button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-content h2 {
    font-size: 36px;
  }
  .hero-content p {
    font-size: 16px;
  }
}
</style>