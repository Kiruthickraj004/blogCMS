<?php

namespace App\Mail;

use App\Models\Blog;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BlogApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Blog $blog) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your blog was approved: '.$this->blog->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.blog-approved',
        );
    }
}
