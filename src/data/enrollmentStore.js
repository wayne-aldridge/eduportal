import { computed, reactive } from 'vue'
import { courses } from './mockData'

const APPLICATIONS_KEY = 'eduportal_applications'
const LEGACY_APPLICATIONS_KEY = 'enrollmentRequests'
const SESSION_KEY = 'eduportal_session'

export const enrollmentCourseOptions = courses.map((course) => ({
  title: course.title,
  category: course.category,
  duration: course.duration,
  image: course.image,
  alt: course.alt,
  description: course.description,
}))

export const enrollmentRequirementItems = [
  'Form 138 / Report Card',
  'Certificate of Good Moral Character',
  'PSA Birth Certificate',
  '2x2 ID Picture',
  'Enrollment Application Form',
]

const parseStoredValue = (key, fallback) => {
  if (typeof window === 'undefined') return fallback

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

const saveStoredValue = (key, value) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

const buildSessionState = () => ({
  role: 'Student',
  activeApplicationId: null,
})

const normalizeApplication = (application) => {
  if (!application) return application

  const completedRequirements = Array.isArray(application.completedRequirements)
    ? application.completedRequirements
    : Array.isArray(application.requirements)
      ? application.requirements
      : []

  const studentInfo = application.studentInfo || {}

  return {
    ...application,
    studentInfo: {
      ...studentInfo,
      phone: studentInfo.phone || studentInfo.phoneNumber || '',
      phoneNumber: studentInfo.phoneNumber || studentInfo.phone || '',
      studentId: studentInfo.studentId || 'To be assigned by the school',
    },
    completedRequirements,
    pendingRequirements: Array.isArray(application.pendingRequirements)
      ? application.pendingRequirements
      : enrollmentRequirementItems.filter((item) => !completedRequirements.includes(item)),
    status: application.status || 'Pending',
  }
}

export const enrollmentState = reactive({
  applications: parseStoredValue(LEGACY_APPLICATIONS_KEY, parseStoredValue(APPLICATIONS_KEY, [])).map(
    normalizeApplication,
  ),
  session: {
    ...buildSessionState(),
    ...parseStoredValue(SESSION_KEY, {}),
  },
})

const persistApplications = () => {
  saveStoredValue(APPLICATIONS_KEY, enrollmentState.applications)
  saveStoredValue(LEGACY_APPLICATIONS_KEY, enrollmentState.applications)
}

const persistSession = () => {
  saveStoredValue(SESSION_KEY, enrollmentState.session)
}

export const setCurrentRole = (role) => {
  enrollmentState.session.role = role
  persistSession()
}

export const signOutSession = () => {
  enrollmentState.session.role = 'Student'
  persistSession()
}

export const getLatestEnrollmentRequest = () => {
  if (!enrollmentState.applications.length) return null
  return enrollmentState.applications[enrollmentState.applications.length - 1] || null
}

export const currentStudentApplication = computed(() => {
  if (!enrollmentState.applications.length) return null

  if (enrollmentState.session.activeApplicationId) {
    return (
      enrollmentState.applications.find(
        (application) => application.id === enrollmentState.session.activeApplicationId,
      ) || null
    )
  }

  return getLatestEnrollmentRequest()
})

export const applicationCounts = computed(() => {
  const pending = enrollmentState.applications.filter(
    (application) => application.status === 'Pending',
  ).length
  const approved = enrollmentState.applications.filter(
    (application) => application.status === 'Approved',
  ).length
  const rejected = enrollmentState.applications.filter(
    (application) => application.status === 'Rejected',
  ).length

  return {
    total: enrollmentState.applications.length,
    pending,
    approved,
    rejected,
  }
})

export const saveEnrollmentSubmission = ({
  selectedCourse,
  studentInfo,
  completedRequirements,
}) => {
  const pendingRequirements = enrollmentRequirementItems.filter(
    (item) => !completedRequirements.includes(item),
  )

  const application = {
    id: `app-${Date.now()}`,
    selectedCourse,
    studentInfo: {
      ...studentInfo,
      studentId: 'To be assigned by the school',
    },
    completedRequirements: [...completedRequirements],
    pendingRequirements,
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  }

  enrollmentState.applications = [...enrollmentState.applications, normalizeApplication(application)]
  enrollmentState.session.activeApplicationId = application.id
  enrollmentState.session.role = 'Student'

  persistApplications()
  persistSession()

  return application
}

export const updateApplicationStatus = (applicationId, status) => {
  enrollmentState.applications = enrollmentState.applications.map((application) =>
    application.id === applicationId
      ? normalizeApplication({
          ...application,
          status,
        })
      : application,
  )

  persistApplications()
}
