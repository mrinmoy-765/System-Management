<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReengageCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'channel' => ['required', 'in:email,sms'],
            'message' => ['required', 'string', 'max:1000'],
        ];
    }
}