<script setup>
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  role: 'Student',
})

const handleLogin = async () => {
  await router.push('/dashboard')
}
</script>

<template>
  <section class="auth-section">
    <div class="auth-card auth-shell section-animate">
      <div class="auth-mark">🎓</div>
      <p class="eyebrow">EduPortal Management System</p>
      <h1>ACCESS PORTAL</h1>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label class="field">
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="alexj@student.edu" required />
        </label>
        <label class="field">
          <span>Password</span>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </label>
        <label class="field">
          <span>Role</span>
          <select v-model="form.role">
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>
        </label>

        <button class="button button-gold full-width" type="submit">Login</button>
      </form>

      <p class="auth-helper">
        No account yet?
        <RouterLink to="/enrollment">Start enrollment</RouterLink>
      </p>
    </div>
  </section>
</template>
