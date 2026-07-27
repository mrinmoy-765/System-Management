<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $employees = Employee::all();
        $products = Product::all()->keyBy('id');

        if ($customers->isEmpty() || $employees->isEmpty() || $products->isEmpty()) {
            return;
        }

        $salesData = [
            [
                'customer_id' => $customers[0]->id,
                'employee_id' => $employees[0]->id,
                'sold_at' => now()->subDays(120),
                'items' => [
                    ['product_id' => $products->first()->id, 'quantity' => 2],
                    ['product_id' => $products->skip(1)->first()->id, 'quantity' => 1],
                ],
            ],
            [
                'customer_id' => $customers[1]->id,
                'employee_id' => $employees[1]->id,
                'sold_at' => now()->subDays(95),
                'items' => [
                    ['product_id' => $products->skip(2)->first()->id, 'quantity' => 5],
                ],
            ],
            [
                'customer_id' => $customers[3]->id,
                'employee_id' => $employees[1]->id,
                'sold_at' => now()->subDays(20),
                'items' => [
                    ['product_id' => $products->skip(3)->first()->id, 'quantity' => 2],
                    ['product_id' => $products->skip(4)->first()->id, 'quantity' => 1],
                ],
            ],
            [
                'customer_id' => $customers[4]->id,
                'employee_id' => $employees[2]->id,
                'sold_at' => now()->subDays(5),
                'items' => [
                    ['product_id' => $products->skip(5)->first()->id, 'quantity' => 1],
                    ['product_id' => $products->skip(6)->first()->id, 'quantity' => 1],
                ],
            ],
        ];

        foreach ($salesData as $saleData) {
            DB::transaction(function () use ($saleData, $products) {
                $totalAmount = 0;

                foreach ($saleData['items'] as $item) {
                    $product = $products[$item['product_id']];
                    $quantity = $item['quantity'];

                    $totalAmount += $product->price * $quantity;
                }

                $sale = Sale::create([
                    'customer_id' => $saleData['customer_id'],
                    'employee_id' => $saleData['employee_id'],
                    'total_amount' => round($totalAmount, 2),
                    'sold_at' => $saleData['sold_at'],
                ]);

                foreach ($saleData['items'] as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                    $quantity = $item['quantity'];

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $product->price,
                        'line_total' => round($product->price * $quantity, 2),
                    ]);

                    $product->decrement('stock_quantity', $quantity);
                }
            });
        }
    }
}