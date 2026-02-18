import {defineStore} from "pinia";
import {ref} from "vue";
import {fetchFromDb} from "@/firebase/utils/services.js";

export const useEventsStore = defineStore('events', () => {
    const events = ref([]);


    async function fetchEvents() {
        try {
            events.value = await fetchFromDb('Events')
            events.value = events.value
                .filter((e) => {
                    const loc = (e?.Location ?? '').toString().toLowerCase();
                    return loc.includes('skopje') || loc.includes('скопје');
                })
                .filter((e) => {
                    const parseDate = (str) => {
                        if (!str || typeof str !== 'string') return null;
                        const s = str.trim();
                        if (!s || s.toUpperCase() === 'TBA') return null;

                        // dd/mm/yyyy
                        if (s.includes('/')) {
                            const [day, month, year] = s.split('/').map(Number);
                            if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                                return new Date(year, month - 1, day);
                            }
                        }

                        // dd-mm-yyyy OR yyyy-mm-dd
                        if (s.includes('-')) {
                            const raw = s.split('-');
                            const parts = raw.map(Number);
                            if (parts.length === 3) {
                                if (raw[0].length === 4) {
                                    const [year, month, day] = parts;
                                    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                                        return new Date(year, month - 1, day);
                                    }
                                } else {
                                    const [day, month, year] = parts;
                                    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                                        return new Date(year, month - 1, day);
                                    }
                                }
                            }
                        }

                        const d = new Date(s);
                        return Number.isNaN(d.getTime()) ? null : d;
                    };

                    const d = parseDate(e.Date);
                    if (!d) return false;

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    d.setHours(0, 0, 0, 0);

                    return d >= today;
                }).sort((a, b) => {
                    const parseDate = (str) => {
                        if (!str || typeof str !== 'string') return new Date(0);
                        const s = str.trim();
                        if (!s || s.toUpperCase() === 'TBA') return new Date(0);

                        if (s.includes('/')) {
                            const [day, month, year] = s.split('/').map(Number);
                            if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                                return new Date(year, month - 1, day);
                            }
                        }

                        if (s.includes('-')) {
                            const raw = s.split('-');
                            const parts = raw.map(Number);
                            if (parts.length === 3) {
                                if (raw[0].length === 4) {
                                    const [year, month, day] = parts;
                                    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                                        return new Date(year, month - 1, day);
                                    }
                                } else {
                                    const [day, month, year] = parts;
                                    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                                        return new Date(year, month - 1, day);
                                    }
                                }
                            }
                        }

                        const d = new Date(s);
                        return Number.isNaN(d.getTime()) ? new Date(0) : d;
                    };

                    return parseDate(b.Date) - parseDate(a.Date);
                })
            console.log(events.value)
        } catch (err) {
            console.error(err)
        }
    }

    return {events, fetchEvents}
})