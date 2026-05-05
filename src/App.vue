<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import PublicNavbar from './components/PublicNavbar.vue'
import PublicFooter from './components/PublicFooter.vue'
import DashboardSidebar from './components/DashboardSidebar.vue'
import { enrollmentSubmission } from './data/enrollmentStore'
import { accountProfile } from './data/mockData'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const isMobileView = ref(false)

const syncMobileView = () => {
  isMobileView.value = window.innerWidth <= 920
  if (!isMobileView.value) {
    sidebarOpen.value = false
  }
}

const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')
const showPublicFooter = computed(() => route.meta.showFooter !== false)
const pageTitle = computed(() => route.meta.title || 'EduPortal')
const headerStudentName = computed(() => enrollmentSubmission.studentInfo.fullName || accountProfile.name)
const headerStudentId = computed(() =>
  enrollmentSubmission.studentInfo.studentId !== 'To be assigned by the school'
    ? enrollmentSubmission.studentInfo.studentId
    : accountProfile.studentId,
)

const handleSignOut = async () => {
  sidebarOpen.value = false
  await router.push('/login')
}

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)

onMounted(() => {
  syncMobileView()
  window.addEventListener('resize', syncMobileView)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncMobileView)
})
</script>

<template>
  <div class="app-shell">
    <template v-if="isDashboardLayout">
      <div class="dashboard-shell">
        <DashboardSidebar
          :is-open="sidebarOpen"
          :is-mobile-view="isMobileView"
          @close="sidebarOpen = false"
          @sign-out="handleSignOut"
        />

        <div class="dashboard-main">
          <header class="dashboard-header">
            <div>
              <p class="eyebrow">Student Portal</p>
              <h1>{{ pageTitle }}</h1>
            </div>

            <div class="dashboard-header-actions">
              <button
                v-if="isMobileView"
                class="icon-button mobile-only"
                type="button"
                aria-label="Open sidebar navigation"
                @click="sidebarOpen = true"
              >
                <span class="menu-icon" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
              <div class="dashboard-header-profile">
                <p class="dashboard-profile-name">{{ headerStudentName }}</p>
                <p class="dashboard-profile-id">ID {{ headerStudentId }}</p>
              </div>
              <button class="button button-dark" type="button" @click="handleSignOut">
                Sign Out
              </button>
            </div>
          </header>

          <main class="dashboard-content">
            <RouterView v-slot="{ Component }">
              <Transition name="page-fade" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </main>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="app-shell public-shell">
        <PublicNavbar />
        <main class="public-main">
          <RouterView v-slot="{ Component }">
            <Transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </main>
        <PublicFooter v-if="showPublicFooter" />
      </div>
    </template>
  </div>
</template>
