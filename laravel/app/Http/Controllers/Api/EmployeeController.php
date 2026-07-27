<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;

class EmployeeController extends Controller
{
    public function index(): JsonResponse
    {
        $employees = Employee::latest()->get();

        return response()->json([
            'message' => 'Employees retrieved successfully',
            'data' => EmployeeResource::collection($employees),
        ]);
    }

    public function show(Employee $employee): JsonResponse
    {
        return response()->json([
            'message' => 'Employee retrieved successfully',
            'data' => new EmployeeResource($employee),
        ]);
    }

    public function kpi(Employee $employee, EmployeeService $employeeService): JsonResponse
    {
        $summary = $employeeService->kpiSummary($employee);

        return response()->json([
            'message' => 'Employee KPI retrieved successfully',
            'data' => $summary,
        ]);
    }
}