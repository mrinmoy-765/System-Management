<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\CustomerAssignment;
use App\Models\Employee;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Mail\SaleInvoiceMail;
use Illuminate\Support\Facades\Mail;

class SaleService
{
    public function createSale(array $data): Sale
    {
        $sale = DB::transaction(function () use ($data) {
            $customer = Customer::findOrFail($data['customer_id']);

            $saleEmployeeId = $data['employee_id'] ?? null;

            $activeAssignment = CustomerAssignment::query()
                ->where('customer_id', $customer->id)
                ->where('is_active', true)
                ->latest('assigned_at')
                ->first();

            if (! $saleEmployeeId && $activeAssignment) {
                $saleEmployeeId = $activeAssignment->employee_id;
            }

            $items = collect($data['items']);
            $productIds = $items->pluck('product_id')->unique()->values()->all();

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($products->count() !== count($productIds)) {
                $missingIds = array_values(array_diff($productIds, $products->keys()->all()));

                throw ValidationException::withMessages([
                    'items' => ['Invalid product id(s): ' . implode(', ', $missingIds)],
                ]);
            }

            $totalAmount = 0;

            foreach ($items as $item) {
                $product = $products[$item['product_id']];
                $quantity = (int) $item['quantity'];

                if ($product->stock_quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for {$product->name}. Available: {$product->stock_quantity}"],
                    ]);
                }

                $totalAmount += ((float) $product->price) * $quantity;
            }

            $sale = Sale::create([
                'customer_id' => $customer->id,
                'employee_id' => $saleEmployeeId,
                'total_amount' => round($totalAmount, 2),
                'sold_at' => now(),
            ]);

            foreach ($items as $item) {
                $product = $products[$item['product_id']];
                $quantity = (int) $item['quantity'];
                $unitPrice = (float) $product->price;
                $lineTotal = round($unitPrice * $quantity, 2);

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ]);

                $product->decrement('stock_quantity', $quantity);
            }

            if ($activeAssignment) {
                Employee::whereKey($activeAssignment->employee_id)->increment('kpi_score');
                $activeAssignment->update(['is_active' => false]);
            }

            return $sale->load(['customer', 'employee', 'items.product']);
        });

        try {
            Mail::to($sale->customer->email)->send(new SaleInvoiceMail($sale));
        } catch (\Throwable $e) {
           
            report($e);
        }

        return $sale;
    }
}