<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  enrollmentCourseOptions,
  enrollmentRequirementItems,
  saveEnrollmentSubmission,
} from '../data/enrollmentStore'

const route = useRoute()

const form = reactive({
  selectedCourse: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  birthdate: '',
  gender: '',
  yearLevel: '',
  studentType: 'New Student',
  password: '',
  confirmPassword: '',
})

const currentStep = ref(1)
const submitted = ref(false)
const attemptedStudentInfo = ref(false)
const attemptedAccountSubmit = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const requirements = reactive(
  enrollmentRequirementItems.map((item) => ({
    label: item,
    completed: false,
  })),
)

const emailPattern = /\S+@\S+\.\S+/
const phonePattern = /^09\d{9}$/

const sanitizePhoneInput = () => {
  form.phone = form.phone.replace(/\D/g, '').slice(0, 11)
}

const applyCourseSelectionFromQuery = () => {
  const requestedCourse = typeof route.query.course === 'string' ? route.query.course : ''
  const matchedCourse = enrollmentCourseOptions.find((course) => course.title === requestedCourse)
  if (matchedCourse) {
    form.selectedCourse = matchedCourse.title
  }
}

applyCourseSelectionFromQuery()

const steps = [
  'Choose Course',
  'Student Information',
  'Requirements Checklist',
  'Review Application',
  'Create Account',
]

const selectedRequirements = computed(() =>
  requirements.filter((item) => item.completed).map((item) => item.label),
)

const pendingRequirements = computed(() =>
  requirements.filter((item) => !item.completed).map((item) => item.label),
)

const birthdateValue = computed(() => form.birthdate)

const calculateAge = (birthdate) => {
  if (!birthdate) return ''

  const today = new Date()
  const selectedDate = new Date(`${birthdate}T00:00:00`)
  if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) return ''

  let age = today.getFullYear() - selectedDate.getFullYear()
  const monthDifference = today.getMonth() - selectedDate.getMonth()
  const dayDifference = today.getDate() - selectedDate.getDate()

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1
  }

  return age >= 0 ? String(age) : ''
}

const ageValue = computed(() => calculateAge(birthdateValue.value))

const formattedBirthdate = computed(() => {
  if (!form.birthdate) return ''

  const [year, month, day] = form.birthdate.split('-')
  return `${day}/${month}/${year}`
})

const studentErrors = computed(() => {
  const errors = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    birthdate: '',
    age: '',
    gender: '',
    yearLevel: '',
    studentType: '',
  }

  if (!form.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!form.email.trim()) errors.email = 'Email address is required.'
  else if (!emailPattern.test(form.email)) errors.email = 'Enter a valid email address.'

  if (!form.phone.trim()) errors.phone = 'Phone number is required.'
  else if (!phonePattern.test(form.phone)) {
    errors.phone = 'Phone number must contain 11 digits.'
  }

  if (!form.address.trim()) errors.address = 'Address is required.'
  if (!form.birthdate) errors.birthdate = 'Birthdate is required.'
  else if (new Date(`${birthdateValue.value}T00:00:00`) > new Date()) {
    errors.birthdate = 'Birthdate cannot be in the future.'
  } else if (Number.isNaN(new Date(`${birthdateValue.value}T00:00:00`).getTime())) {
    errors.birthdate = 'Enter a valid birthdate.'
  }
  if (!ageValue.value) errors.age = 'Age will appear after choosing a valid birthdate.'
  if (!form.gender) errors.gender = 'Gender is required.'
  if (!form.yearLevel) errors.yearLevel = 'Year level is required.'
  if (!form.studentType) errors.studentType = 'Student type is required.'

  return errors
})

const studentFieldsComplete = computed(() =>
  Object.values(studentErrors.value).every((error) => !error),
)

const accountErrors = computed(() => {
  const errors = {
    password: '',
    confirmPassword: '',
  }

  if (!form.password) errors.password = 'Password is required.'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'

  if (!form.confirmPassword) errors.confirmPassword = 'Confirm Password is required.'
  else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Password and Confirm Password must match.'
  }

  return errors
})

