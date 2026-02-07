<template>
    <div id="wrapper">
        <Navbar/>
        <Main class="content">
            <router-view/>
        </Main>
        <Footer/>
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from "@/components/Footer.vue";
</script>

<style>
#wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    flex: 1;
}
</style>
