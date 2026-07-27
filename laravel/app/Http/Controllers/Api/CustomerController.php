<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignCustomerRequest;
use App\Http\Requests\ReengageCustomerRequest;
use App\Http\Resources\CustomerAssignmentResource;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        $customers = Customer::latest()->get();

        return response()->json([
            'message' => 'Customers retrieved successfully',
            'data' => CustomerResource::collection($customers),
        ]);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json([
            'message' => 'Customer retrieved successfully',
            'data' => new CustomerResource($customer),
        ]);
    }

    public function history(Customer $customer, CustomerService $customerService): JsonResponse
    {
        $history = $customerService->purchaseHistory($customer);

        return response()->json([
            'message' => 'Customer purchase history retrieved successfully',
            'data' => $history,
        ]);
    }

    public function lost(Request $request, CustomerService $customerService): JsonResponse
    {
        $days = (int) $request->query('days', 90);
        $lostCustomers = $customerService->lostCustomers($days);

        return response()->json([
            'message' => 'Lost customers retrieved successfully',
            'data' => CustomerResource::collection($lostCustomers),
        ]);
    }

    public function assign(
        AssignCustomerRequest $request,
        Customer $customer,
        CustomerService $customerService
    ): JsonResponse {
        $assignment = $customerService->assignCustomer(
            $customer,
            $request->validated()['employee_id']
        );

        $assignment->load(['customer', 'employee']);

        return response()->json([
            'message' => 'Customer assigned successfully',
            'data' => new CustomerAssignmentResource($assignment),
        ], 201);
    }

    public function reengage(
        ReengageCustomerRequest $request,
        Customer $customer,
        CustomerService $customerService
    ): JsonResponse {
        $result = $customerService->reengageCustomer(
            $customer,
            $request->validated()['channel'],
            $request->validated()['message']
        );

        return response()->json([
            'message' => 'Re-engagement action completed successfully',
            'data' => $result,
        ]);
    }
}