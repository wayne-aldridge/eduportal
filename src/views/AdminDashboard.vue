<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DashboardCard from '../components/DashboardCard.vue'
import { applicationCounts, enrollmentState, updateApplicationStatus } from '../data/enrollmentStore'

const route = useRoute()
const notice = ref('')

const summaryCards = computed(() => [
  {
    label: 'Total Applications',
    value: `${applicationCounts.value.total}`.padStart(2, '0'),
    icon: 'T',
  },
  {
    label: 'Pending Requests',
    value: `${applicationCounts.value.pending}`.padStart(2, '0'),
    icon: 'P',
  },
  {
    label: 'Approved Applications',
    value: `${applicationCounts.value.approved}`.padStart(2, '0'),
    icon: 'A',
  },
  {
    label: 'Rejected Applications',
    value: `${applicationCounts.value.rejected}`.padStart(2, '0'),
    icon: 'R',
  },
])

const applications = computed(() => [...enrollmentState.applications].reverse())

const updateStatus = (applicationId, status) => {
  updateApplicationStatus(applicationId, status)
  notice.value =
    status === 'Approved'
      ? 'Enrollment request approved successfully.'
      : 'Enrollment request rejected.'
}

const requirementsLabel = (application) =>
  `${application.completedRequirements.length}/${application.completedRequirements.length + application.pendingRequirements.length} Complete`

const isPending = (application) => application.status === 'Pending'

const scrollToRequests = async () => {
  if (route.path !== '/admin/requests') return
  await nextTick()
  document.getElementById('requests')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(() => route.path, scrollToRequests)
onMounted(scrollToRequests)
</script>

<template>
  <section class="dashboard-stack">
    <section class="welcome-panel dashboard-hero admin-hero">
      <div class="dashboard-hero-copy">
        <p class="eyebrow">Enrollment Approval</p>
        <h2>Review and manage enrollment requests.</h2>
        <p class="admin-hero-copy">
          Approve or reject student enrollment applications and monitor enrollment status.
        </p>
      </div>

    </section>

    <section class="dashboard-summary-grid">
      <DashboardCard v-for="item in summaryCards" :key="item.label" :item="item" />
    </section>

    <section id="requests" class="panel dashboard-table-panel">
      <div class="panel-heading dashboard-panel-heading">
        <div>
          <h2>Enrollment Requests</h2>
          <span class="inline-status">Admin Review Queue</span>
        </div>
      </div>

      <p v-if="notice" class="admin-notice">{{ notice }}</p>

      <div v-if="applications.length" class="responsive-table admin-table-wrap">
        <table class="admin-table admin-requests-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Program</th>
              <th>Type</th>
              <th>Requirements</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in applications" :key="application.id">
              <td data-label="Student" class="admin-student-cell">
                <strong>{{ application.studentInfo.fullName }}</strong>
              </td>
              <td data-label="Email" class="admin-email-cell">
                <span>{{ application.studentInfo.email }}</span>
              </td>
              <td data-label="Program" class="admin-program-cell">
                <span>{{ application.selectedCourse }}</span>
              </td>
              <td data-label="Type">
                <span>{{ application.studentInfo.studentType }}</span>
              </td>
              <td data-label="Requirements">
                <span class="admin-requirements-pill">{{ requirementsLabel(application) }}</span>
              </td>
              <td data-label="Status" class="admin-status-cell">
                <span
                  :class="[
                    'status-pill',
                    'admin-status-pill',
                    {
                      'pending-review': application.status === 'Pending',
                      'status-approved': application.status === 'Approved',
                      'status-rejected': application.status === 'Rejected',
                    },
                  ]"
                >
                  {{ application.status }}
                </span>
              </td>
              <td data-label="Actions" class="admin-actions-cell">
                <div v-if="isPending(application)" class="admin-actions">
                  <button
                    class="button button-gold compact admin-action-button"
                    type="button"
                    @click="updateStatus(application.id, 'Approved')"
                  >
                    Approve
                  </button>
                  <button
                    class="button button-outline compact admin-action-button"
                    type="button"
                    @click="updateStatus(application.id, 'Rejected')"
                  >
                    Reject
                  </button>
                </div>
                <span v-else class="admin-reviewed-label">Reviewed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-application-state">
        <h3>No enrollment requests yet.</h3>
        <p>Submitted student applications will appear here for admin review.</p>
      </div>
    </section>
  </section>
</template>
