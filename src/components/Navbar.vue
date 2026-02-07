<template>
    <nav class="navbar">
        <h1 class="logo">Jazz Festival</h1>

        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="/program">Program</router-link>
            </li>
            <li>
                <router-link to="/about">About</router-link>
            </li>
            <li>
                <router-link to="/contact">Contact</router-link>
            </li>
            <li class="admin">
                <router-link to="/login">Admin Panel</router-link>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 40px;

    background: var(--bg-main);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
    font-size: 20px;
    letter-spacing: 1px;
    color: var(--accent);
    cursor: default;
}

ul {
    display: flex;
    gap: 28px;
    list-style: none;
}

li {
    position: relative;
}


a {
    text-decoration: none;
    color: var(--text-muted);
    font-size: 15px;
    padding: 4px 0;
    transition: color 0.25s ease;
}

a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 0%;
    height: 2px;
    background: var(--accent);
    transition: width 0.25s ease;
}

a:hover {
    color: var(--accent);
}

a:hover::after {
    width: 100%;
}

a.router-link-active {
    color: var(--accent);
}

a.router-link-active::after {
    width: 100%;
}

.admin a {
    color: var(--accent);
}

.admin a::after {
    background: var(--accent);
}

li:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
}
</style>
