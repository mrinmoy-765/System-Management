<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'name',
        'email',
        'kpi_score',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function customerAssignments()
    {
        return $this->hasMany(CustomerAssignment::class);
    }
}
