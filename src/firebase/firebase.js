import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: 'AIzaSyAkgz9sPVz_pLZZe70pLMD_-6fYzLQSWZQ',
    authDomain: 'skopje-jazz-fest.firebaseapp.com',
    projectId: 'skopje-jazz-fest',
    appId: '1:87820059798:web:f8f93cda6e26c60ed6eeb7',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)