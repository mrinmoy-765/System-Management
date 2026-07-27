<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            ['name' => 'Rahim Uddin', 'email' => 'rahim@example.com', 'phone' => '01710000001'],
            ['name' => 'Karim Ahmed', 'email' => 'karim@example.com', 'phone' => '01710000002'],
            ['name' => 'Nusrat Jahan', 'email' => 'nusrat@example.com', 'phone' => '01710000003'],
            ['name' => 'Sajib Hossain', 'email' => 'sajib@example.com', 'phone' => '01710000004'],
            ['name' => 'Mim Akter', 'email' => 'mim@example.com', 'phone' => '01710000005'],
            ['name' => 'Fahim Hasan', 'email' => 'fahim@example.com', 'phone' => '01710000006'],
            ['name' => 'Tania Sultana', 'email' => 'tania@example.com', 'phone' => '01710000007'],
            ['name' => 'Arif Hossain', 'email' => 'arif@example.com', 'phone' => '01710000008'],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}