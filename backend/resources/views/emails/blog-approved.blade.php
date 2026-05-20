<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b;">
    <h2>Your blog is live!</h2>
    <p>Hi {{ $blog->author->name }},</p>
    <p><strong>{{ $blog->title }}</strong> has been approved and published.</p>
    <p>Thank you for contributing to Blog Management.</p>
</body>
</html>
