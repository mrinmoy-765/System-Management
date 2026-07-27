<?php

namespace App\Services;

use App\Models\Employee;

class EmployeeService
{
    public function increaseKpi(Employee $employee, int $points = 1): Employee
    {
        $employee->increment('kpi_score', $points);

        return $employee->refresh();
    }

    public function kpiSummary(Employee $employee): array
    {
        return [
            'employee' => $employee,
            'kpi_score' => $employee->kpi_score,
            'active_assignments' => $employee->customerAssignments()
                ->where('is_active', true)
                ->count(),
            'sales_count' => $employee->sales()->count(),
        ];
    }
}