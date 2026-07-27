<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\EmployeeController;

Route::prefix('v1')->group(function () {

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show'])->whereNumber('product');
    Route::put('/products/{product}', [ProductController::class, 'update'])->whereNumber('product');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->whereNumber('product');

    // Sales
    Route::get('/sales', [SaleController::class, 'index']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::get('/sales/{sale}', [SaleController::class, 'show'])->whereNumber('sale');

    // Customers
    Route::get('/customers/lost', [CustomerController::class, 'lost']);
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->whereNumber('customer');
    Route::get('/customers/{customer}/history', [CustomerController::class, 'history'])->whereNumber('customer');
    Route::post('/customers/{customer}/assign', [CustomerController::class, 'assign'])->whereNumber('customer');
    Route::post('/customers/{customer}/reengage', [CustomerController::class, 'reengage'])->whereNumber('customer');

    // Employees
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->whereNumber('employee');
    Route::get('/employees/{employee}/kpi', [EmployeeController::class, 'kpi'])->whereNumber('employee');
});