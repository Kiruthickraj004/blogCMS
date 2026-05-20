<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b;">
    <h2>New blog awaiting approval</h2>
    <p><strong>{{ $blog->title }}</strong> was submitted by {{ $blog->author->name }}.</p>
    <p>Status: {{ $blog->status->label() }}</p>
    <p>Log in to the admin dashboard to review and approve or reject this post.</p>
</body>
</html>
