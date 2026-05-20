<?php

namespace Database\Seeders;

use App\Enums\BlogStatus;
use App\Enums\UserRole;
use App\Models\Blog;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@blogmanagement.test',
            'password' => 'password',
            'role' => UserRole::Admin,
            'bio' => 'Platform administrator',
        ]);

        $author = User::create([
            'name' => 'Jane Author',
            'email' => 'author@blogmanagement.test',
            'password' => 'password',
            'role' => UserRole::Author,
            'bio' => 'Full-stack writer and educator',
        ]);

        $viewer = User::create([
            'name' => 'Alex Viewer',
            'email' => 'viewer@blogmanagement.test',
            'password' => 'password',
            'role' => UserRole::Viewer,
        ]);

        $categories = collect([
            ['name' => 'Technology', 'slug' => 'technology', 'color' => '#6366f1'],
            ['name' => 'Design', 'slug' => 'design', 'color' => '#ec4899'],
            ['name' => 'Business', 'slug' => 'business', 'color' => '#14b8a6'],
            ['name' => 'Lifestyle', 'slug' => 'lifestyle', 'color' => '#f59e0b'],
        ])->map(fn ($c) => Category::create($c));

        $samples = [
            ['title' => 'Building APIs with Laravel Sanctum', 'category' => 'technology'],
            ['title' => 'React Dashboard Patterns for CMS Apps', 'category' => 'technology'],
            ['title' => 'Typography Systems That Scale', 'category' => 'design'],
            ['title' => 'Remote Team Communication in 2026', 'category' => 'business'],
            ['title' => 'Mindful Productivity for Developers', 'category' => 'lifestyle'],
        ];

        foreach ($samples as $i => $sample) {
            $category = $categories->firstWhere('slug', $sample['category']);
            Blog::create([
                'user_id' => $author->id,
                'category_id' => $category->id,
                'title' => $sample['title'],
                'slug' => Str::slug($sample['title']).'-'.Str::random(4),
                'excerpt' => 'A practical guide covering patterns, pitfalls, and production-ready tips.',
                'content' => "<p>This is sample content for <strong>{$sample['title']}</strong>.</p><p>Replace with your own rich HTML or markdown-rendered content in production.</p>",
                'status' => BlogStatus::Published,
                'views_count' => rand(50, 500),
                'published_at' => now()->subDays(5 - $i),
            ]);
        }

        Blog::create([
            'user_id' => $author->id,
            'category_id' => $categories->first()->id,
            'title' => 'Draft: Upcoming Post on SMTP',
            'slug' => 'draft-smtp-'.Str::random(4),
            'excerpt' => 'Work in progress',
            'content' => '<p>Draft content...</p>',
            'status' => BlogStatus::Draft,
        ]);

        Blog::create([
            'user_id' => $author->id,
            'category_id' => $categories->first()->id,
            'title' => 'Pending: Advanced Tailwind Techniques',
            'slug' => 'pending-tailwind-'.Str::random(4),
            'excerpt' => 'Awaiting admin review',
            'content' => '<p>Pending review content...</p>',
            'status' => BlogStatus::Pending,
        ]);
    }
}
