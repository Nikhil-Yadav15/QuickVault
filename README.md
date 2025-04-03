# QuickVault 🚀

Effortless File Transfers, Simplified. QuickVault is a modern file-sharing platform that allows users to upload files and generate custom shareable links instantly—no sign-ups or logins required.


## Features ✨

- **Drag & Drop Interface**: Intuitive file uploading experience
- **Instant Shareable Links**: Get custom links immediately after upload
- **No Authentication Required**: Completely anonymous usage
- **Generous 1GB File Limit**: Transfer large files with ease
- **Secure Storage**: Files stored securely in Cloudinary
- **Auto-Cleanup**: Files older than 10 days are automatically deleted
- **Responsive Design**: Works perfectly on all devices

## Tech Stack 💻

- **Frontend & Backend**: Next.js (App Router)
- **Database**: MongoDB (File metadata storage)
- **File Storage**: Cloudinary
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

## How It Works 🔧

1. User uploads file via drag-and-drop or file selection
2. File is uploaded to Cloudinary storage
3. File metadata (name, size, URL, expiry date) is stored in MongoDB
4. User receives a unique shareable link
5. GitHub Actions runs daily to purge files older than 10 days
