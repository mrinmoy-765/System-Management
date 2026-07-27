<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Wireless Mouse', 'sku' => 'PRD-1001', 'price' => 12.50, 'stock_quantity' => 120],
            ['name' => 'Mechanical Keyboard', 'sku' => 'PRD-1002', 'price' => 45.00, 'stock_quantity' => 60],
            ['name' => 'USB-C Cable', 'sku' => 'PRD-1003', 'price' => 8.99, 'stock_quantity' => 200],
            ['name' => 'Laptop Stand', 'sku' => 'PRD-1004', 'price' => 18.75, 'stock_quantity' => 80],
            ['name' => 'Bluetooth Speaker', 'sku' => 'PRD-1005', 'price' => 29.99, 'stock_quantity' => 40],
            ['name' => 'Gaming Headset', 'sku' => 'PRD-1006', 'price' => 39.50, 'stock_quantity' => 35],
            ['name' => 'Monitor 24 Inch', 'sku' => 'PRD-1007', 'price' => 110.00, 'stock_quantity' => 25],
            ['name' => 'Office Chair', 'sku' => 'PRD-1008', 'price' => 89.99, 'stock_quantity' => 20],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}