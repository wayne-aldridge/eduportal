<script setup>
import { computed } from 'vue'
import DashboardCard from '../components/DashboardCard.vue'
import { enrolledCourses } from '../data/mockData'
import { enrollmentSubmission } from '../data/enrollmentStore'

const studentInfo = computed(() => enrollmentSubmission.studentInfo)
const studentName = computed(() => studentInfo.value.fullName || 'Alex Henderson')
const displayStudentId = computed(() =>
  studentInfo.value.studentId !== 'To be assigned by the school'
    ? studentInfo.value.studentId
    : '2023-45091',
)

const dashboardSummary = computed(() => [
  {
    label: 'Courses',
    value: `${enrolledCourses.length.toString().padStart(2, '0')}`,
    icon: '📘',
  },
  {
    label: 'Pending',
    value: `${enrollmentSubmission.pendingRequirements.length.toString().padStart(2, '0')}`,
    icon: '📋',
  },
  {
    label: 'Status',
    value: enrollmentSubmission.status,
    icon: '◔',
  },
  {
    label: 'Term',
    value: '1st Sem 2026',
    icon: '🗓',
  },
])

const recentActivity = computed(() => enrollmentSubmission.recentActivity)
const conciseAnnouncements = computed(() => [
  'Submit missing documents before the deadline.',
  'Schedules may change before final approval.',
])

const dashboardProgress = computed(() => [
  { label: 'Profile complete', status: 'Completed' },
  { label: 'Course selected', status: 'Completed' },
  { label: 'Application sent', status: 'Completed' },
  {
    label: `Requirements ${enrollmentSubmission.completedRequirements.length} complete`,
    status: enrollmentSubmission.completedRequirements.length ? 'Completed' : 'Pending',
  },
  { label: 'Admissions review', status: 'Pending' },
])
</script>

<template>
  <section class="dashboard-stack">
    <section class="welcome-panel dashboard-hero">
      <div class="dashboard-hero-copy">
        <p class="eyebrow">Student Overview</p>
        <h2>Welcome back, {{ studentName }}.</h2>
        <div class="student-overview hero-overview">
          <div>
            <span>ID</span>
            <strong>{{ displayStudentId }}</strong>
          </div>
          <div>
            <span>Program</span>
            <strong>{{ enrollmentSubmission.selectedCourse }}</strong>
          </div>
          <div>
            <span>Year</span>
            <strong>{{ studentInfo.yearLevel }}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{{ enrollmentSubmission.status }}</strong>
          </div>
        </div>
      </div>

      <div class="dashboard-hero-mark" aria-hidden="true">
        <span>🎓</span>
      </div>
    </section>

    <section class="dashboard-summary-grid">
      <DashboardCard v-for="item in dashboardSummary" :key="item.label" :item="item" />
    </section>

    <section class="dashboard-two-column">
      <article class="panel dashboard-table-panel">
        <div class="panel-heading dashboard-panel-heading">
          <h2>Courses</h2>
          <span class="inline-status">Current Term</span>
        </div>

        <div class="course-table">
          <div class="course-table-head">
            <span>Identity</span>
            <span>Mentor</span>
            <span>Schedule</span>
            <span>Status</span>
          </div>

          <article v-for="course in enrolledCourses" :key="course.code" class="course-row">
            <div class="course-identity">
              <span class="course-mobile-label">Course</span>
              <strong>{{ course.code }}</strong>
              <p>{{ course.title }}</p>
            </div>
            <div class="course-meta">
              <span class="course-mobile-label">Mentor</span>
              {{ course.instructor }}
            </div>
            <div class="course-meta">
              <span class="course-mobile-label">Schedule</span>
              {{ course.schedule }}
            </div>
            <div class="course-status">
              <span class="course-mobile-label">Status</span>
              <span class="status-pill course-pill">{{ course.status }}</span>
            </div>
          </article>
        </div>
      </article>

      <div class="dashboard-side-panels">
        <article class="panel dashboard-pipeline-panel">
          <div class="panel-heading dashboard-panel-heading">
            <h2>Progress</h2>
          </div>

          <ul class="checklist pipeline-list">
            <li v-for="item in dashboardProgress" :key="item.label">
              <span :class="['pipeline-dot', item.status.toLowerCase()]">
                {{ item.status === 'Completed' ? '✓' : '•' }}
              </span>
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </article>

        <article class="panel dashboard-mini-panel">
          <div class="panel-heading dashboard-panel-heading">
            <h2>Recent</h2>
          </div>

          <div class="mini-activity-list">
            <article
              v-for="item in recentActivity"
              :key="`${item.action}-${item.when}`"
              class="mini-activity-item"
            >
              <h3>{{ item.action }}</h3>
              <p>{{ item.when }}</p>
            </article>
          </div>
        </article>
      </div>
    </section>

    <section class="dashboard-two-column dashboard-bottom-grid">
      <article class="panel dashboard-mini-panel">
        <div class="panel-heading dashboard-panel-heading">
          <h2>Requirements</h2>
        </div>

        <div class="requirements-snapshot">
          <div>
            <span>Completed</span>
            <ul class="plain-list compact-list">
              <li v-for="item in enrollmentSubmission.completedRequirements" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div>
            <span>Pending</span>
            <ul class="plain-list compact-list">
              <li v-for="item in enrollmentSubmission.pendingRequirements" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </article>

      <article class="panel dashboard-mini-panel">
        <div class="panel-heading dashboard-panel-heading">
          <h2>Announcements</h2>
        </div>

        <ul class="plain-list compact-list announcement-list">
          <li v-for="note in conciseAnnouncements" :key="note">
            {{ note }}
          </li>
        </ul>
      </article>
    </section>
  </section>
</template>
