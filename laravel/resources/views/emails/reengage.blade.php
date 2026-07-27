<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>We Miss You</title>
</head>
<body>
    <h2>Hello {{ $customerName ?? 'Customer' }},</h2>

    <p>{{ $messageText }}</p>

    <p>Best regards,<br>{{ config('app.name') }}</p>
</body>
</html>