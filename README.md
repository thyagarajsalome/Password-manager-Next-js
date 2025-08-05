# 🔐 SecureVault - Password Manager

A modern, secure password manager built with Next.js 15, TypeScript, and Prisma. Features emoji-enhanced UI, password generation, and Indian payment gateway integration.

## 🚀 Features

### Core Features
- **🔐 Secure Password Storage**: AES-256 encrypted password storage
- **🎨 Emoji-Enhanced UI**: Beautiful, intuitive interface with emojis
- **⚡ Password Generator**: Advanced password generator with customizable options
- **🔍 Search & Filter**: Find passwords quickly with search and category filters
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

### Security Features
- **🛡️ Military-Grade Encryption**: AES-256 encryption for all passwords
- **🔑 Password Strength Validation**: Real-time password strength analysis
- **📊 Security Audit Logs**: Track all security-related events
- **🛡️ Security Middleware**: Protection against common web attacks
- **🔒 Secure Authentication**: NextAuth.js with session management

### Freemium Model
- **🆓 Free Plan**: Up to 20 passwords, basic features
- **👑 Premium Plan**: Unlimited passwords, advanced features (₹99/month)
- **🏢 Enterprise Plan**: Team management, custom integrations (₹199/month)

### Payment Integration
- **💳 Indian Payment Gateway**: Razorpay integration
- **🪙 Multiple Payment Methods**: Credit/Debit cards, UPI, NetBanking
- **📝 Subscription Management**: Automated subscription handling

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Authentication**: NextAuth.js v4
- **Database**: SQLite with Prisma ORM
- **Payment Gateway**: Razorpay
- **State Management**: Zustand, TanStack Query
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with shadcn/ui theme

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd securevault-password-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   DATABASE_URL=file:./dev.db
   
   # Razorpay Payment Gateway
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # NextAuth
   NEXTAUTH_SECRET=your_secure_secret_here
   NEXTAUTH_URL=http://localhost:3000
   
   # Encryption
   ENCRYPTION_KEY=your_32_character_encryption_key
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Razorpay Setup

1. **Create a Razorpay account**
   - Sign up at [Razorpay](https://razorpay.com/)
   - Complete KYC verification

2. **Get API Keys**
   - Navigate to Settings → API Keys
   - Generate Test Key Id and Key Secret
   - Add them to your `.env` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `RAZORPAY_KEY_ID` | Razorpay API Key Id | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `ENCRYPTION_KEY` | 32-character encryption key | Yes |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── passwords/     # Password management
│   │   ├── payment/       # Payment processing
│   │   └── security/      # Security audit logs
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── payment/           # Payment page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── password-entry.tsx
│   ├── password-generator.tsx
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database client
│   ├── security.ts      # Security utilities
│   └── razorpay.ts      # Razorpay utilities
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables**
   - Add all environment variables to Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

```bash
# Build the image
docker build -t securevault .

# Run the container
docker run -p 3000:3000 --env-file .env securevault
```

## 🔐 Security Features

### Password Encryption
- All passwords are encrypted using AES-256-GCM
- Each password has a unique initialization vector (IV)
- Authentication tags ensure data integrity
- Encryption keys are stored securely in environment variables

### Security Middleware
- Rate limiting for API endpoints
- Suspicious activity detection
- Security headers (CSP, XSS Protection, etc.)
- Input sanitization and validation

### Audit Logging
- All security events are logged
- Tracks user authentication, password access, and payment events
- IP address and user agent logging
- Timestamped audit trails

## 💰 Pricing Plans

### Free Plan - ₹0/month
- Up to 20 passwords
- Basic password generator
- Essential categories
- Email support
- Mobile app access

### Premium Plan - ₹99/month
- Unlimited passwords
- Advanced password generator
- Custom categories
- Priority support
- Advanced security features
- Password sharing

### Enterprise Plan - ₹199/month
- Everything in Premium
- Team management
- Advanced analytics
- SSO integration
- Dedicated account manager
- Custom integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Prisma](https://prisma.io/) for the modern database toolkit
- [Razorpay](https://razorpay.com/) for the Indian payment gateway
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

For support, please email support@securevault.app or create an issue on GitHub.

---

Built with ❤️ in India 🇮🇳# Password-manager-Next-js
