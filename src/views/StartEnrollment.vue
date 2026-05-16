<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  studentType: 'New Student',
})

const attemptedSubmit = ref(false)

const emailPattern = /\S+@\S+\.\S+/

const fieldErrors = computed(() => {
  const errors = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentType: '',
  }

  if (!form.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!form.email.trim()) errors.email = 'Email address is required.'
  else if (!emailPattern.test(form.email)) errors.email = 'Enter a valid email address.'

  if (!form.password) errors.password = 'Password is required.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'

  if (!form.confirmPassword) errors.confirmPassword = 'Confirm Password is required.'
  else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Password and Confirm Password must match.'
  }

  if (!form.studentType) errors.studentType = 'Student type is required.'

  return errors
})

const formComplete = computed(() => Object.values(fieldErrors.value).every((error) => !error))

const handleSubmit = () => {
  attemptedSubmit.value = true
  if (!formComplete.value) return

  router.push('/enrollment?account=created')
}
</script>

<template>
  <section class="section start-enrollment-page">
    <div class="container">
      <div class="enrollment-header section-animate">
        <p class="eyebrow">Enrollment Protocol</p>
        <h1>Start Your Enrollment</h1>
        <p>
          Create your student account to begin your enrollment application and track your
          enrollment status.
        </p>
      </div>

      <article class="enrollment-shell start-registration-shell section-animate">
        <div class="enrollment-shell-top">
          <p class="enrollment-shell-label">Student Account Setup</p>
          <span class="enrollment-shell-dots" aria-hidden="true">•••</span>
        </div>

        <form
          class="enrollment-grid compact-enrollment-grid start-registration-form"
          @submit.prevent="handleSubmit"
          novalidate
        >
          <label :class="['field', 'field-span-2', { 'field-invalid': attemptedSubmit && fieldErrors.fullName }]">
            <span>Full Name</span>
            <input v-model="form.fullName" type="text" required />
            <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedSubmit && fieldErrors.fullName) }]">
              {{ fieldErrors.fullName || 'Full name looks good.' }}
            </small>
          </label>

          <label :class="['field', 'field-span-2', { 'field-invalid': attemptedSubmit && fieldErrors.email }]">
            <span>Email Address</span>
            <input v-model="form.email" type="email" required />
            <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedSubmit && fieldErrors.email) }]">
              {{ fieldErrors.email || 'Email address looks good.' }}
            </small>
          </label>

          <label :class="['field', { 'field-invalid': attemptedSubmit && fieldErrors.password }]">
            <span>Password</span>
            <div class="password-field">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required />
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

          <label :class="['field', { 'field-invalid': attemptedSubmit && fieldErrors.confirmPassword }]">
            <span>Confirm Password</span>
            <div class="password-field">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
              />
              <button
                class="password-toggle"
                type="button"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    v-if="showConfirmPassword"
                    d="M3 4.5 19.5 21M10.6 10.7a2 2 0 0 0 2.8 2.8M9.9 5.1A10.9 10.9 0 0 1 12 4.9c5.2 0 9.4 4.6 10 7.1-.3 1.1-1.3 2.7-2.9 4.1M6.1 6.1C3.8 7.7 2.4 9.9 2 12c.6 2.5 4.8 7.1 10 7.1 1.5 0 2.9-.3 4.1-.8"
                  />
                  <path
                    v-else
                    d="M2 12s3.6-7.1 10-7.1S22 12 22 12s-3.6 7.1-10 7.1S2 12 2 12Z"
                  />
                  <circle v-if="!showConfirmPassword" cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <small
              :class="[
                'error-text',
                'field-feedback',
                { 'is-hidden': !(attemptedSubmit && fieldErrors.confirmPassword) },
              ]"
            >
              {{ fieldErrors.confirmPassword || 'Passwords match.' }}
            </small>
          </label>

          <label :class="['field', 'field-span-2', { 'field-invalid': attemptedSubmit && fieldErrors.studentType }]">
            <span>Student Type</span>
            <select v-model="form.studentType">
              <option>New Student</option>
              <option>Continuing Student</option>
              <option>Transferee</option>
              <option>Returning Student</option>
            </select>
            <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedSubmit && fieldErrors.studentType) }]">
              {{ fieldErrors.studentType || 'Student type looks good.' }}
            </small>
          </label>

          <div class="field field-span-2 student-id-note">
            <span>Program Selection</span>
            <p>You will choose your academic program in the next enrollment step.</p>
          </div>

          <button class="button button-gold full-width field-span-2" type="submit">
            Create Account and Continue
          </button>
        </form>
      </article>
    </div>
  </section>
</template>
