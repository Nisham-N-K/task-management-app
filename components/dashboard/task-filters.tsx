"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface TaskFiltersProps {
  filters: {
    status: string
    priority: string
    search: string
  }
  onFiltersChange: (filters: any) => void
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10 w-full sm:w-64"
        />
      </div>

      <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
