<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerAssignment extends Model
{
    protected $fillable = [
        'customer_id',
        'employee_id',
        'assigned_at',
        'is_active',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
