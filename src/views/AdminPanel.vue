<script setup>
import TabMiddlePanel from "@/components/TabMiddlePanel.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

const tabComputed = computed(() => {
    return route.query.tab ?? 'artists'
})
</script>

<template>
    <TabMiddlePanel :tab="tabComputed" />
</template>

<style scoped>

</style>