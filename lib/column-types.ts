import { RedeemCode } from "./types"

export interface ColumnDef {
  accessorKey?: string
  id?: string
  header?: string | (() => React.ReactNode)
  cell?: ({ row }: { row: { original: RedeemCode } }) => React.ReactNode
}
