<?php

namespace App\Enums;

enum BlogStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Published = 'published';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Pending => 'Pending Review',
            self::Published => 'Published',
            self::Rejected => 'Rejected',
        };
    }
}
