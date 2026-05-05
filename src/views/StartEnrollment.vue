<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  studentType: 'New Student',
})

const attemptedSubmit = ref(false)

const emailValid = computed(() => /\S+@\S+\.\S+/.test(form.email))
const passwordsMatch = computed(() => form.password && form.password === form.confirmPassword)
const formComplete = computed(
  () =>
    form.fullName &&
    emailValid.value &&
    form.password &&
    passwordsMatch.value &&
    form.studentType,
)

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
          <label class="field field-span-2">
            <span>Full Name</span>
            <input v-model="form.fullName" type="text" required />
          </label>

          <label class="field field-span-2">
            <span>Email Address</span>
            <input v-model="form.email" type="email" required />
            <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedSubmit && !emailValid) }]">
              Enter a valid email address.
            </small>
          </label>

          <label class="field">
            <span>Password</span>
            <input v-model="form.password" type="password" required />
            <small class="field-feedback is-hidden">Password helper spacing</small>
          </label>

          <label class="field">
            <span>Confirm Password</span>
            <input v-model="form.confirmPassword" type="password" required />
            <small
              :class="[
                'error-text',
                'field-feedback',
                { 'is-hidden': !(attemptedSubmit && form.confirmPassword && !passwordsMatch) },
              ]"
            >
              Password and Confirm Password must match.
            </small>
          </label>

          <label class="field field-span-2">
            <span>Student Type</span>
            <select v-model="form.studentType">
              <option>New Student</option>
              <option>Transferee</option>
              <option>Returning Student</option>
            </select>
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
