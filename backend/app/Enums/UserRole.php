<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Author = 'author';
    case Viewer = 'viewer';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Author => 'Author',
            self::Viewer => 'Viewer',
        };
    }
}
