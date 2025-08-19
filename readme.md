# 🚀 **HisabKitab** 💰 - Smart Expense Tracker

<div align="center">

![HisabKitab Banner](./client/public/hisabkitab.svg)

![HisabKitab Logo](https://img.shields.io/badge/💰-HisabKitab-blue?style=for-the-badge&labelColor=000000)

**Your Personal Finance Command Center**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://rabbitmq.com/)

[🎯 **Live Demo**](https://your-demo-link.com) | [📚 **Documentation**](https://your-docs-link.com) | [🐛 **Report Bug**](https://github.com/your-username/finzio/issues)

</div>

---

## ✨ **Why HisabKitab?**

Transform your financial chaos into clarity with **HisabKitab** - a next-generation expense tracker that doesn't just store your data, but intelligently processes it using enterprise-grade technologies.

> 🎯 **Built for scale** • ⚡ **Lightning fast** • 🔐 **Bank-level security** • 📊 **Actionable insights**

---

## 🎨 **Features That Make You Go WOW**

<table>
<tr>
<td width="50%">

### 🔐 **Smart Authentication**

- JWT-powered secure login
- Redis session caching
- Auto token refresh
- Social login ready

### 💸 **Expense Intelligence**

- Smart categorization
- Bulk import/export
- Duplicate detection
- Receipt scanning ready

</td>
<td width="50%">

### 📊 **Real-time Analytics**

- Interactive dashboards
- Spending predictions
- Budget alerts
- Custom date ranges

### 📧 **Automated Reports**

- Weekly/Monthly summaries
- Email notifications
- PDF exports
- Trend analysis

</td>
</tr>
</table>

---

## 🏗️ **Architecture That Scales**

```mermaid
graph TB
    A[🖥️ React Frontend] --> B[🚀 Express API]
    B --> C[🍃 MongoDB]
    B --> D[⚡ Redis Cache]
    B --> E[🐰 RabbitMQ]
    E --> F[📧 Email Worker]
    E --> G[📊 Analytics Worker]

    style A fill:#61DAFB,stroke:#000,color:#000
    style B fill:#68A063,stroke:#000,color:#fff
    style C fill:#4EA94B,stroke:#000,color:#fff
    style D fill:#DC382D,stroke:#000,color:#fff
    style E fill:#FF6600,stroke:#000,color:#fff
```

| 🎯 **Component** | 🛠️ **Technology**    | 💡 **Purpose**                                       |
| ---------------- | -------------------- | ---------------------------------------------------- |
| **Frontend**     | React + Tailwind CSS | Beautiful, responsive UI with real-time updates      |
| **API Gateway**  | Node.js + Express    | RESTful API with middleware pipeline                 |
| **Database**     | MongoDB              | Flexible document storage for complex financial data |
| **Cache Layer**  | Redis                | Sub-second response times for frequent queries       |
| **Job Queue**    | RabbitMQ             | Reliable background processing for heavy tasks       |

---

## 🎯 **Quick Start Guide**

### 📋 **Prerequisites**

```bash
# Required Stack
✅ Node.js 18+
✅ MongoDB 6.0+
✅ Redis 7.0+
✅ RabbitMQ 3.11+
✅ Docker (optional but recommended)
```

### 🚀 **Lightning Setup**

**Option 1: GitHub Codespaces** ☁️

**Getting Started with GitHub Codespaces**

This project is configured to run seamlessly in a GitHub Codespaces environment.

**1. Launch the Codespace**

Click the "Code" button on the repository page and select **"Create codespace on main"**. This will set up a complete development environment in your browser, including a terminal.

**2. Start the Services**

The required services (MongoDB, Redis, RabbitMQ) can be started easily using the included Docker configuration. In the Codespaces terminal, run:

```bash
docker-compose up -d
```

**3. Set Up Environment Variables**

You need to create a `.env` file in the `server` directory to store your secret keys.

```bash
# Navigate to the server directory
cd server

# Create the .env file
touch .env
```

Now, open `server/.env` and paste the following content. You can change the `SECRET_KEY` and email credentials if you wish.

```bash
# Server Configuration
PORT=3000

# Database, Cache, and Queue Services (for Codespaces)
MONGO_URI=mongodb://localhost:27017/expense-tracker
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://admin:password@localhost:5672

# Security
SECRET_KEY=your_super_secret_random_string_make_it_very_long_and_unique_12345
EXPIRE_IN=7d

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cors origin for frontend
CORS_ORIGIN=http://localhost:5173
```

**4. Run the Application**

You'll need two separate terminals in your Codespace to run the backend and frontend.

**Terminal 1: Start the Backend**
```bash
cd server
npm install
npm run dev
```

**Terminal 2: Start the Frontend**
```bash
cd client
npm install
npm run dev
```

GitHub Codespaces will automatically forward the necessary ports. You can now access your running application by clicking the "Ports" tab in your Codespace.

---

**Option 2: Docker Magic** ✨

```bash
git clone https://github.com/mailmeatdaarshan/finzio.git
cd finzio
docker-compose up -d
# 🎉 That's it! Visit http://localhost:3000
```

**Option 3: Manual Setup** 🔧

```bash
# 1️⃣ Clone & Install
git clone https://github.com/mailmeatdaarshan/finzio.git
cd finzio && npm install

# 2️⃣ Environment Setup
cp .env.example .env
# Edit .env with your configuration

# 3️⃣ Start Services
npm run services:start  # Starts MongoDB, Redis, RabbitMQ
npm run dev             # Starts backend
npm run client:dev      # Starts frontend
```

### 🔧 **Environment Variables**

```bash
# 🔐 Security
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# 🗄️ Database
MONGO_URI=mongodb://localhost:27017/finzio
REDIS_URL=redis://localhost:6379

# 🐰 Message Queue
RABBITMQ_URL=amqp://localhost

# 📧 Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# 🌐 Application
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 📊 **Feature Showcase**

<div align="center">

### 💰 **Smart Expense Tracking**

![Expense Management](https://via.placeholder.com/600x300/4EA94B/FFFFFF?text=Smart+Expense+Tracking)

### 📈 **Beautiful Analytics**

![Analytics Dashboard](https://via.placeholder.com/600x300/61DAFB/000000?text=Real-time+Analytics)

### 📧 **Automated Insights**

![Email Reports](https://via.placeholder.com/600x300/FF6600/FFFFFF?text=Automated+Reports)

</div>

---

## 🛠️ **Development Workflow**

```bash
# 🧪 Run Tests
npm test              # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage report

# 🔍 Code Quality
npm run lint          # ESLint
npm run format        # Prettier
npm run type-check    # TypeScript

# 🚀 Production Build
npm run build         # Build for production
npm run start         # Start production server
```

---

## 🔮 **Roadmap**

- [ ] 🤖 AI-powered expense categorization
- [ ] 📱 Mobile app (React Native)
- [ ] 💳 Bank account integration
- [ ] 🌍 Multi-currency support
- [ ] 📊 Advanced budgeting tools
- [ ] 🔗 Third-party integrations

---

## 🤝 **Contributing**

We love contributors! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

```bash
# 🍴 Fork the repo
# 🔧 Create feature branch
git checkout -b feature/amazing-feature

# 💾 Commit changes
git commit -m "Add amazing feature"

# 📤 Push to branch
git push origin feature/amazing-feature

# 🎉 Open Pull Request
```

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Darshan](https://github.com/mailmeatdarshan)**

**A collaborative team project featuring:**
- **[Darshan](https://github.com/mailmeatdarshan)** - Lead Developer
- **[Muskan](https://github.com/muskan-username)** - Frontend Developer  
- **[Shakshi](https://github.com/shakshi-username)** - Backend Developer
- **[Shubham](https://github.com/shubham-username)** - Full Stack Developer

[⭐ Star this repo](https://github.com/your-username/finzio/stargazers) • [🐛 Report issues](https://github.com/your-username/finzio/issues) • [💡 Request features](https://github.com/your-username/finzio/issues/new)

[![GitHub stars](https://img.shields.io/github/stars/your-username/finzio?style=social)](https://github.com/your-username/finzio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/finzio?style=social)](https://github.com/your-username/finzio/network)
[![GitHub watchers](https://img.shields.io/github/watchers/your-username/finzio?style=social)](https://github.com/your-username/finzio/watchers)

</div>