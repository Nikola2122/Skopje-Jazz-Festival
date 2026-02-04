<script setup>
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "vue-router"

const auth = getAuth()
const router = useRouter()

const logout = async () => {
  try {
    await signOut(auth)
    router.push("/login") // or wherever you want
  } catch (error) {
    console.error("Logout error:", error)
  }
}
</script>

<template>
  <button @click="logout" class="logout-btn">
    Log out
  </button>
</template>

<style scoped>
.logout-btn {
  padding: 8px 14px;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c62828;
}
</style>
