import {collection, getDocs, query, addDoc, setDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore'
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
    } catch (err) {
        console.error(err)
    }
}

export async function addUserToDb(userId) {
    let resp = await setDoc(doc(db, "Users", userId), {
        Role: "user",
        createdAt: new Date()
    });
    console.log(resp)
}

const getUserById = async (uid) => {
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        console.log("No user found with that ID");
        return null;
    }
};

export async function hasRole(uid, role){
    const user = await getUserById(uid);
    console.log(user)
    if (!user) return false;
    return user.Role === role;
}

export async function alterInterested(eventId, uid, action) {
    try {
        const docRef = doc(db, "Events", eventId);
        if (action === 'add'){
            await updateDoc(docRef, {
                Interested: arrayUnion(uid)
            });
        }
        else{
            await updateDoc(docRef, {
                Interested: arrayRemove(uid)
            });
        }
        console.log(`Success`);
    } catch (err) {
        console.error("Error updating document:", err);
        throw err;
    }
}