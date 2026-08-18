<?php

namespace App\Models;

use App\Enums\BlogStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Blog extends Model
{
    protected $fillable = [
        'user_id',
        
        'category_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'rejection_reason',
        'views_count',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => BlogStatus::class,
            'published_at' => 'datetime',
            'views_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Blog $blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title).'-'.Str::random(4);
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', BlogStatus::Published);
    }

    public function scopePending($query)
    {
        return $query->where('status', BlogStatus::Pending);
    }
}
