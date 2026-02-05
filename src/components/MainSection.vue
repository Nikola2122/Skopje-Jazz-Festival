<template>
  <section class="hero">
    <div class="hero-bg">
      <img src="/src/assets/jazz3.jpg" alt="Left Image" class="hero-left" />
      <img src="/src/assets/jazz.png" alt="Center Image" class="hero-center" />
      <img src="/src/assets/images.jpg" alt="Right Image" class="hero-right" />
    </div>
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
  position: relative;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-main), var(--bg-secondary));
}
.hero-bg img {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
  max-height: 90%;
  pointer-events: none;
  transition: transform 0.3s ease;
}
.hero-left {
  left: 1%;
}

.hero-center {
  left: 35%;
  transform: translate(-50%, -50%);
  width: 35%;
}

.hero-right {
  right: 0;
  width: 29%;
  height: 90%;
}
.hero-content h2 {
  font-size: 56px;
  margin-bottom: 15px;
  color: var(--accent);
  position: relative;
  z-index: 10;
}

.hero-content p {
  font-size: 18px;
  margin-bottom: 25px;
  color: var(--text-muted);
  position: relative;
  z-index: 10;
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
  position: relative;
  z-index: 10;
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
  .hero-bg img {
    max-height: 50%;
  }
}
</style>