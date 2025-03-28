"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal, RefreshCcw } from "lucide-react"

import { Button } from "../../@/components/ui/button"

import { Checkbox } from "../../@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../@/components/ui/dropdown-menu"

import { Input } from "../../@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../@/components/ui/table"
import { UserType } from "../types/User"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../@/components/ui/alert-dialog"

import { deleteUser, updateDataUser } from "../firebase/firebaseUtils"
import { Label } from "../../@/components/ui/label"


export const columns: ColumnDef<UserType>[] = [

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    
  },
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Navn",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  
  {
    accessorKey: "img",
    header: () => <div className="text-right">img</div>,
    cell: ({ row }) => {
      const img = row.getValue("img") as string
      return <div className=" h-12 w-12  "><img className=" h-full w-full " src={img}/></div>
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          slug
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("slug")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      function formatDate(inputDate:string) {
        // Extract the date part (YYYY-MM-DD) from the input
        const datePart = inputDate.split('T')[0];
        
        // Split the date into components
        const [year, month, day] = datePart.split('-');
        
        // Return the formatted date as DDMMYY
        return `${day}${month}${year.slice(2)}`;
      }
      const [name, setname] = React.useState<string| undefined>(user?.name)
      const [birthday, setbirthday] = React.useState<string | undefined>(user?.birthday)
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className=" m-0 w-fit h-fit p-0">
              <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Kopier bruker ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" onClick={()=>{
                  }}>Rediger bruker</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>endre data</AlertDialogTitle>
                    <AlertDialogDescription>endre data</AlertDialogDescription>
                  </AlertDialogHeader>

                  <div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="fname">Fullt navn</Label>
                              <Input className=' text-[16px] font-light' name='fname' type="text" onChange={(e)=>setname(e.target.value)} placeholder='Ola Johan Norman' value={name} />
                              
      
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="time">Fødsels-dato</Label>
                              <Input className=' text-[16px] font-light' type="datetime-local" onChange={(e)=>{
                                  if (e.target.value) {
                                      setbirthday(formatDate(e.target.value))
                                  } else {
                                      setbirthday('')
                                  }
                              }} placeholder='040103'/>
                          </div>
                        </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogAction onClick={()=>{
                      updateDataUser(user.id,name,birthday)
                    }}>Oppdater</AlertDialogAction>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>

                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className=" w-full" onClick={()=>{
                  }}>Slett bruker</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>slett data</AlertDialogTitle>
                    <AlertDialogDescription>plz</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={()=>{deleteUser(user.id)}}>Slett</AlertDialogAction>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>

                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTableDemo({data,setupdate}:{data:UserType[],setupdate:Function}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  if (!data) return
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-1.5">
        <Input
          placeholder="Filtrer med slug..."
          value={(table.getColumn("slug")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("slug")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant={'outline'} onClick={()=>setupdate((prev:boolean)=>!prev)} > <RefreshCcw size={20}/></Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
