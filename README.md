# 🔒 Aman Anil Official Website 🌐

A modern, responsive website for showcasing cybersecurity and research services built with Next.js 15 and React 19. This platform highlights expertise in ethical hacking, penetration testing, CISO services, and cyber crime prevention through an interactive and secure user experience. The website combines cutting-edge web technologies with cybersecurity best practices to deliver a professional, high-performance digital presence.

## ✨ Key Features

- 📊 Professional portfolio showcasing cybersecurity expertise and projects with detailed case studies
- 🔍 Interactive service exploration with detailed breakdowns of methodologies, tools, and deliverables
- 🛡️ Secure contact forms with rate limiting, CSRF protection, input validation, and honeypot fields
- 📱 Responsive design optimized for all devices from mobile phones to large desktop displays
- ♿ Accessibility compliance with WCAG 2.1 AA standards including keyboard navigation and screen reader support
- ⚡ Performance-optimized with 90+ Lighthouse scores across all categories (Performance, Accessibility, Best Practices, SEO)
- 🖥️ Server-side rendering for improved SEO and initial page load performance
- 🔐 API rate limiting and security headers to prevent common web vulnerabilities

## 📋 Overview

This website serves as a professional platform for Aman Anil's cybersecurity and research services, featuring:

- 🔐 Cybersecurity and cyber crime prevention expertise including vulnerability assessments, threat modeling, and security architecture design
- 🛠️ Security solutions and consulting services for organizations of all sizes, from startups to enterprise-level corporations
- 🧪 AIDS research and security information with comprehensive resources and educational materials
- 🔍 Digital forensics services including incident response, malware analysis, and evidence collection
- 👨‍💼 Chief Information Security Officer (CISO) as a service with strategic security leadership
- 🧩 Penetration testing services across networks, applications, cloud infrastructure, and IoT devices
- 🎓 Security awareness training and phishing simulation programs
- 📝 Compliance assistance for frameworks including GDPR, HIPAA, PCI DSS, and ISO 27001
- 💻 Custom security tool development and implementation
- 📚 Blog section featuring in-depth articles on cybersecurity topics, research findings, and industry insights
- 🎯 Project showcase highlighting successful security implementations and case studies

## 🛠️ Detailed Tech Stack

- **Framework**: 🚀 Next.js 15.3.2 with App Router
  - 🖥️ Server-side rendering for improved SEO and performance
  - 🔄 API routes for backend functionality
  - 📁 App Router for file-based routing
  - ⚡ TurboPack for faster development builds
  - 🌐 Edge runtime support for global deployments
  - 🔄 Middleware support for request interception

- **UI Library**: ⚛️ React 19.0.0
  - 🪝 Latest React features including hooks, context API, and server components
  - ⚡ Fast rendering with improved concurrent mode
  - 🖥️ React Server Components for reduced client-side JavaScript
  - ⏳ Suspense for data fetching and loading states
  - 🌊 Streaming SSR for progressive rendering

- **Styling**: 🎨
  - 💨 TailwindCSS 4 for utility-first styling
  - 🎭 Custom CSS variables for theming
  - 📱 Responsive design for all device sizes
  - 🧩 CSS modules for component-scoped styling
  - 🔧 PostCSS plugins for advanced CSS features

- **3D Graphics**: 🎮
  - 🌐 Three.js for 3D rendering
  - ⚛️ React Three Fiber for React integration
  - 🧰 Drei utilities for common Three.js patterns
  - 🎨 GLSL shaders for custom visual effects
  - ⚡ Performance optimizations for complex scenes

- **Database**: 💾
  - 🍃 MongoDB for document storage
  - 🦔 Mongoose for schema validation and ODM
  - 🔄 Connection pooling for performance
  - 📊 Aggregation pipelines for complex queries
  - 🔍 Indexing strategies for query optimization
  - 🔒 Transaction support for data integrity

- **Authentication**: 🔑
  - 🎟️ JWT (JSON Web Tokens) for stateless authentication
  - 🔒 bcrypt for secure password hashing
  - 👥 Role-based access control
  - 🍪 Cookie-based token storage
  - 🔄 Refresh token rotation for enhanced security
  - 🛡️ CSRF protection mechanisms

- **Icons**: 🎨
  - 🔤 FontAwesome for general icons
  - ⚛️ React Icons for component-based icons
  - 🦸‍♂️ Heroicons for UI elements
  - 🎨 Custom SVG icons for unique elements
  - ⚡ Icon optimization techniques

- **Development**: 👨‍💻
  - 📝 TypeScript for type safety
  - 🧹 ESLint for code quality
  - 💻 VS Code configuration for consistent development
  - 🐶 Husky for Git hooks
  - ✨ Prettier for code formatting
  - ✅ Type-checking in CI/CD pipeline

- **Build Tool**: 🔨
  - 🚀 TurboPack for optimized builds
  - 🎨 PostCSS for CSS processing
  - 🔧 Webpack optimization techniques
  - 🌲 Tree shaking for smaller bundle size
  - 📦 Code splitting strategies

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js 20.x or later
- 📦 npm
- 🗄️ MongoDB instance (local or cloud-based)
- 📝 Git for version control

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/amananilofficial/amananilofficial.com.git
   cd amananilofficial.com
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with required environment variables:
   ```
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Run the development server:
   ```
   npm run dev
   ```
   
   The application will be available at http://localhost:3000