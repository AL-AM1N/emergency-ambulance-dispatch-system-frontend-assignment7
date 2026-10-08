import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { PaymentAPI } from "@/api"
import type { ConfirmPaymentPayload, CreatePaymentPayload } from "@/types"

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      PaymentAPI.createPayment(payload),
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useConfirmPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ConfirmPaymentPayload) =>
      PaymentAPI.confirmPayment(payload),
    onSuccess: (_, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["patient", "trips"] })
      queryClient.invalidateQueries({ queryKey: ["patient", "trip"] })
      queryClient.invalidateQueries({
        queryKey: ["patient", "emergency-request"],
      })
      queryClient.invalidateQueries({ queryKey: ["admin", "trips"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "trip"] })
      toast.success("Payment successful")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
