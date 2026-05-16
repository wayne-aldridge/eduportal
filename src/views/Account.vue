<script setup>
import { computed } from 'vue'
import { accountProfile, enrolledCourses } from '../data/mockData'
import { currentStudentApplication } from '../data/enrollmentStore'

const application = computed(() => currentStudentApplication.value)

const accountDetails = computed(() => {
  if (!application.value) {
    return {
      name: accountProfile.name,
      email: accountProfile.email,
      studentId: accountProfile.studentId,
      role: 'Student',
      program: accountProfile.program,
      yearLevel: accountProfile.yearLevel,
      phone: 'Not provided',
      address: 'Not provided',
      status: 'No application submitted',
      studentType: 'Student',
    }
  }

  return {
    name: application.value.studentInfo.fullName,
    email: application.value.studentInfo.email,
    studentId: application.value.studentInfo.studentId || 'To be assigned by the school',
    role: 'Student',
    program: application.value.selectedCourse,
    yearLevel: application.value.studentInfo.yearLevel,
    phone: application.value.studentInfo.phone || application.value.studentInfo.phoneNumber,
    address: application.value.studentInfo.address,
    status: application.value.status,
    studentType: application.value.studentInfo.studentType,
  }
})

const statusBadgeLabel = computed(() => {
  if (!application.value) return 'No Application'
  return application.value.status === 'Pending' ? 'Pending Review' : application.value.status
})

const profileInitials = computed(() =>
  accountDetails.value.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join(''),
)

const profileFields = computed(() => [
  { label: 'Official Email', value: accountDetails.value.email },
  { label: 'Primary Phone', value: accountDetails.value.phone },
  { label: 'Residential Address', value: accountDetails.value.address },
  { label: 'Role', value: accountDetails.value.role },
  { label: 'Institutional ID', value: accountDetails.value.studentId },
  { label: 'Degree Program', value: accountDetails.value.program },
  { label: 'Class Level', value: accountDetails.value.yearLevel },
  { label: 'Enrollment Status', value: statusBadgeLabel.value },
])

const leftProfileFields = computed(() => profileFields.value.slice(0, 4))
const rightProfileFields = computed(() => profileFields.value.slice(4))
</script>

<template>
  <section class="dashboard-stack">
    <article class="panel account-profile-shell">
      <div class="account-profile-cover">
        <div class="account-profile-head">
          <div class="account-profile-main">
            <div class="account-profile-badge">{{ profileInitials }}</div>

            <div class="account-profile-intro">
              <p class="eyebrow">Student Profile</p>
              <h2>{{ accountDetails.name }}</h2>
            </div>
          </div>
        </div>
      </div>

      <div class="account-profile-grid">
        <section class="account-profile-section">
          <h3>Profile Information</h3>

          <div class="account-field-list">
            <div v-for="field in leftProfileFields" :key="field.label" class="account-field-row">
              <span>{{ field.label }}</span>
              <strong>{{ field.value }}</strong>
            </div>
          </div>
        </section>

        <section class="account-profile-section">
          <h3>Academic Status</h3>

          <div class="account-field-list">
            <div v-for="field in rightProfileFields" :key="field.label" class="account-field-row">
              <span>{{ field.label }}</span>
              <strong>{{ field.value }}</strong>
            </div>
          </div>
        </section>
      </div>
    </article>

    <article class="panel dashboard-pipeline-panel">
      <div class="panel-heading dashboard-panel-heading">
        <div>
          <h2>{{ application ? 'Enrollment Snapshot' : 'Sample Current Courses' }}</h2>
          <span class="inline-status pipeline-inline-status">
            {{ application ? 'Latest Application' : 'Reference View' }}
          </span>
        </div>
      </div>

      <div v-if="application" class="student-application-details">
        <div class="student-application-grid account-snapshot-grid">
          <div>
            <span>Selected Course</span>
            <strong>{{ application.selectedCourse }}</strong>
          </div>
          <div>
            <span>Enrollment Status</span>
            <strong>{{ statusBadgeLabel }}</strong>
          </div>
          <div class="student-application-field student-application-field-wide">
            <span>Requirements Submitted</span>
            <ul v-if="application.completedRequirements.length" class="requirement-checklist">
              <li v-for="item in application.completedRequirements" :key="item" class="requirement-checklist-item">
                <span class="requirement-check-icon" aria-hidden="true"></span>
                <span>{{ item }}</span>
              </li>
            </ul>
            <strong v-else>No requirements submitted yet.</strong>
          </div>
          <div class="student-application-field student-application-field-wide">
            <span>Pending Requirements</span>
            <ul v-if="application.pendingRequirements.length" class="requirement-pending-list">
              <li v-for="item in application.pendingRequirements" :key="item">{{ item }}</li>
            </ul>
            <strong v-else>All requirements complete.</strong>
          </div>
        </div>
      </div>

      <div v-else class="activity-grid account-activity-grid">
        <article v-for="course in enrolledCourses.slice(0, 3)" :key="course.code" class="activity-card">
          <h3>{{ course.code }}</h3>
          <p>{{ course.title }}</p>
          <p>{{ course.schedule }}</p>
        </article>
      </div>
    </article>
  </section>
</template>
