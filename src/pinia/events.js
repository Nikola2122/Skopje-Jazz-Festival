import {defineStore} from "pinia";
import {ref} from "vue";
import {fetchFromDb} from "@/firebase/utils/services.js";

export const useEventsStore = defineStore('events', () => {
    const events = ref([]);
    async function fetchEvents() {
        try {
            events.value = await fetchFromDb('Events')
        } catch (err) {
            console.error(err)
        }
    }
    return {events, fetchEvents}
})