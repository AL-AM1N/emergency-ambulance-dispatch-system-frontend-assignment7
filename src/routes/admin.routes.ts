export const ADMIN_ROUTES = {
  dashboard: "/admin/dashboard",
  requests: "/admin/requests",
  trips: "/admin/trips",
  ambulances: "/admin/ambulances",
  drivers: "/admin/drivers",
  hospitals: "/admin/hospitals",
  payments: "/admin/payments",
  reports: "/admin/reports",
  profile: "/admin/profile",
} as const

export const adminMenuItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: ADMIN_ROUTES.dashboard },
      { title: "Requests", url: ADMIN_ROUTES.requests },
      { title: "Trips", url: ADMIN_ROUTES.trips },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Ambulances", url: ADMIN_ROUTES.ambulances },
      { title: "Drivers", url: ADMIN_ROUTES.drivers },
      { title: "Hospitals", url: ADMIN_ROUTES.hospitals },
    ],
  },
  {
    title: "Finance",
    items: [{ title: "Payments", url: ADMIN_ROUTES.payments }],
  },
  {
    title: "Reports",
    items: [{ title: "Reports", url: ADMIN_ROUTES.reports }],
  },
]
