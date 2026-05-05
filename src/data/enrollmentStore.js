import { reactive } from 'vue'

export const enrollmentCourseOptions = [
  'BS Information Technology',
  'BS Computer Science',
  'BS Business Administration',
  'BS Hospitality Management',
  'Bachelor of Elementary Education',
]

export const enrollmentRequirementItems = [
  'Form 138 / Report Card',
  'Certificate of Good Moral Character',
  'PSA Birth Certificate',
  '2x2 ID Picture',
  'Enrollment Application Form',
]

const createDefaultState = () => ({
  submitted: false,
  selectedCourse: 'BS Information Technology',
  studentInfo: {
    fullName: 'Alex Henderson',
    studentId: 'To be assigned by the school',
    email: 'alex.j@student.edu',
    phone: '+1 (555) 210-1001',
    address: '123 Academic Way, Education City',
    yearLevel: '1st Year',
    birthdate: '2006-03-18',
    gender: 'Male',
    studentType: 'New Student',
  },
  completedRequirements: [
    'Form 138 / Report Card',
    'Certificate of Good Moral Character',
    'Enrollment Application Form',
  ],
  pendingRequirements: ['PSA Birth Certificate', '2x2 ID Picture'],
  status: 'Pending Review',
  recentActivity: [
    { action: 'Account created', when: 'Today' },
    { action: 'Enrollment application submitted', when: 'Today' },
    { action: 'Requirements checklist completed', when: 'Today' },
  ],
})

export const enrollmentSubmission = reactive(createDefaultState())

export const saveEnrollmentSubmission = ({
  selectedCourse,
  studentInfo,
  completedRequirements,
}) => {
  const pendingRequirements = enrollmentRequirementItems.filter(
    (item) => !completedRequirements.includes(item),
  )

  Object.assign(enrollmentSubmission, {
    submitted: true,
    selectedCourse,
    studentInfo: {
      ...studentInfo,
      studentId: 'To be assigned by the school',
    },
    completedRequirements: [...completedRequirements],
    pendingRequirements,
    status: 'Pending Review',
    recentActivity: [
      { action: 'Account created', when: 'Today' },
      { action: 'Enrollment application submitted', when: 'Today' },
      { action: 'Requirements checklist completed', when: 'Today' },
    ],
  })
}
