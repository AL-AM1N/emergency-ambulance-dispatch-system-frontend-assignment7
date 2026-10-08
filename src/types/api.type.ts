export interface Meta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: Meta
}

export interface PaginatedResponse<T> {
  result: T
  meta: Meta
}

export interface ListQuery {
  page?: number | string
  limit?: number | string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  searchTerm?: string
  status?: string
  priority?: string
  type?: string
  startDate?: string
  endDate?: string
  start?: string
  end?: string
}
