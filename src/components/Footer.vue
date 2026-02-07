<template>
    <footer class="footer">
        <div class="footer-container">

            <div class="footer-left">
                <div class="social-icons">
                    <a href="https://www.facebook.com/skopjejazzfest" target="_blank"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://x.com/SkopjeJazzFest" target="_blank"><i class="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com/skopjejazzfest/" target="_blank"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.youtube.com/channel/UCpPNHHspugKz-vS_0w10BJg" target="_blank"><i
                        class="fab fa-youtube"></i></a>
                </div>
            </div>

            <div class="footer-center">
                <p>© 2026 Jazz Festival. All rights reserved.</p>
            </div>

            <div class="footer-right">
                <ul class="links">
                    <li>
                        <router-link to="/">Home</router-link>
                    </li>
                    <li>
                        <router-link to="/program">Program</router-link>
                    </li>
                    <li>
                        <router-link to="/contact">Contact</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: var(--bg-secondary);
    padding: 30px 40px;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.footer-left .social-icons {
    display: flex;
    gap: 15px;
}

.footer-left .social-icons a {
    color: var(--text-muted);
    font-size: 20px;
    transition: color 0.2s;
}

.footer-left .social-icons a:hover {
    color: var(--accent);
    transform: scale(1.3);
}

.footer-center p {
    margin: 0;
    color: var(--text-muted);
    text-align: center;
    font-size: 14px;
}

.footer-right .links {
    list-style: none;
    display: flex;
    gap: 15px;
    padding: 0;
    margin: 0;
}

.footer-right .links li {
    position: relative;
}

.footer-right .links li a {
    position: relative;
    text-decoration: none;
    color: var(--text-muted);
    font-size: 14px;
    padding: 4px 0;
    transition: color 0.25s ease;
}

.footer-right .links li a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0%;
    height: 2px;
    background: var(--accent);
    transition: width 0.25s ease;
}

.footer-right .links li a:hover {
    color: var(--accent);
}

.footer-right .links li a:hover::after {
    width: 100%;
}

.footer-right .links li a.router-link-active {
    color: var(--accent);
}

.footer-right .links li a.router-link-active::after {
    width: 100%;
}

li:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
}

@media (max-width: 768px) {
    .footer-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 15px;
    }
}
</style>