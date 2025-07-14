# Mindful Track
## A Personal Mental Health Tracking Application

### 📋 **Overview**
Mindful Track is a personal mental health tracking application designed to help users build self-awareness through logging thoughts, feelings, and experiences. Built with Next.js 15 and featuring a clean, ADHD-friendly interface with dark mode support.

### ✨ **Core Features**
- **🔐 Secure Authentication**: Email/password and Google OAuth via Firebase Auth
- **📊 Dashboard**: Clean interface with motivational quotes and quick stats
- **⚡ Quick Logging**: Prominent button for categorizing experiences with intensity ratings
- **📝 Journal Entries**: Dedicated space for deeper reflection with guided prompts
- **📈 Insights & Analytics**: Pattern recognition and data visualization
- **🧘 Mindfulness Tools**: Guided breathing exercises and wellness tools
- **🌙 Accessibility**: Dark mode toggle and ADHD accommodations

### 🏗️ **Architecture**
- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Firebase Auth
- **Data Storage**: IndexedDB for offline-first functionality
- **State Management**: React Context API

### 🚀 **Quick Start**

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (optional for full functionality)

#### Installation
```bash
# Clone the repository
git clone [repository-url]
cd mindful

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env.local
# Add your Firebase configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:9002`

#### Build for Production
```bash
npm run build
npm start
```

### 🎨 **Design System**
- **Primary Color**: Soft blue (#64B5F6) for calmness
- **Background**: Very light blue (#E3F2FD) for clean backdrop  
- **Accent**: Pale green (#A5D6A7) for subtle contrast
- **Typography**: Inter font family for clear readability
- **Responsive**: Mobile-first design with touch-optimized interactions

### 📁 **Project Structure**
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (app)/             # Main application pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── dashboard/        # Dashboard components
│   ├── journal/          # Journal feature components
│   ├── insights/         # Analytics components
│   └── tools/            # Mindfulness tools
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth.tsx         # Authentication logic
│   ├── data.ts          # Data persistence layer
│   └── firebase.ts      # Firebase configuration
└── types/               # TypeScript definitions
```

### 🔧 **Development**

#### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

#### Development Guidelines
- Follow the Development Rules v2.4 framework
- Use semantic commit messages
- Implement mobile-first responsive design
- Maintain accessibility standards (WCAG 2.1 AA)
- Write comprehensive documentation

### 📚 **Documentation**
- [System Architecture](docs/architecture/SYSTEM_OVERVIEW.md)
- [Design System](docs/design/DESIGN_SYSTEM.md)
- [Feature Documentation](docs/features/)
- [Technical Debt Tracking](docs/maintenance/TECHNICAL_DEBT_AND_BUGS.md)
- [Development Metrics](docs/maintenance/METRICS.md)

### 🛡️ **Privacy & Security**
- Data stored locally on user's device via IndexedDB
- No server-side data collection or storage
- User controls data export and deletion
- Firebase Auth handles secure authentication
- Input validation and XSS prevention

### 🌐 **Browser Support**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### 📈 **Performance Targets**
- Google PageSpeed Performance: 90+
- SEO Score: 100%
- Accessibility Score: 95+
- Core Web Vitals compliance

### 🤝 **Contributing**
1. Follow Development Rules v2.4 framework
2. Create feature branches from main
3. Write comprehensive documentation
4. Ensure accessibility compliance
5. Test across supported browsers
6. Submit pull requests with detailed descriptions

### 📄 **License**
[License Type] - See LICENSE file for details

### 🆘 **Support**
For issues, questions, or contributions, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️ for mental health awareness and self-care**
