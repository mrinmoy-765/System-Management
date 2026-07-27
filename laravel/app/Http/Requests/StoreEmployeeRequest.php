<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
//If you plan to allow employee creation through API later, add this too.
class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email'],
        ];
    }
}

