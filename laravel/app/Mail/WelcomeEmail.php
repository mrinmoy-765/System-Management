<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public string $messageText;

    public function __construct(string $messageText)
    {
        $this->messageText = $messageText;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We Miss You - Special Offer'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reengage'
        );
    }

    public function attachments(): array
    {
        return [];
    }
}