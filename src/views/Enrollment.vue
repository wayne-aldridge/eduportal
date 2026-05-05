<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  enrollmentCourseOptions,
  enrollmentRequirementItems,
  saveEnrollmentSubmission,
} from '../data/enrollmentStore'

const defaultBirthdate = new Date()
defaultBirthdate.setFullYear(defaultBirthdate.getFullYear() - 18)
const defaultBirthdateValue = defaultBirthdate.toISOString().split('T')[0]

const form = reactive({
  selectedCourse: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  birthdate: defaultBirthdateValue,
  gender: '',
  yearLevel: '',
  studentType: 'New Student',
  password: '',
  confirmPassword: '',
})

const currentStep = ref(1)
const submitted = ref(false)
const attemptedSubmit = ref(false)
const requirements = reactive(
  enrollmentRequirementItems.map((item) => ({
    label: item,
    completed: false,
  })),
)

const steps = [
  'Choose Course',
  'Student Information',
  'Requirements Checklist',
  'Review Application',
  'Create Account & Submit Enrollment',
]

const selectedRequirements = computed(() =>
  requirements.filter((item) => item.completed).map((item) => item.label),
)

const pendingRequirements = computed(() =>
  requirements.filter((item) => !item.completed).map((item) => item.label),
)

const studentFieldsComplete = computed(
  () =>
    form.fullName &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone &&
    form.address &&
    form.birthdate &&
    form.gender &&
    form.yearLevel &&
    form.studentType,
)

const passwordsMatch = computed(() => form.password && form.password === form.confirmPassword)

const canProceed = computed(() => {
  if (currentStep.value === 1) return Boolean(form.selectedCourse)
  if (currentStep.value === 2) return Boolean(studentFieldsComplete.value)
  if (currentStep.value === 3) return true
  if (currentStep.value === 4) return true
  return false
})

const shellLabel = computed(() => `Step ${currentStep.value}: ${steps[currentStep.value - 1]}`)

const scrollToStepTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const goNext = () => {
  if (!canProceed.value) return
  currentStep.value += 1
  scrollToStepTop()
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value -= 1
    scrollToStepTop()
  }
}

const handleSubmit = () => {
  attemptedSubmit.value = true
  if (!form.password || !form.confirmPassword || !passwordsMatch.value) return

  saveEnrollmentSubmission({
    selectedCourse: form.selectedCourse,
    studentInfo: {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      birthdate: form.birthdate,
      gender: form.gender,
      yearLevel: form.yearLevel,
      studentType: form.studentType,
    },
    completedRequirements: selectedRequirements.value,
  })

  submitted.value = true
}
</script>

