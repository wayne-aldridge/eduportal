<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { authenticateUser, startUserSession } from '../data/enrollmentStore'
import AppLogo from '../components/AppLogo.vue'

const router = useRouter()
const attemptedSubmit = ref(false)
const loginError = ref('')
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const fieldErrors = computed(() => {
  const errors = {
    email: '',
    password: '',
  }

  if (!form.email.trim()) errors.email = 'Email is required.'
  if (!form.password) errors.password = 'Password is required.'

  return errors
})

const handleLogin = async () => {
  attemptedSubmit.value = true
  loginError.value = ''

  if (fieldErrors.value.email || fieldErrors.value.password) return

  const matchedAccount = authenticateUser(form.email, form.password)

  if (!matchedAccount) {
    loginError.value = 'Invalid login credentials.'
    return
  }

  startUserSession(matchedAccount)
  await router.push(matchedAccount.role === 'Admin' ? '/admin' : '/dashboard')
}
</script>

<template>
  <section class="auth-section">
    <div class="auth-card auth-shell section-animate">
      <AppLogo centered class="auth-logo" />
      <p class="eyebrow">EduPortal Management System</p>
      <h1>ACCESS PORTAL</h1>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label :class="['field', { 'field-invalid': attemptedSubmit && fieldErrors.email }]">
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="student@eduportal.com" required />
          <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedSubmit && fieldErrors.email) }]">
            {{ fieldErrors.email || 'Email looks good.' }}
          </small>
        </label>

        <label :class="['field', { 'field-invalid': attemptedSubmit && fieldErrors.password }]">
          <span>Password</span>
          <div class="password-field">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              required
            />
            <button
              class="password-toggle"
              type="button"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  v-if="showPassword"
                  d="M3 4.5 19.5 21M10.6 10.7a2 2 0 0 0 2.8 2.8M9.9 5.1A10.9 10.9 0 0 1 12 4.9c5.2 0 9.4 4.6 10 7.1-.3 1.1-1.3 2.7-2.9 4.1M6.1 6.1C3.8 7.7 2.4 9.9 2 12c.6 2.5 4.8 7.1 10 7.1 1.5 0 2.9-.3 4.1-.8"
                />
                <path
                  v-else
                  d="M2 12s3.6-7.1 10-7.1S22 12 22 12s-3.6 7.1-10 7.1S2 12 2 12Z"
                />
                <circle v-if="!showPassword" cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
          <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedSubmit && fieldErrors.password) }]">
            {{ fieldErrors.password || 'Password looks good.' }}
          </small>
        </label>

        <p v-if="loginError" class="auth-error">{{ loginError }}</p>

        <button class="button button-gold full-width" type="submit">Login</button>
      </form>

      <p class="auth-helper">
        No account yet?
        <RouterLink to="/enrollment">Start enrollment</RouterLink>
      </p>
    </div>
  </section>
</template>
