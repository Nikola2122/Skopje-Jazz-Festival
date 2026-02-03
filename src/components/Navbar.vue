<template>
  <nav class="navbar">
    <h1>Jazz Festival</h1>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/program">Program</router-link></li>
      <li>Artists</li>
      <li>Tickets</li>
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/contact">Contact</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  background: var(--bg-main);
}

ul {
  display: flex;
  gap: 30px;
  list-style: none;
}

li {
  cursor: pointer;
  color: var(--text-muted);
}

li:hover {
  color: var(--accent);
}
a {
  text-decoration: none;
  color: var(--text-muted);
}
a:hover {
  color: var(--accent);
}

a.router-link-active {
  color: var(--accent);
}
</style>