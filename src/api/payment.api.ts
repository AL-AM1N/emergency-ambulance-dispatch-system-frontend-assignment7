import { apiClient } from "@/lib/apiClient"
import type {
  ApiResponse,
  ConfirmPaymentPayload,
  ConfirmPaymentResponse,
  CreatePaymentPayload,
  CreatePaymentResponse,
} from "@/types"

const createPayment = async (payload: CreatePaymentPayload) => {
  const res = await apiClient<ApiResponse<CreatePaymentResponse>>(
    "/payment/create",
    { method: "POST", body: payload },
  )
  return res.data
}

const confirmPayment = async (payload: ConfirmPaymentPayload) => {
  const res = await apiClient<ApiResponse<ConfirmPaymentResponse>>(
    "/payment/confirm",
    { method: "POST", body: payload },
  )
  return res.data
}

export const PaymentAPI = {
  createPayment,
  confirmPayment,
}
