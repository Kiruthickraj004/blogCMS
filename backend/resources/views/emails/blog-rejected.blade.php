<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b;">
    <h2>Blog review update</h2>
    <p>Hi {{ $blog->author->name }},</p>
    <p><strong>{{ $blog->title }}</strong> was not approved at this time.</p>
    @if($blog->rejection_reason)
        <p><strong>Reason:</strong> {{ $blog->rejection_reason }}</p>
    @endif
    <p>You can edit and resubmit from your author dashboard.</p>
</body>
</html>
