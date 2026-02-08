import {defineStore} from "pinia";
import {ref} from "vue";
import {fetchFromDb} from "@/firebase/utils/services.js";

export const useArtistsStore  = defineStore('Artists', () => {
    const artists = ref([]);
    async function fetchArtists() {
        try {
            artists.value = await fetchFromDb('Artists')
        } catch (err) {
            console.error(err)
        }
    }
    return {artists, fetchArtists}
})