const accountFieldsComplete = computed(() =>
  Object.values(accountErrors.value).every((error) => !error),
)

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
  if (currentStep.value === 2) {
    attemptedStudentInfo.value = true
  }
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
  attemptedStudentInfo.value = true
  attemptedAccountSubmit.value = true
  if (!studentFieldsComplete.value || !accountFieldsComplete.value) return

  saveEnrollmentSubmission({
    selectedCourse: form.selectedCourse,
    studentInfo: {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      birthdate: birthdateValue.value,
      age: ageValue.value,
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

      <article
        :class="[
          'enrollment-shell',
          'section-animate',
          { 'enrollment-shell-wide': currentStep === 4 || currentStep === 5 },
        ]"
      >
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
                  :key="course.title"
                  type="button"
                  :class="['course-option-card', { selected: form.selectedCourse === course.title }]"
                  @click="form.selectedCourse = course.title"
                >
                  <img class="course-option-image" :src="course.image" :alt="course.alt" />
                  <div class="course-option-copy">
                    <span class="badge">{{ course.category }}</span>
                    <h3>{{ course.title }}</h3>
                    <p>{{ course.description }}</p>
                    <small>{{ course.duration }}</small>
                  </div>
                </button>
              </div>
            </div>

            <form
              v-else-if="currentStep === 2 && !submitted"
              class="enrollment-grid compact-enrollment-grid"
              @submit.prevent
              novalidate
            >
              <label :class="['field', 'field-span-2', { 'field-invalid': attemptedStudentInfo && studentErrors.fullName }]">
                <span>Full Name</span>
                <input v-model="form.fullName" type="text" />
                <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.fullName) }]">
                  {{ studentErrors.fullName || 'Full name looks good.' }}
                </small>
              </label>

              <label :class="['field', 'field-span-2', { 'field-invalid': attemptedStudentInfo && studentErrors.email }]">
                <span>Email Address</span>
                <input v-model="form.email" type="email" />
                <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.email) }]">
                  {{ studentErrors.email || 'Email address looks good.' }}
                </small>
              </label>

              <label :class="['field', { 'field-invalid': attemptedStudentInfo && studentErrors.phone }]">
                <span>Phone Number</span>
                <div class="phone-input-group">
                  <span class="phone-prefix" aria-hidden="true">PH</span>
                  <input
                    v-model="form.phone"
                    type="text"
                    inputmode="numeric"
                    maxlength="11"
                    pattern="[0-9]*"
                    placeholder="09XXXXXXXXX"
                    @input="sanitizePhoneInput"
                  />
                </div>
                <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.phone) }]">
                  {{ studentErrors.phone || 'Phone number looks good.' }}
                </small>
              </label>

              <label :class="['field', { 'field-invalid': attemptedStudentInfo && studentErrors.yearLevel }]">
                <span>Year Level</span>
                <select v-model="form.yearLevel">
                  <option value="">Select year level</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
                <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.yearLevel) }]">
                  {{ studentErrors.yearLevel || 'Year level looks good.' }}
                </small>
              </label>

              <label :class="['field', 'field-span-2', { 'field-invalid': attemptedStudentInfo && studentErrors.address }]">
                <span>Address</span>
                <textarea
                  v-model="form.address"
                  rows="4"
                  placeholder="Unit/House Number and Street, Subdivision/Village (if any), Barangay, City/Municipality, ZIP Code, and Province"
                ></textarea>
                <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.address) }]">
                  {{ studentErrors.address || 'Address looks good.' }}
                </small>
              </label>

              <div class="birthdate-age-row field-span-2">
                <label :class="['field', { 'field-invalid': attemptedStudentInfo && (studentErrors.birthdate || studentErrors.age) }]">
                  <span>Birthdate</span>
                  <input v-model="form.birthdate" type="date" />
                  <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.birthdate) }]">
                    {{ studentErrors.birthdate || 'Birthdate looks good.' }}
                  </small>
                </label>

                <label :class="['field', { 'field-invalid': attemptedStudentInfo && studentErrors.age }]">
                  <span>Age</span>
                  <input :value="ageValue" type="text" readonly placeholder="Auto-calculated" />
                  <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.age) }]">
                    {{ studentErrors.age || 'Age is calculated from the birthdate.' }}
                  </small>
                </label>
              </div>

              <label :class="['field', { 'field-invalid': attemptedStudentInfo && studentErrors.gender }]">
                <span>Gender</span>
                <select v-model="form.gender">
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </select>
                <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.gender) }]">
                  {{ studentErrors.gender || 'Gender looks good.' }}
                </small>
              </label>

              <label :class="['field', { 'field-invalid': attemptedStudentInfo && studentErrors.studentType }]">
                <span>Student Type</span>
                <select v-model="form.studentType">
                  <option>New Student</option>
                  <option>Continuing Student</option>
                  <option>Transferee</option>
                  <option>Returning Student</option>
                </select>
                <small :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedStudentInfo && studentErrors.studentType) }]">
                  {{ studentErrors.studentType || 'Student type looks good.' }}
                </small>
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
                Review your enrollment details carefully before creating your account and
                submitting your application.
              </p>
              <div class="review-document">
                <section class="review-section">
                  <div class="review-section-head">
                    <h3>Application Summary</h3>
                    <span class="status-pill pending-review review-status-pill">Ready for Submission</span>
                  </div>
                  <div class="review-summary-grid">
                    <div class="review-item">
                      <span>Selected Program</span>
                      <strong>{{ form.selectedCourse }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Student Type</span>
                      <strong>{{ form.studentType }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Year Level</span>
                      <strong>{{ form.yearLevel }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Application Status</span>
                      <strong>Ready for Submission</strong>
                    </div>
                  </div>
                </section>

                <div class="review-divider"></div>

                <section class="review-section">
                  <div class="review-section-head">
                    <h3>Student Information</h3>
                  </div>
                  <div class="review-info-grid">
                    <div class="review-item">
                      <span>Full Name</span>
                      <strong>{{ form.fullName }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Email Address</span>
                      <strong>{{ form.email }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Phone Number</span>
                      <strong>{{ form.phone }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Address</span>
                      <strong>{{ form.address }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Birthdate</span>
                      <strong>{{ formattedBirthdate }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Age</span>
                      <strong>{{ ageValue }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Gender</span>
                      <strong>{{ form.gender }}</strong>
                    </div>
                    <div class="review-item">
                      <span>Student ID</span>
                      <strong>To be assigned by the school</strong>
                    </div>
                  </div>
                </section>

                <div class="review-divider"></div>

                <section class="review-section">
                  <div class="review-section-head">
                    <h3>Requirements Summary</h3>
                  </div>
                  <div class="review-requirements-grid">
                    <div class="review-requirements-column">
                      <div class="review-requirements-head">
                        <h4>Completed Requirements</h4>
                        <span class="status-pill status-approved review-status-pill">Complete</span>
                      </div>
                      <ul class="plain-list review-list">
                        <li v-for="item in selectedRequirements" :key="item">{{ item }}</li>
                        <li v-if="!selectedRequirements.length">No completed requirements selected yet.</li>
                      </ul>
                    </div>

                    <div class="review-requirements-column">
                      <div class="review-requirements-head">
                        <h4>Pending Requirements</h4>
                        <span class="status-pill review-pending-pill">Pending</span>
                      </div>
                      <ul class="plain-list review-list">
                        <li v-for="item in pendingRequirements" :key="item">{{ item }}</li>
                        <li v-if="!pendingRequirements.length">All requirements are marked complete.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div class="review-divider"></div>

                <section class="review-section">
                  <div class="review-notice">
                    By continuing, your student account will be created using the email address
                    provided, and your enrollment application will be submitted for admin review.
                  </div>
                </section>
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

              <div class="account-summary-panel">
                <div class="account-summary-row">
                  <span>Full Name</span>
                  <strong>{{ form.fullName }}</strong>
                </div>
                <div class="account-summary-row">
                  <span>Email Address</span>
                  <strong>{{ form.email }}</strong>
                </div>
              </div>

              <form class="enrollment-grid compact-enrollment-grid final-account-grid" @submit.prevent="handleSubmit">
                <label :class="['field', { 'field-invalid': attemptedAccountSubmit && accountErrors.password }]">
                  <span>Password</span>
                  <div class="password-field">
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'" />
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
                  <small
                    :class="['error-text', 'field-feedback', { 'is-hidden': !(attemptedAccountSubmit && accountErrors.password) }]"
                  >
                    {{ accountErrors.password || 'Password looks good.' }}
                  </small>
                </label>

                <label :class="['field', { 'field-invalid': attemptedAccountSubmit && accountErrors.confirmPassword }]">
                  <span>Confirm Password</span>
                  <div class="password-field">
                    <input
                      v-model="form.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
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
                      { 'is-hidden': !(attemptedAccountSubmit && accountErrors.confirmPassword) },
                    ]"
                  >
                    {{ accountErrors.confirmPassword || 'Passwords match.' }}
                  </small>
                </label>

                <div class="field-span-2 final-account-actions">
                  <button class="button button-outline" type="button" @click="goBack">
                    Back to Review
                  </button>
                  <button class="button button-gold" type="submit">
                    Submit Enrollment
                  </button>
                </div>
              </form>
            </div>

            <div v-else class="step-panel success-panel">
              <span class="status-pill pending-review">Pending Review</span>
              <h2>Enrollment application submitted successfully. Your request is pending admin review.</h2>
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
            :disabled="currentStep === 1 && !canProceed"
            @click="goNext"
          >
            Next
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
