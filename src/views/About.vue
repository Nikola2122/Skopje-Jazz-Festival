<template>
  <section class="about-page">
    <h2>About Skopje Jazz Festival</h2>
    <div class="about-wrapper">

      <div class="about-text">

        <p>
          Skopje Jazz Festival is one of the leading music events in the Republic of North Macedonia with tradition of 44 years.
          The festival enjoys excellent reputation in Europe and the world.
          The Festival was established in 1982.
          So far, the line-up has included all jazz styles and performances by the most famous American and European jazz artists,
          representatives of Latin-American and African music, as well as the best Macedonian jazz musicians.
          Skopje Jazz Festival is a member of Europe Jazz Network.
        </p>
      </div>

      <div class="about-image">
        <img src="/src/assets/download.jpg" alt="Skopje Jazz Festival" />
      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 20px;
  text-align: center;
}

.about-page h2 {
  color: var(--accent);
  font-size: 36px;
  margin-bottom: 20px;
}

.about-page p {
  color: var(--text-main);
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
}
.about-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.about-text h2 {
  color: var(--accent);
  font-size: 36px;
  margin-bottom: 20px;
  text-align: left;
}

.about-text p {
  color: var(--text-main);
  font-size: 16px;
  line-height: 1.8;
  text-align: left;
}

.about-image img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .about-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .about-text h2,
  .about-text p {
    text-align: center;
  }

  .about-image img {
    width: 100%;
  }
}
</style>