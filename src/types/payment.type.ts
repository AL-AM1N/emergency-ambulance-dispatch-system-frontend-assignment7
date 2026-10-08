import type { Meta } from "./api.type"
import type { EmergencyRequest, TripStatus } from "./emergency-request.type"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED"

export type PaymentMethod = "STRIPE" | "SSLCOMMERZ"

export interface Payment {
  id: string
  tripId: string
  userId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  stripePaymentIntentId: string | null
  transactionId: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentPayload {
  tripId: string
  method?: PaymentMethod
}

export interface CreatePaymentResponse {
  clientSecret?: string
  paymentId: string
  amount: number
  message?: string
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string
  tripId: string
}

export interface ConfirmPaymentResponse {
  success: boolean
}

export interface RevenueBucket {
  date: string
  amount: number
}

export interface RevenueTransaction {
  amount: number
  paidAt: string | null
  transactionId: string | null
  tripId: string
}

export interface RevenueReport {
  period: {
    startDate: string | null
    endDate: string | null
  }
  totalRevenue: number
  totalTransactions: number
  dailyRevenue: RevenueBucket[]
  transactions: RevenueTransaction[]
}

export interface TripReportSummary {
  total: number
  byStatus: Array<{
    status: TripStatus
    _count: { _all: number }
  }>
}

export interface TripReportResponse {
  result: EmergencyRequest[]
  meta: Meta
  summary: TripReportSummary
}
