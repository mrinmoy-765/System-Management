<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    public function ensureStock(Collection $products, Collection $items): void
    {
        foreach ($items as $item) {
            $product = $products->get($item['product_id']);
            $quantity = (int) $item['quantity'];

            if (! $product) {
                throw ValidationException::withMessages([
                    'items' => ['Invalid product selected.'],
                ]);
            }

            if ($product->stock_quantity < $quantity) {
                throw ValidationException::withMessages([
                    'items' => ["Insufficient stock for {$product->name}."],
                ]);
            }
        }
    }
}