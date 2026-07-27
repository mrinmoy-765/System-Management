<?php

namespace App\Mail;

use App\Models\Sale;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SaleInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Sale $sale)
    {
        $this->sale->load(['customer', 'employee', 'items.product']);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Invoice #' . $this->sale->id
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'invoices.sale',
            with: [
                'sale' => $this->sale,
            ]
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('invoices.sale', [
            'sale' => $this->sale,
        ])->output();

        return [
            Attachment::fromData(fn () => $pdf, 'invoice-' . $this->sale->id . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}