<script setup>
import { computed } from 'vue'
import { accountProfile } from '../data/mockData'
import { currentStudentApplication } from '../data/enrollmentStore'

const application = computed(() => currentStudentApplication.value)

const dashboardData = computed(() => {
  if (application.value) {
    return {
      studentId: application.value.studentInfo.studentId || 'To be assigned by the school',
      program: application.value.selectedCourse,
      yearLevel: application.value.studentInfo.yearLevel,
      status: application.value.status,
      studentName: application.value.studentInfo.fullName,
      email: application.value.studentInfo.email,
      phone: application.value.studentInfo.phone || application.value.studentInfo.phoneNumber,
      address: application.value.studentInfo.address,
      studentType: application.value.studentInfo.studentType,
      completedRequirements: application.value.completedRequirements,
      submittedAt: application.value.submittedAt,
    }
  }

  return {
    studentId: accountProfile.studentId,
    program: accountProfile.program,
    yearLevel: accountProfile.yearLevel,
    status: 'No application submitted',
    studentName: accountProfile.name,
    email: accountProfile.email,
    phone: 'Not provided',
    address: 'Not provided',
    studentType: 'Student',
    completedRequirements: [],
    submittedAt: '',
  }
})

const statusBadgeLabel = computed(() => {
  if (!application.value) return 'No Application'
  return application.value.status === 'Pending' ? 'Pending Review' : application.value.status
})

const pipelineItems = computed(() => {
  if (!application.value) {
    return [
      { label: 'Personal Information Submitted', status: 'Pending' },
      { label: 'Course Selection Completed', status: 'Pending' },
      { label: 'Enrollment Form Submitted', status: 'Pending' },
      { label: 'Requirements Verification', status: 'Pending' },
      { label: 'Final Approval', status: 'Pending' },
    ]
  }

  return [
    { label: 'Personal Information Submitted', status: 'Completed' },
    { label: 'Course Selection Completed', status: 'Completed' },
    { label: 'Enrollment Form Submitted', status: 'Completed' },
    {
      label: 'Requirements Verification',
      status: application.value.status === 'Pending' ? 'Pending' : 'Completed',
    },
    {
      label: 'Final Approval',
      status: application.value.status === 'Approved' ? 'Completed' : 'Pending',
    },
  ]
})

const applicationCardTitle = computed(() =>
  application.value?.status === 'Approved' ? 'My Enrolled Course' : 'Enrollment Application',
)

const formattedSubmissionDate = computed(() => {
  if (!dashboardData.value.submittedAt) return 'Not submitted yet'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dashboardData.value.submittedAt))
})
</script>

<template>
  <section class="dashboard-stack">
    <section class="welcome-panel dashboard-hero">
      <div class="dashboard-hero-copy">
        <p class="eyebrow">Academic Portal</p>
        <h2>Welcome back, {{ dashboardData.studentName }}!</h2>
        <p class="admin-hero-copy">Here is your enrollment overview for this semester.</p>

        <div class="student-overview hero-overview">
          <div>
            <span>Student ID</span>
            <strong>{{ dashboardData.studentId }}</strong>
          </div>
          <div>
            <span>Program</span>
            <strong>{{ dashboardData.program }}</strong>
          </div>
          <div>
            <span>Year Level</span>
            <strong>{{ dashboardData.yearLevel }}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{{ dashboardData.status }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="dashboard-two-column student-dashboard-grid">
      <article class="panel dashboard-table-panel">
        <div class="panel-heading dashboard-panel-heading">
          <div>
            <h2>{{ applicationCardTitle }}</h2>
            <span class="inline-status">Latest Submission</span>
          </div>
        </div>

        <div class="student-application-details">
          <div class="student-application-grid">
            <div>
              <span>Selected Course</span>
              <strong>{{ dashboardData.program }}</strong>
            </div>
            <div>
              <span>Student Name</span>
              <strong>{{ dashboardData.studentName }}</strong>
            </div>
            <div>
              <span>Email Address</span>
              <strong>{{ dashboardData.email }}</strong>
            </div>
            <div>
              <span>Student Type</span>
              <strong>{{ dashboardData.studentType }}</strong>
            </div>
            <div class="student-application-field student-application-field-wide">
              <span>Requirements Submitted</span>
              <ul v-if="dashboardData.completedRequirements.length" class="requirement-checklist">
                <li v-for="item in dashboardData.completedRequirements" :key="item" class="requirement-checklist-item">
                  <span class="requirement-check-icon" aria-hidden="true"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <strong v-else>No requirements submitted yet.</strong>
            </div>
            <div>
              <span>Application Status</span>
              <strong>{{ statusBadgeLabel }}</strong>
            </div>
            <div>
              <span>Application Date</span>
              <strong>{{ formattedSubmissionDate }}</strong>
            </div>
          </div>
        </div>
      </article>

      <article class="panel dashboard-pipeline-panel">
        <div class="panel-heading dashboard-panel-heading">
          <div>
            <h2>Enrollment Pipeline</h2>
            <span class="inline-status pipeline-inline-status">Checklist</span>
          </div>
        </div>

        <ul class="checklist pipeline-list">
          <li v-for="item in pipelineItems" :key="item.label" :class="['pipeline-row', item.status.toLowerCase()]">
            <span :class="['pipeline-dot', item.status.toLowerCase()]" aria-hidden="true"></span>
            <div class="pipeline-copy">
              <span>{{ item.label }}</span>
              <small>{{ item.status }}</small>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </section>
</template>
