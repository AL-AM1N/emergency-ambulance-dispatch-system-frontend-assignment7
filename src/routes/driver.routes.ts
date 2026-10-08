export const DRIVER_ROUTES = {
  dashboard: "/driver/dashboard",
  trips: "/driver/trips",
  profile: "/driver/profile",
} as const

export const driverMenuItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: DRIVER_ROUTES.dashboard },
      { title: "My Trips", url: DRIVER_ROUTES.trips },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Profile", url: DRIVER_ROUTES.profile }],
  },
]
