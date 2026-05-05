<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Student',
})

const submitted = ref(false)

const handleRegister = () => {
  submitted.value = true
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.role = 'Student'
}
</script>

<template>
  <section class="auth-section">
    <div class="auth-card auth-shell section-animate">
      <div class="auth-mark">🎓</div>
      <p class="eyebrow">Create Student Access</p>
      <h1>REGISTER ACCOUNT</h1>

      <form class="auth-form" @submit.prevent="handleRegister">
        <label class="field">
          <span>Full Name</span>
          <input v-model="form.name" type="text" required />
        </label>
        <label class="field">
          <span>Email</span>
          <input v-model="form.email" type="email" required />
        </label>
        <label class="field">
          <span>Password</span>
          <input v-model="form.password" type="password" required />
        </label>
        <label class="field">
          <span>Confirm Password</span>
          <input v-model="form.confirmPassword" type="password" required />
        </label>
        <label class="field">
          <span>Role</span>
          <select v-model="form.role">
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>
        </label>

        <button class="button button-dark full-width" type="submit">Register</button>
        <p v-if="submitted" class="success-message">
          Registration successful! Your account is ready for enrollment access.
        </p>
        <RouterLink v-if="submitted" class="button button-gold full-width" to="/login">
          Proceed to Login
        </RouterLink>
      </form>

      <p class="auth-helper">
        Already registered?
        <RouterLink to="/login">Go to login</RouterLink>
      </p>
    </div>
  </section>
</template>
