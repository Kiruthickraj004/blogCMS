<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Enums\BlogStatus;
use App\Enums\UserRole;
use App\Mail\AccountRemovedMail;
use App\Mail\BlogApprovedMail;
use App\Mail\BlogRejectedMail;
use App\Models\Blog;
use App\Models\User;
use App\Services\StatsAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function __construct(private StatsAiService $stats) {}

    public function pendingBlogs(): JsonResponse
    {
        $blogs = Blog::pending()
            ->with(['author:id,name,email', 'category'])
            ->latest()
            ->paginate(15);

        return response()->json($blogs);
    }

    public function approve(Blog $blog): JsonResponse
    {
        if ($blog->status !== BlogStatus::Pending) {
            return response()->json(['message' => 'Only pending blogs can be approved.'], 422);
        }

        $blog->update([
            'status' => BlogStatus::Published,
            'published_at' => now(),
            'rejection_reason' => null,
        ]);

        Mail::to($blog->author->email)->send(new BlogApprovedMail($blog->load('author')));
        $this->stats->clearCaches($blog->user_id);

        return response()->json(['blog' => $blog, 'message' => 'Blog approved and published.']);
    }

    public function reject(Request $request, Blog $blog): JsonResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        if ($blog->status !== BlogStatus::Pending) {
            return response()->json(['message' => 'Only pending blogs can be rejected.'], 422);
        }

        $blog->update([
            'status' => BlogStatus::Rejected,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        Mail::to($blog->author->email)->send(new BlogRejectedMail($blog->load('author')));
        $this->stats->clearCaches($blog->user_id);

        return response()->json(['blog' => $blog, 'message' => 'Blog rejected. Author notified.']);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::query()->withCount('blogs');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        if ($user->isAdmin() && $request->user()->id === $user->id && $request->has('is_active') && ! $request->boolean('is_active')) {
            return response()->json(['message' => 'You cannot deactivate your own admin account.'], 422);
        }

        $validated = $request->validate([
            'role' => ['sometimes', Rule::enum(UserRole::class)],
            'is_active' => ['sometimes', 'boolean'],
            'name' => ['sometimes', 'string', 'max:255'],
        ]);

        if (isset($validated['role']) && $validated['role'] === UserRole::Admin->value && ! $request->user()->isAdmin()) {
            abort(403);
        }

        $user->update($validated);

        return response()->json(['user' => $user->fresh()]);
    }

    public function deleteUser(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        $name = $user->name;
        $email = $user->email;

        Mail::to($email)->send(new AccountRemovedMail($name, $email));
        $user->delete();
        $this->stats->clearCaches();

        return response()->json(['message' => 'User removed and notified via email.']);
    }
}
