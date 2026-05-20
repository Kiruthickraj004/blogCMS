<?php

namespace App\Mail;

use App\Models\Blog;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BlogSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Blog $blog) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New blog pending approval: '.$this->blog->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.blog-submitted',
        );
    }
}
