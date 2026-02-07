import {collection, getDocs, query} from 'firebase/firestore'
import {db} from '@/firebase/firebase'

export async function fetchEventsFromDb() {
    const q = query(
        collection(db, 'Events')
    )

    const snapshot = await getDocs(q)
    console.log(snapshot)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

export async function fetchArtistsFromDb() {
    const q = query(
        collection(db, 'Artists')
    )
    const snapshot = await getDocs(q)
    console.log(snapshot)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}