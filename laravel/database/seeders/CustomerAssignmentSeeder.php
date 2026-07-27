<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerAssignment;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class CustomerAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $employees = Employee::all();

        if ($customers->isEmpty() || $employees->isEmpty()) {
            return;
        }

        CustomerAssignment::create([
            'customer_id' => $customers[0]->id,
            'employee_id' => $employees[0]->id,
            'assigned_at' => now()->subDays(10),
            'is_active' => true,
        ]);

        CustomerAssignment::create([
            'customer_id' => $customers[1]->id,
            'employee_id' => $employees[1]->id,
            'assigned_at' => now()->subDays(20),
            'is_active' => true,
        ]);

        CustomerAssignment::create([
            'customer_id' => $customers[2]->id,
            'employee_id' => $employees[2]->id,
            'assigned_at' => now()->subDays(40),
            'is_active' => false,
        ]);
    }
}
