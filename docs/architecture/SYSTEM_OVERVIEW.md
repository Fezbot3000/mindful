# System Architecture Overview
## Mindful Track Application

### 📋 **Document Information**
- **Version**: 1.0
- **Last Updated**: 2025-01-14
- **Author**: Development Team
- **Status**: Initial Documentation

---

## 🏗️ **System Design**

### **Architecture Pattern**
- **Type**: Client-Side Single Page Application (SPA)
- **Framework**: Next.js 15 with App Router
- **Rendering**: Client-Side Rendering (CSR) with Static Generation
- **State Management**: React Context API + Local State

### **Core Technologies**
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Authentication**: Firebase Auth (Email/Password + Google OAuth)
- **Data Persistence**: Hybrid approach (IndexedDB + Firebase)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS + CSS Variables
- **PWA**: Service Worker + Web App Manifest + iOS optimization

---

## 🔄 **Data Flow Architecture**

### **Authentication Flow**
```
User Input → Firebase Auth → AuthContext → App State → UI Update
```

### **Data Persistence Flow**
```
User Action → Form Validation → IndexedDB Storage → Context Update → UI Refresh
```

### **State Management Flow**
```
Component → Context Provider → Local Storage/IndexedDB → Global State → Re-render
```

---

## 📱 **Progressive Web App (PWA) Architecture**

### **PWA Components**
- **Web App Manifest** (`/public/manifest.json`): App metadata, icons, and display configuration
- **Service Worker** (`/public/sw.js`): Offline functionality and caching strategies
- **iOS Optimization**: Safari-specific meta tags and icon sizes
- **Caching Strategy**: Multi-layered approach for optimal performance

### **Caching Layers**
1. **Static Cache**: App shell, icons, and core assets
2. **Dynamic Cache**: Pages and API responses
3. **Runtime Cache**: Images and user-generated content

### **Offline Support**
- **Core Features**: All tools (breathing, grounding, etc.) work offline
- **Data Sync**: IndexedDB provides local persistence
- **Background Sync**: Automatic sync when connection restored
- **Fallback Pages**: Cached versions for navigation

### **iOS Installation Flow**
```
Safari Visit → Add to Home Screen → App Icon Created → Full-Screen Launch
```

---

## 💾 **Data Layer Architecture**

### **Primary Storage: IndexedDB**
- **Database**: MindfulTrackDB (Version 3)
- **Stores**: 
  - `logs` - User activity logs with categories and intensity
  - `journal` - Detailed journal entries with metadata
- **Indexing**: Timestamp-based for efficient querying
- **Offline Support**: Full offline capability with local storage

### **Authentication: Firebase**
- **Provider**: Firebase Auth v10.12.2
- **Methods**: Email/Password, Google OAuth
- **Session Management**: Firebase handles token refresh
- **User State**: Managed through React Context

### **Data Models**
```typescript
// Log Entry
interface Log {
  id: number;
  category: LogCategory;
  intensity: number;
  description?: string;
  timestamp: Date;
}

// Journal Entry
interface JournalEntry {
  id: number;
  title: string;
  content: string;
  timestamp: Date;
  intensity?: number;
  trigger?: string;
  evidenceFor?: string;
  evidenceAgainst?: string;
  alternativeView?: string;
  schemaLink?: string;
}
```

---

## 🧩 **Component Architecture**

### **Layout Structure**
```
RootLayout
├── ThemeProvider
├── AuthProvider
└── App Content
    ├── SidebarProvider
    ├── LogsProvider
    └── Page Components
```

### **Component Hierarchy**
- **Atoms**: Button, Input, Label, Badge
- **Molecules**: FormField, Card, Dialog
- **Organisms**: Navigation, Forms, Charts
- **Templates**: Page layouts, Modal structures
- **Pages**: Dashboard, Journal, Insights, Tools, Settings

### **Context Providers**
- **AuthContext**: User authentication state
- **LogsContext**: Application data state
- **ThemeContext**: Dark/light mode preference
- **SidebarContext**: Navigation state

---

## 🔌 **Integration Points**

### **External Services**
- **Firebase Authentication**: User management
- **Browser APIs**: 
  - Web Speech API (voice recognition)
  - Web Audio API (breathing exercise music)
  - IndexedDB (data persistence)

### **Internal Integrations**
- **Data Layer**: IndexedDB ↔ React Context
- **Authentication**: Firebase ↔ App State
- **UI State**: Component State ↔ Global Context
- **Routing**: Next.js App Router ↔ Authentication State

---

## 📁 **File Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (app)/             # Main application pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── journal/          # Journal feature components
│   ├── insights/         # Insights feature components
│   └── tools/            # Mindfulness tools
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth.tsx         # Authentication logic
│   ├── data.ts          # Data persistence layer
│   ├── firebase.ts      # Firebase configuration
│   └── utils.ts         # General utilities
└── types/               # TypeScript definitions
```

---

## 🔐 **Security Architecture**

### **Authentication Security**
- Firebase handles secure token management
- Automatic token refresh
- Secure session persistence
- OAuth 2.0 compliance for Google sign-in

### **Data Security**
- Client-side data encryption through IndexedDB
- No sensitive data in localStorage
- Input validation using Zod schemas
- XSS prevention through React's built-in protections

### **Privacy Considerations**
- Data stored locally on user device
- No server-side data collection
- User controls data export/deletion
- Minimal external service dependencies

---

## 🚀 **Deployment Architecture**

### **Build Process**
- Next.js static generation
- TypeScript compilation
- Tailwind CSS processing
- Asset optimization

### **Hosting Strategy**
- Static site deployment capability
- CDN-friendly asset structure
- Environment-based configuration
- Progressive Web App support

---

## 📊 **Performance Considerations**

### **Current Implementation**
- Client-side rendering for dynamic content
- Component-based code splitting potential
- Local data storage for offline capability
- Minimal external dependencies

### **Optimization Opportunities**
- Implement dynamic imports for routes
- Add service worker for caching
- Optimize bundle splitting
- Implement image optimization

---

## 🔄 **Data Migration & Versioning**

### **Database Versioning**
- Current version: 3
- Upgrade path handling in `getDb()` function
- Backward compatibility maintained
- Migration scripts for schema changes

### **Application Versioning**
- Semantic versioning for releases
- Feature flag capability
- Graceful degradation for older browsers
- Progressive enhancement approach

---

## 🎯 **Future Architecture Considerations**

### **Scalability**
- Potential for server-side rendering
- Database migration to cloud storage
- Real-time synchronization capabilities
- Multi-device data sync

### **Extensibility**
- Plugin architecture for new tools
- API-first design for integrations
- Modular component system
- Theme and customization framework

---

## 📝 **Change Log**

### Version 1.0 (2025-01-14)
- Initial system architecture documentation
- Documented current implementation
- Identified integration points
- Outlined security and performance considerations 