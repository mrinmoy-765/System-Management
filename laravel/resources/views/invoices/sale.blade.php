<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $sale->id }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; color: #222; }
        .header { margin-bottom: 20px; }
        .meta, .items { width: 100%; border-collapse: collapse; }
        .items th, .items td { border: 1px solid #ddd; padding: 8px; }
        .items th { background: #f4f4f4; text-align: left; }
        .right { text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ config('app.name') }}</h2>
        <p><strong>Invoice #:</strong> {{ $sale->id }}</p>
        <p><strong>Date:</strong> {{ $sale->sold_at }}</p>
        <p><strong>Customer:</strong> {{ $sale->customer->name }} ({{ $sale->customer->email }})</p>
    </div>

    <table class="items">
        <thead>
            <tr>
                <th>Product</th>
                <th class="right">Qty</th>
                <th class="right">Unit Price</th>
                <th class="right">Line Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($sale->items as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td class="right">{{ $item->quantity }}</td>
                    <td class="right">${{ number_format($item->unit_price, 2) }}</td>
                    <td class="right">${{ number_format($item->line_total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="3" class="right">Grand Total</th>
                <th class="right">${{ number_format($sale->total_amount, 2) }}</th>
            </tr>
        </tfoot>
    </table>

    <p style="margin-top: 20px;">Thank you for your purchase.</p>
</body>
</html>