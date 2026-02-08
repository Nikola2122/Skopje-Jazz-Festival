import {collection, getDocs, query, addDoc} from 'firebase/firestore'
import {db} from '@/firebase/firebase'

export async function fetchFromDb(coll) {
    const q = query(
        collection(db, coll)
    )

    const snapshot = await getDocs(q)
    console.log(snapshot)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}


export async function addToDb(coll, doc) {
    try {
        let resp = await addDoc(collection(db, coll),
            doc
        )
        console.log(resp)
    }
    catch (err) {
        console.error(err)
    }
}