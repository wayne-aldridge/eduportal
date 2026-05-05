export const publicNavLinks = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'About', to: '/about' },
  { label: 'History', to: '/history' },
  { label: 'Contact', to: '/contact' },
]

export const dashboardNavLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: '▣' },
  { label: 'Account', to: '/account', icon: '◎' },
]

export const featureCards = [
  {
    title: 'Easy Enrollment',
    description: 'Students can submit enrollment details through a simple online form.',
  },
  {
    title: 'Course List',
    description: 'Students can browse available courses with descriptions and categories.',
  },
  {
    title: 'Student Dashboard',
    description: 'Students can view enrolled courses, status, and academic updates.',
  },
  {
    title: 'Academic Information',
    description: 'Student and course details are organized in one accessible platform.',
  },
]

export const courses = [
  {
    title: 'BS Computer Science',
    category: 'Technology',
    duration: '4 years',
    level: 'Level 100',
    description: 'Focused on software development, algorithms, and modern computing systems.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    alt: 'Students collaborating around a table with laptops and notes.',
  },
  {
    title: 'BS Information Systems',
    category: 'Technology',
    duration: '4 years',
    level: 'Level 100',
    description: 'Blends business processes with information technology and digital solutions.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    alt: 'University students learning with computer screens in a lab.',
  },
  {
    title: 'BA Communication',
    category: 'Arts & Media',
    duration: '4 years',
    level: 'Level 200',
    description: 'Develops writing, media production, and strategic communication skills.',
    image:
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
    alt: 'Students discussing ideas in a creative classroom setting.',
  },
  {
    title: 'BS Business Administration',
    category: 'Business',
    duration: '4 years',
    level: 'Level 100',
    description: 'Introduces management, finance, entrepreneurship, and business leadership.',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    alt: 'Business students reviewing charts and planning together.',
  },
  {
    title: 'BS Civil Engineering',
    category: 'Engineering',
    duration: '4 years',
    level: 'Level 200',
    description: 'Covers structural design, construction methods, and infrastructure planning.',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    alt: 'Engineering students reviewing architectural plans and project materials.',
  },
  {
    title: 'BS Biology',
    category: 'Science',
    duration: '4 years',
    level: 'Level 100',
    description: 'Explores life sciences, laboratory work, and environmental research.',
    image:
      'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=900&q=80',
    alt: 'Science students conducting observations with lab materials.',
  },
]

export const aboutHighlights = [
  {
    title: 'Efficiency First',
    description: 'Helps reduce manual enrollment steps and improves student workflow.',
    icon: '↗',
  },
  {
    title: 'Data Organization',
    description: 'Keeps student, course, and enrollment information easier to view.',
    icon: '▣',
  },
  {
    title: 'Student Centric',
    description: 'Designed to help students access important academic details quickly.',
    icon: '◎',
  },
  {
    title: 'Guided Learning',
    description: 'Provides a simple path from course browsing to enrollment tracking.',
    icon: '◉',
  },
]

export const aboutStats = [
  { value: '15k+', label: 'Active Students' },
  { value: '250+', label: 'Courses Offered' },
  { value: '12', label: 'Campus Partners' },
  { value: '4.9/5', label: 'User Rating' },
]

export const historyTimeline = [
  {
    year: '2026',
    title: 'EduPortal Concept Created',
    description:
      'The group selected Education as the project context and planned a student enrollment system.',
    badge: 'Foundation',
  },
  {
    year: '2026',
    title: 'Course Catalog Designed',
    description: 'Available courses and curriculum cards were prepared for the digital catalog.',
    badge: 'Milestone',
  },
  {
    year: '2026',
    title: 'Enrollment Form Added',
    description: 'A digital enrollment form was introduced for guided student application submission.',
    badge: 'Launch Phase',
  },
  {
    year: '2026',
    title: 'Student Dashboard Completed',
    description:
      'A student dashboard was added to show enrollment status, enrolled courses, and activities.',
    badge: 'Latest Release',
  },
]

export const dashboardSummary = [
  { label: 'Enrolled Courses', value: '5' },
  { label: 'Pending Requirements', value: '2' },
  { label: 'Enrollment Status', value: 'Enrolled' },
  { label: 'Current Semester', value: '1st Semester 2026' },
]

export const enrolledCourses = [
  {
    code: 'IT 221',
    title: 'Web Systems and Technologies',
    instructor: 'Ms. Para-ase',
    schedule: 'Mon/Wed 9:00 AM',
    status: 'Enrolled',
  },
  {
    code: 'IT 222',
    title: 'Database Management',
    instructor: 'Mr. Santos',
    schedule: 'Tue/Thu 10:30 AM',
    status: 'Enrolled',
  },
  {
    code: 'GE 101',
    title: 'Understanding the Self',
    instructor: 'Ms. Cruz',
    schedule: 'Friday 1:00 PM',
    status: 'Enrolled',
  },
  {
    code: 'IT 223',
    title: 'Systems Analysis and Design',
    instructor: 'Mr. Reyes',
    schedule: 'Tue/Thu 1:00 PM',
    status: 'Enrolled',
  },
  {
    code: 'PE 104',
    title: 'Physical Education 4',
    instructor: 'Ms. Dela Cruz',
    schedule: 'Saturday 8:00 AM',
    status: 'Enrolled',
  },
]

export const progressChecklist = [
  { label: 'Personal Information Submitted', status: 'Completed' },
  { label: 'Course Selection Completed', status: 'Completed' },
  { label: 'Enrollment Form Submitted', status: 'Completed' },
  { label: 'Requirements Verification', status: 'Pending' },
  { label: 'Final Approval', status: 'Pending' },
]

export const announcements = [
  'Enrollment confirmation will be released after requirements verification.',
  'Please submit missing documents before the deadline.',
  'Class schedules may still change before final approval.',
]

export const recentActivity = [
  { action: 'Enrollment form submitted', when: 'Today' },
  { action: 'Selected BSIT courses', when: 'Today' },
  { action: 'Profile information updated', when: 'Yesterday' },
  { action: 'Viewed course list', when: 'Yesterday' },
]

export const accountProfile = {
  name: 'Alex Henderson',
  email: 'alex.j@student.edu',
  studentId: '2023-45091',
  role: 'Student',
  program: 'BS Information Technology',
  yearLevel: '2nd Year',
}
