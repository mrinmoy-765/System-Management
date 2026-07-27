<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            ['name' => 'Ayesha Khan', 'email' => 'ayesha@example.com', 'kpi_score' => 3],
            ['name' => 'Rafiq Hasan', 'email' => 'rafiq@example.com', 'kpi_score' => 5],
            ['name' => 'Nadia Islam', 'email' => 'nadia@example.com', 'kpi_score' => 2],
            ['name' => 'Tanvir Ahmed', 'email' => 'tanvir@example.com', 'kpi_score' => 1],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}