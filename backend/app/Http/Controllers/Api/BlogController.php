<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Enums\BlogStatus;
use App\Mail\BlogSubmittedMail;
use App\Models\Blog;
use App\Models\Category;
use App\Services\StatsAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function __construct(private StatsAiService $stats) {}

    public function index(Request $request): JsonResponse
    {
        $query = Blog::published()
            ->with(['author:id,name,avatar', 'category:id,name,slug,color'])
            ->withCount('likes');

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($request->filled('author_id')) {
            $query->where('user_id', $request->author_id);
        }

        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'popular' => $query->orderByDesc('views_count'),
            'likes' => $query->orderByDesc('likes_count'),
            default => $query->orderByDesc('published_at'),
        };

        return response()->json($query->paginate($request->integer('per_page', 12)));
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $blog = Blog::where('slug', $slug)
            ->with(['author:id,name,avatar,bio', 'category'])
            ->withCount('likes')
            ->firstOrFail();

        $user = $request->user();
        $canView = $blog->status === BlogStatus::Published
            || ($user && ($user->isAdmin() || $blog->user_id === $user->id));

        if (! $canView) {
            abort(404);
        }

        if ($blog->status === BlogStatus::Published) {
            $blog->increment('views_count');
        }

        $liked = $user
            ? $blog->likes()->where('user_id', $user->id)->exists()
            : false;

        return response()->json([
            'blog' => $blog,
            'liked' => $liked,
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json(
            Category::withCount(['blogs' => fn ($q) => $q->published()])->orderBy('name')->get()
        );
    }

    public function myBlogs(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Blog::with('category')->withCount('likes');

        if (! $user->isAdmin() || ! $request->boolean('all')) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateBlog($request);

        $blog = Blog::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'slug' => Str::slug($validated['title']).'-'.Str::random(5),
            'status' => BlogStatus::from($validated['status'] ?? 'draft'),
        ]);

        $this->stats->clearCaches($request->user()->id);

        return response()->json(['blog' => $blog->load('category')], 201);
    }

    public function update(Request $request, Blog $blog): JsonResponse
    {
        $this->authorizeBlog($request, $blog);
        $validated = $this->validateBlog($request, $blog);

        $blog->update($validated);
        $this->stats->clearCaches($blog->user_id);

        return response()->json(['blog' => $blog->fresh()->load('category')]);
    }

    public function destroy(Request $request, Blog $blog): JsonResponse
    {
        $this->authorizeBlog($request, $blog, allowAdmin: true);
        $authorId = $blog->user_id;
        $blog->delete();
        $this->stats->clearCaches($authorId);

        return response()->json(['message' => 'Blog deleted.']);
    }

    public function submitForReview(Request $request, Blog $blog): JsonResponse
    {
        $this->authorizeBlog($request, $blog);

        if (! in_array($blog->status, [BlogStatus::Draft, BlogStatus::Rejected], true)) {
            return response()->json(['message' => 'Blog cannot be submitted in its current state.'], 422);
        }

        $blog->update([
            'status' => BlogStatus::Pending,
            'rejection_reason' => null,
        ]);

        $adminEmail = config('mail.admin_email', env('ADMIN_EMAIL'));
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new BlogSubmittedMail($blog->load('author')));
        }

        $this->stats->clearCaches();

        return response()->json(['blog' => $blog, 'message' => 'Submitted for admin review.']);
    }

    private function validateBlog(Request $request, ?Blog $blog = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'featured_image' => ['nullable', 'url', 'max:500'],
            'status' => ['sometimes', 'in:draft,pending'],
        ]);
    }

    private function authorizeBlog(Request $request, Blog $blog, bool $allowAdmin = false): void
    {
        $user = $request->user();
        if ($user->isAdmin() && $allowAdmin) {
            return;
        }
        if ($blog->user_id !== $user->id && ! $user->isAdmin()) {
            abort(403);
        }
    }
}
