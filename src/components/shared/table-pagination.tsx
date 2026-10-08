import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function buildPages(totalPages: number, page: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages]
  }
  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages]
}

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function TablePagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            aria-disabled={page === 1}
            className={
              page === 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
        {buildPages(totalPages, page).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                onClick={() => onPageChange(item)}
                isActive={page === item}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
