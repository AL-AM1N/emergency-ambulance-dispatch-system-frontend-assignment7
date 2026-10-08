import { AuthAPI } from "@/api"
import { ADMIN_ROUTES, DRIVER_ROUTES, PATIENT_ROUTES } from "@/routes"
import type { DemoCredential, DemoRole } from "@/types"

export const DEMO_CREDENTIALS: Record<DemoRole, DemoCredential> = {
  ADMIN: {
    role: "ADMIN",
    email: "admin@ambulancedispatch.com",
    password: "Admin@12345",
  },
  DRIVER: {
    role: "DRIVER",
    email: "driver@ambulancedispatch.com",
    password: "Driver@12345",
  },
  PATIENT: {
    role: "PATIENT",
    email: "patient@ambulancedispatch.com",
    password: "Patient@12345",
  },
}

export const DEMO_HOME: Record<DemoRole, string> = {
  ADMIN: ADMIN_ROUTES.dashboard,
  DRIVER: DRIVER_ROUTES.dashboard,
  PATIENT: PATIENT_ROUTES.dashboard,
}

interface DemoLoginResult {
  ok: boolean
  home?: string
  message?: string
}

function toErrorMessage(error: unknown): string {
  const err = error as { message?: string }
  return err?.message ?? "Something went wrong"
}

export async function attemptDemoLogin(
  role: DemoRole,
): Promise<DemoLoginResult> {
  const credentials = DEMO_CREDENTIALS[role]

  try {
    await AuthAPI.login(credentials)
    return { ok: true, home: DEMO_HOME[role] }
  } catch (error) {
    const message = toErrorMessage(error)

    if (role !== "ADMIN" && message.toLowerCase().includes("not found")) {
      try {
        if (role === "DRIVER") {
          await AuthAPI.registerDriver({
            name: "Demo Driver",
            email: credentials.email,
            password: credentials.password,
            contactNumber: "+15550123456",
            licenseNumber: "DL-DEMO-0001",
            vehicleNumber: "AMB-DEMO-01",
            ambulanceType: "BLS",
          })
        } else {
          await AuthAPI.registerPatient({
            name: "Demo Patient",
            email: credentials.email,
            password: credentials.password,
            patient: {
              contactNumber: "+15550987654",
              address: "123 Main Street",
            },
          })
        }
        await AuthAPI.login(credentials)
        return { ok: true, home: DEMO_HOME[role] }
      } catch (registerError) {
        return {
          ok: false,
          message: toErrorMessage(registerError),
        }
      }
    }

    return { ok: false, message }
  }
}
