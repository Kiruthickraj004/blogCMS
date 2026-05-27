# Blog CMS

A full-stack blog content management system built with **Laravel 12** backend and **React 18** frontend with modern tooling.

## 🚀 Features

- **Multi-role User System**: Admin, Author, and Viewer roles with role-based access control
- **Blog Management**: Create, edit, delete, and submit blogs for review
- **Approval Workflow**: Admin approval/rejection process with email notifications
- **Like System**: Users can like/unlike blog posts
- **Subscription System**: Viewers can subscribe to authors to get updates
- **Statistics & Analytics**: Author and Admin dashboards with insights
- **Email Notifications**: Automatic emails for account actions, blog submissions, approvals, and rejections
- **Category Management**: Organized content with categories
- **Search & Suggestions**: Personalized blog recommendations

## 📋 Tech Stack

### Backend
- **Framework**: Laravel 12
- **Authentication**: Laravel Sanctum (API token-based)
- **Database**: MySQL
- **Email**: Built-in Mail system
- **PHP**: ^8.2
- **Testing**: PHPUnit 11

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
blogCMS/
├── backend/                      # Laravel API application
│   ├── app/
│   │   ├── Enums/               # Enums (BlogStatus, UserRole)
│   │   ├── Http/
│   │   │   ├── Controllers/     # API Controllers
│   │   │   └── Middleware/      # Custom middleware
│   │   ├── Mail/                # Email classes
│   │   ├── Models/              # Database models
│   │   ├── Providers/           # Service providers
│   │   └── Services/            # Business logic services
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/             # Database seeders
│   ├── routes/
│   │   └── api.php              # API routes
│   ├── config/                  # Configuration files
│   ├── bootstrap/               # Framework bootstrapping
│   ├── public/                  # Public assets
│   ├── storage/                 # Logs and cache
│   ├── artisan                  # Laravel CLI
│   └── composer.json            # PHP dependencies
│
└── frontend/                    # React SPA application
    ├── src/
    │   ├── api/                 # API client utilities
    │   ├── components/          # Reusable components
    │   ├── context/             # React context (state management)
    │   ├── pages/               # Page components
    │   ├── App.jsx              # Root component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── package.json             # Node dependencies
    ├── vite.config.js           # Vite configuration
    ├── tailwind.config.js       # Tailwind CSS config
    └── index.html               # HTML template
```

## 🔧 Installation

### Prerequisites
- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- MySQL 8 or higher
- XAMPP (or similar local development environment)

### Backend Setup

1. **Install PHP Dependencies**
   ```bash
   cd backend
   composer install
   ```

2. **Create Environment File**
   ```bash
   copy .env.example .env
   ```

3. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

4. **Configure Database**
   Update `.env` with your database credentials:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=blog_cms
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Run Migrations**
   ```bash
   php artisan migrate
   ```

6. **(Optional) Seed Database**
   ```bash
   php artisan db:seed
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

## 🏃 Running the Application

### Backend

Start the Laravel development server:
```bash
cd backend
php artisan serve
```

The backend will run on: `http://localhost:8000`

### Frontend

Start the Vite development server:
```bash
cd frontend
npm run dev
```

The frontend will run on: `http://localhost:5173`

**Build for Production:**
```bash
npm run build
```

## 🔐 User Roles & Permissions

### Viewer
- View published blogs
- Like/unlike blogs
- Subscribe to authors
- View recommendations
- Access viewer dashboard

### Author
- Create, edit, and delete blogs
- Submit blogs for admin approval
- View blog statistics
- Like blogs and subscribe to other authors
- Modify unpublished blogs

### Admin
- Manage all blogs (approve/reject submissions)
- Send approval/rejection notifications
- Manage user accounts
- View platform statistics
- Access admin dashboard

## 🔌 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout (requires auth)
- `GET /user` - Get current user (requires auth)

### Blogs (Public)
- `GET /blogs` - List all published blogs
- `GET /blogs/{slug}` - Get blog details
- `GET /categories` - List all categories

### Blogs (Authenticated)
- `GET /my-blogs` - Get user's blogs (Author/Admin)
- `POST /blogs` - Create blog (Author/Admin)
- `PUT /blogs/{blog}` - Update blog (Author/Admin)
- `DELETE /blogs/{blog}` - Delete blog (Author/Admin)
- `POST /blogs/{blog}/submit` - Submit for review (Author/Admin)

### Likes & Subscriptions
- `POST /blogs/{blog}/like` - Toggle like on blog
- `GET /liked-blogs` - Get liked blogs
- `POST /authors/{author}/subscribe` - Toggle subscription
- `GET /subscriptions` - Get subscribed authors
- `GET /suggestions` - Get blog suggestions

### Dashboards
- `GET /viewer/dashboard` - Viewer dashboard stats
- `GET /author/stats` - Author statistics
- `GET /admin/stats` - Admin statistics

### Admin Management
- `GET /admin/pending-blogs` - List pending blogs for approval
- `POST /admin/blogs/{blog}/approve` - Approve blog
- `POST /admin/blogs/{blog}/reject` - Reject blog
- `GET /admin/users` - List all users
- `PATCH /admin/users/{user}` - Update user
- `DELETE /admin/users/{user}` - Delete user

## 📊 Database Schema

### Tables
- **users** - User accounts with roles
- **blogs** - Blog posts with status tracking
- **categories** - Blog categories
- **likes** - User likes on blogs
- **subscriptions** - Author subscriptions
- **personal_access_tokens** - API authentication tokens

### Key Models
- `User` - Application users
- `Blog` - Blog posts
- `Category` - Blog categories
- `Like` - Blog likes
- `Subscription` - Author subscriptions

## 💾 Environment Variables

### Backend (.env)
```
APP_NAME="Blog CMS"
APP_ENV=local
APP_DEBUG=true
APP_KEY=
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog_cms
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD="your-app-passoword"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend
php artisan test
```

### Frontend Development
The frontend uses Vite's hot module replacement for rapid development.

## 📝 Email Templates

Located in `backend/resources/views/emails/`:
- Account removal notification
- Blog approval notification
- Blog rejection notification
- Blog submission notification

## 🔒 Security Features

- CORS configuration for frontend/backend communication
- Sanctum token-based API authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Email verification for important actions

## 📚 Key Features Breakdown

### Blog Workflow
1. Author creates a blog post (unpublished)
2. Author submits blog for review
3. Admin reviews and either approves or rejects
4. Upon approval, blog is published and visible to all users
5. Email notifications sent for each stage

### Engagement Features
- Users can like published blogs
- Users can subscribe to authors for updates
- Personalized blog recommendations based on interests
- Author statistics showing likes, subscribers, and views

## 🚀 Future Enhancements
- Comments system
- Blog search functionality
- Advanced filtering and sorting
- Social sharing features
- Image upload for blog covers
- Draft auto-save
- Collaborative editing

## 📝 License

This project is open-source software.

## 🤝 Contributing

Contributions are welcome. Please ensure all tests pass before submitting pull requests.

## 📞 Support

For issues or questions, please open an issue in the repository.
