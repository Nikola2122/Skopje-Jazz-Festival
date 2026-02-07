import {defineStore} from "pinia";
import {ref} from "vue";
import {fetchEventsFromDb} from "@/firebase/utils/services.js";

export const useEventsStore = defineStore('events', () => {
    const events = ref([]);
    const loading = ref(false);

    async function fetchEvents() {
        loading.value = true

        try {
            events.value = await fetchEventsFromDb()
        } catch (err) {
            console.error(err)
        } finally {
            loading.value = false
        }
    }
    return {events, loading, fetchEvents}
})