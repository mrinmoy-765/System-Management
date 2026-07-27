<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Resources\SaleResource;
use App\Models\Sale;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;

class SaleController extends Controller
{
    public function index(): JsonResponse
    {
        $sales = Sale::with(['customer', 'employee', 'items.product'])
            ->latest('sold_at')
            ->get();

        return response()->json([
            'message' => 'Sales retrieved successfully',
            'data' => SaleResource::collection($sales),
        ]);
    }

    public function store(StoreSaleRequest $request, SaleService $saleService): JsonResponse
    {
        $sale = $saleService->createSale($request->validated());

        return response()->json([
            'message' => 'Sale created successfully',
            'data' => new SaleResource($sale),
        ], 201);
    }

    public function show(Sale $sale): JsonResponse
    {
        $sale->load(['customer', 'employee', 'items.product']);

        return response()->json([
            'message' => 'Sale retrieved successfully',
            'data' => new SaleResource($sale),
        ]);
    }
}