import { computed, reactive } from 'vue'
import { courses } from './mockData'

const APPLICATIONS_KEY = 'eduportal_applications'
const LEGACY_APPLICATIONS_KEY = 'enrollmentRequests'
const ACCOUNTS_KEY = 'eduportal_accounts'
const SESSION_KEY = 'eduportal_session'

const defaultAccounts = [
  {
    role: 'Student',
    email: 'student@eduportal.com',
    password: 'student123',
    fullName: 'Demo Student',
    activeApplicationId: null,
  },
  {
    role: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    fullName: 'Administrator',
    activeApplicationId: null,
  },
]

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
  email: null,
  activeApplicationId: null,
})

const normalizeEmail = (email) => email.trim().toLowerCase()

const normalizeAccount = (account) => {
  if (!account?.email || !account?.password) return null

  return {
    role: account.role || 'Student',
    email: normalizeEmail(account.email),
    password: account.password,
    fullName: account.fullName || '',
    activeApplicationId: account.activeApplicationId || null,
  }
}

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
  accounts: parseStoredValue(ACCOUNTS_KEY, defaultAccounts)
    .map(normalizeAccount)
    .filter(Boolean),
  session: {
    ...buildSessionState(),
    ...parseStoredValue(SESSION_KEY, {}),
  },
})

const persistApplications = () => {
  saveStoredValue(APPLICATIONS_KEY, enrollmentState.applications)
  saveStoredValue(LEGACY_APPLICATIONS_KEY, enrollmentState.applications)
}

const persistAccounts = () => {
  saveStoredValue(ACCOUNTS_KEY, enrollmentState.accounts)
}

const persistSession = () => {
  saveStoredValue(SESSION_KEY, enrollmentState.session)
}

export const setCurrentRole = (role) => {
  enrollmentState.session.role = role
  persistSession()
}

export const startUserSession = (account) => {
  enrollmentState.session.role = account.role
  enrollmentState.session.email = account.email
  enrollmentState.session.activeApplicationId = account.activeApplicationId || null
  persistSession()
}

export const signOutSession = () => {
  enrollmentState.session.role = 'Student'
  enrollmentState.session.email = null
  enrollmentState.session.activeApplicationId = null
  persistSession()
}

export const authenticateUser = (email, password) => {
  const normalizedEmail = normalizeEmail(email)

  return (
    enrollmentState.accounts.find(
      (account) => account.email === normalizedEmail && account.password === password,
    ) || null
  )
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

  if (enrollmentState.session.email) {
    const matchedApplications = enrollmentState.applications.filter(
      (application) =>
        normalizeEmail(application.studentInfo.email || '') === enrollmentState.session.email,
    )

    if (matchedApplications.length) {
      return matchedApplications[matchedApplications.length - 1]
    }

    return null
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
  accountCredentials,
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
  const normalizedEmail = normalizeEmail(accountCredentials.email)
  const nextAccount = normalizeAccount({
    role: 'Student',
    email: normalizedEmail,
    password: accountCredentials.password,
    fullName: studentInfo.fullName,
    activeApplicationId: application.id,
  })

  enrollmentState.accounts = enrollmentState.accounts.some(
    (account) => account.email === normalizedEmail,
  )
    ? enrollmentState.accounts.map((account) =>
        account.email === normalizedEmail ? nextAccount : account,
      )
    : [...enrollmentState.accounts, nextAccount]
  enrollmentState.session.activeApplicationId = application.id
  enrollmentState.session.email = normalizedEmail
  enrollmentState.session.role = 'Student'

  persistApplications()
  persistAccounts()
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