<template>
  <section class="section enrollment-page">
    <div class="container">
      <div class="enrollment-header section-animate">
        <p class="eyebrow">Academic Registry</p>
        <h1>ENROLLMENT PROTOCOL</h1>
      </div>

      <div class="step-indicator section-animate" aria-label="Enrollment progress">
        <div
          v-for="(step, index) in steps"
          :key="step"
          :class="[
            'step-chip',
            {
              active: currentStep === index + 1,
              completed: currentStep > index + 1 || submitted,
            },
          ]"
        >
          <span class="step-number">{{ index + 1 }}</span>
          <span class="step-text">{{ step }}</span>
        </div>
      </div>

      <article :class="['enrollment-shell', 'section-animate', { 'enrollment-shell-wide': currentStep === 4 }]">
        <div class="enrollment-shell-top">
          <p class="enrollment-shell-label">{{ shellLabel }}</p>
          <span class="enrollment-shell-dots" aria-hidden="true">•••</span>
        </div>

        <Transition name="page-fade" mode="out-in">
          <div :key="submitted ? 'success' : currentStep">
            <div v-if="currentStep === 1 && !submitted" class="step-panel">
              <h2>Choose Course</h2>
              <p class="step-description">
                Select the academic program you want to apply for before continuing.
              </p>
              <div class="course-option-grid">
                <button
                  v-for="course in enrollmentCourseOptions"
                  :key="course"
                  type="button"
                  :class="['course-option-card', { selected: form.selectedCourse === course }]"
                  @click="form.selectedCourse = course"
                >
                  <span class="badge">Program</span>
                  <h3>{{ course }}</h3>
                </button>
              </div>
            </div>

            <form
              v-else-if="currentStep === 2 && !submitted"
              class="enrollment-grid compact-enrollment-grid"
              @submit.prevent
              novalidate
            >
              <label class="field field-span-2">
                <span>Full Name</span>
                <input v-model="form.fullName" type="text" />
              </label>

              <label class="field field-span-2">
                <span>Email Address</span>
                <input v-model="form.email" type="email" />
              </label>

              <label class="field">
                <span>Phone Number</span>
                <input v-model="form.phone" type="tel" />
              </label>

              <label class="field">
                <span>Year Level</span>
                <select v-model="form.yearLevel">
                  <option value="">Select year level</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </label>

              <label class="field field-span-2">
                <span>Address</span>
                <textarea v-model="form.address" rows="4"></textarea>
              </label>

              <label class="field">
                <span>Birthdate</span>
                <input v-model="form.birthdate" :max="defaultBirthdateValue" type="date" />
              </label>

              <label class="field">
                <span>Gender</span>
                <select v-model="form.gender">
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </select>
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
                <span>Student ID</span>
                <p>Student ID will be assigned by the school after enrollment review.</p>
              </div>
            </form>

            <div v-else-if="currentStep === 3 && !submitted" class="step-panel">
              <h2>Requirements Checklist</h2>
              <p class="step-description">Mark the requirements you are ready to submit.</p>
              <div class="requirements-grid">
                <label
                  v-for="item in requirements"
                  :key="item.label"
                  class="requirement-card"
                >
                  <input v-model="item.completed" type="checkbox" />
                  <span>{{ item.label }}</span>
                </label>
              </div>
            </div>

            <div v-else-if="currentStep === 4 && !submitted" class="step-panel review-panel review-panel-wide">
              <h2>Review Application</h2>
              <p class="step-description">
                Review your enrollment details carefully before proceeding to account creation.
              </p>
              <div class="review-grid">
                <article class="review-card">
                  <h3>Selected Course</h3>
                  <div class="review-details">
                    <p><strong>Program:</strong> {{ form.selectedCourse }}</p>
                  </div>
                </article>
                <article class="review-card">
                  <h3>Student Information</h3>
                  <div class="review-details">
                    <p><strong>Full Name:</strong> {{ form.fullName }}</p>
                    <p><strong>Email Address:</strong> {{ form.email }}</p>
                    <p><strong>Phone Number:</strong> {{ form.phone }}</p>
                    <p><strong>Address:</strong> {{ form.address }}</p>
                    <p><strong>Birthdate:</strong> {{ form.birthdate }}</p>
                    <p><strong>Gender:</strong> {{ form.gender }}</p>
                    <p><strong>Year Level:</strong> {{ form.yearLevel }}</p>
                    <p><strong>Student Type:</strong> {{ form.studentType }}</p>
                    <p><strong>Student ID:</strong> To be assigned by the school</p>
                  </div>
                </article>
                <article class="review-card">
                  <h3>Completed Requirements</h3>
                  <ul class="plain-list review-list">
                    <li v-for="item in selectedRequirements" :key="item">{{ item }}</li>
                    <li v-if="!selectedRequirements.length">No completed requirements selected yet.</li>
                  </ul>
                </article>
                <article class="review-card">
                  <h3>Pending Requirements</h3>
                  <ul class="plain-list review-list">
                    <li v-for="item in pendingRequirements" :key="item">{{ item }}</li>
                    <li v-if="!pendingRequirements.length">All requirements are marked complete.</li>
                  </ul>
                </article>
              </div>

              <div class="review-step-actions">
                <button class="button button-outline" type="button" @click="goBack">
                  Back
                </button>
                <button class="button button-gold" type="button" @click="goNext">
                  Continue
                </button>
              </div>
            </div>

            <div v-else-if="currentStep === 5 && !submitted" class="step-panel">
              <h2>Create Account &amp; Submit Enrollment</h2>
              <p class="step-description">
                Your student account will be created using the information you already provided.
              </p>

              <div class="review-grid">
                <article class="review-card">
                  <h3>Full Name</h3>
                  <p>{{ form.fullName }}</p>
                </article>
                <article class="review-card">
                  <h3>Email Address</h3>
                  <p>{{ form.email }}</p>
                </article>
              </div>

              <form class="enrollment-grid compact-enrollment-grid final-account-grid" @submit.prevent="handleSubmit">
                <label class="field">
                  <span>Password</span>
                  <input v-model="form.password" type="password" />
                  <small
                    :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedSubmit && !form.password) }]"
                  >
                    Password is required.
                  </small>
                </label>

                <label class="field">
                  <span>Confirm Password</span>
                  <input v-model="form.confirmPassword" type="password" />
                  <small
                    :class="[
                      'error-text',
                      'field-feedback',
                      { 'is-hidden': !(attemptedSubmit && (!form.confirmPassword || !passwordsMatch)) },
                    ]"
                  >
                    {{ !form.confirmPassword ? 'Confirm Password is required.' : 'Password and Confirm Password must match.' }}
                  </small>
                </label>

                <div class="field-span-2">
                  <div class="final-step-actions">
                    <button class="button button-outline" type="button" @click="goBack">
                      Back to Review
                    </button>
                  </div>
                  <button class="button button-gold full-width" type="submit">
                    Create Account &amp; Submit Enrollment
                  </button>
                </div>
              </form>
            </div>

            <div v-else class="step-panel success-panel">
              <span class="status-pill pending-review">Pending Review</span>
              <h2>Your account has been created and your enrollment application has been submitted successfully.</h2>
              <RouterLink class="button button-dark enrollment-next" to="/dashboard">
                View Student Dashboard
              </RouterLink>
            </div>
          </div>
        </Transition>

        <div v-if="currentStep < 5 && currentStep !== 4 && !submitted" class="step-actions">
          <button
            class="button button-outline compact"
            type="button"
            :disabled="currentStep === 1"
            @click="goBack"
          >
            Back
          </button>

          <button
            v-if="currentStep < 4"
            class="button button-gold compact"
            type="button"
            :disabled="!canProceed"
            @click="goNext"
          >
            Next
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
