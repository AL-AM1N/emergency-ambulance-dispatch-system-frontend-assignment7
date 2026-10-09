export const PATIENT_ROUTES = {
  dashboard: "/patient/dashboard",
  requests: "/patient/requests",
  newRequest: "/patient/requests/new",
  payment: "/patient/payment",
  paymentReturn: "/patient/payment/return",
  trips: "/patient/trips",
  profile: "/patient/profile",
} as const

export const patientMenuItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: PATIENT_ROUTES.dashboard },
      { title: "My Requests", url: PATIENT_ROUTES.requests },
      { title: "New Request", url: PATIENT_ROUTES.newRequest },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "My Trips", url: PATIENT_ROUTES.trips },
      { title: "Profile", url: PATIENT_ROUTES.profile },
    ],
  },
]
