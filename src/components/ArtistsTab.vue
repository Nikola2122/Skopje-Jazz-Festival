<template>
    <Loading v-if="artistsStore.artists.length === 0" />
    <AACard v-if="artistsStore.artists.length !== 0" v-for="a in artistsStore.artists" :key="a.id" class="row-card" :artist="a">
    </AACard>
</template>

<script setup>
import AACard from "@/components/AACard.vue";

import {onMounted} from "vue";
import {useArtistsStore} from "@/pinia/artists.js";
import Loading from "@/components/Loading.vue";

const artistsStore = useArtistsStore();

onMounted(() => {
    if (artistsStore.artists.length === 0) {
        artistsStore.fetchArtists()
    }
    console.log(artistsStore.artists)
})
</script>
