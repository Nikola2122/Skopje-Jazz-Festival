import {defineStore} from "pinia";
import {ref} from "vue";
import {fetchArtistsFromDb} from "@/firebase/utils/services.js";

export const useArtistsStore  = defineStore('Artists', () => {
    const artists = ref([]);
    const loading = ref(false);

    async function fetchArtists() {
        loading.value = true

        try {
            artists.value = await fetchArtistsFromDb()
        } catch (err) {
            console.error(err)
        } finally {
            loading.value = false
        }
    }
    return {artists, loading, fetchArtists}
})