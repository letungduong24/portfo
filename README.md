# Portfolio - Ứng dụng Portfolio Cá nhân

Ứng dụng portfolio cá nhân được xây dựng với **Next.js** (frontend) và **NestJS** (backend API), sử dụng **PostgreSQL** làm cơ sở dữ liệu. Ứng dụng hỗ trợ đa ngôn ngữ (Tiếng Việt/English), quản lý dự án, blog, và tích hợp AI để tạo nội dung.

## Tính năng

-  Giao diện hiện đại, responsive với dark mode
-  Đa ngôn ngữ (Tiếng Việt/English)
-  Quản lý dự án, blog, và hồ sơ cá nhân
-  Tích hợp Gemini AI để tạo nội dung tự động
-  Gửi email qua Resend
-  Upload và quản lý hình ảnh với Cloudinary
-  Xác thực JWT cho admin
-  Triển khai dễ dàng với Docker

##  Yêu cầu hệ thống

- **Docker** và **Docker Compose** (khuyến nghị phiên bản mới nhất)
- **Node.js** 20+ (nếu chạy không dùng Docker)
- **PostgreSQL** 16+ (nếu chạy không dùng Docker)

---

##  Chạy ứng dụng Local với Docker Compose

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd portfolio1
```

### Bước 2: Cấu hình biến môi trường

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với các thông tin cần thiết:

### Bước 3: Khởi động ứng dụng

```bash
docker-compose up -d
```

### Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost:4000
- **API**: http://localhost:4001
- **Admin Panel**: http://localhost:4000/admin

Đăng nhập admin với thông tin trong file `.env`:
- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`