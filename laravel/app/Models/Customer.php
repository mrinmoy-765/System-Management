<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function assignments()
    {
        return $this->hasMany(CustomerAssignment::class);
    }

    public function activeAssignment()
    {
        return $this->hasOne(CustomerAssignment::class)->where('is_active', true);
    }
}
