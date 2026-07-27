<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\CustomerAssignment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;

class CustomerService
{
    public function purchaseHistory(Customer $customer): array
    {
        $sales = $customer->sales()
            ->with('items.product')
            ->orderByDesc('sold_at')
            ->get();

        return [
            'customer' => $customer,
            'purchase_frequency' => $sales->count(),
            'last_purchase_date' => $sales->first()?->sold_at,
            'sales' => $sales,
        ];
    }

    public function lostCustomers(int $days = 90): Collection
    {
        $cutoff = now()->subDays($days);

        return Customer::query()
            ->withMax('sales', 'sold_at')
            ->get()
            ->filter(function ($customer) use ($cutoff) {
                $lastPurchase = $customer->sales_max_sold_at
                    ? Carbon::parse($customer->sales_max_sold_at)
                    : null;

                return ! $lastPurchase || $lastPurchase->lt($cutoff);
            })
            ->values();
    }

    public function assignCustomer(Customer $customer, int $employeeId): CustomerAssignment
    {
        CustomerAssignment::query()
            ->where('customer_id', $customer->id)
            ->where('is_active', true)
            ->update(['is_active' => false]);

        return CustomerAssignment::create([
            'customer_id' => $customer->id,
            'employee_id' => $employeeId,
            'assigned_at' => now(),
            'is_active' => true,
        ]);
    }

    public function reengageCustomer(Customer $customer, string $channel, string $message): array
{
    if ($channel === 'email') {
        Mail::to($customer->email)->send(new WelcomeEmail($message));

        return [
            'customer_id' => $customer->id,
            'channel' => 'email',
            'message' => $message,
            'status' => 'email_sent',
            'sent_to' => $customer->email,
            'sent_at' => now()->toDateTimeString(),
        ];
    }

    return [
        'customer_id' => $customer->id,
        'channel' => 'sms',
        'message' => $message,
        'status' => 'sms_simulated',
        'sent_at' => now()->toDateTimeString(),
    ];
}
}