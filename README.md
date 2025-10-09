# Calo Dashboard Portal

A modern, responsive, and user-friendly Calo Dashboard Portal built with React.js, featuring a comprehensive dashboard, multi-language support, and dark/light theme toggle.

## 🚀 Features

### Core Features

- ✅ **Modern React Architecture**: Built with Vite + React.js (no TypeScript)
- ✅ **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- ✅ **Dark/Light Theme**: Smooth theme toggle with system preference detection
- ✅ **Multi-language Support**: English, Indonesian (Bahasa Indonesia), and Arabic
- ✅ **State Management**: Redux Toolkit for efficient state management
- ✅ **Data Visualization**: Chart.js integration for interactive charts and graphs
- ✅ **Authentication System**: Secure login with session management
- ✅ **Loading Animations**: Beautiful loading states and transitions

### UI/UX Features

- 🎨 **Modern Design**: Clean, minimalist corporate design
- 🌈 **Professional Color Scheme**: Blue primary colors with soft grays and accent colors
- 📱 **Mobile-First**: Optimized for mobile devices with collapsible sidebar
- 🔍 **Search Functionality**: Global search with filtering capabilities
- 🔔 **Notifications System**: Real-time notifications with badge indicators
- 📊 **Interactive Dashboard**: Statistics cards, charts, and activity feeds

### Navigation Structure

- **Administration**: Accounts, Roles, Highlights, Log Entries
- **Procedure**: SOPs, Instructions, Internal Memos, Minutes of Meetings
- **Standard Code**: Chart of Accounts, Locations, Items, Categories, etc.
- **Form & Report**: Forms and Reports management
- **Literature & Training**: Accounting Standards, IFRS, IFRIC, IAS

## 🛠 Technology Stack

- **Frontend Framework**: React.js 18+ with Vite
- **State Management**: Redux Toolkit
- **Styling**: SCSS with custom design system
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Internationalization**: react-i18next
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   cd calo-dashboard-report
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔐 Demo Credentials

Use these credentials to log into the demo:

- **Username**: `admin`
- **Password**: `password`

## 📁 Project Structure

```
calo-dashboard-report/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components (Button, Input, Card, etc.)
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   ├── forms/          # Form components
│   │   └── charts/         # Chart components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── administration/ # Admin pages
│   │   ├── procedure/      # Procedure pages
│   │   ├── standard-code/  # Standard code pages
│   │   ├── form-report/    # Form & report pages
│   │   └── literature/     # Literature pages
│   ├── store/              # Redux store
│   │   └── slices/         # Redux slices
│   ├── styles/             # SCSS styles
│   │   ├── components/     # Component styles
│   │   ├── pages/          # Page styles
│   │   └── themes/         # Theme styles
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── locales/            # Translation files
│   └── assets/             # Static assets
├── public/                 # Public assets
└── ...
```

## 🎨 Design System

### Colors

- **Primary**: Professional blue (#2563eb)
- **Secondary**: Soft gray (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Cyan (#06b6d4)

### Typography

- **Font Family**: Inter, Segoe UI, Roboto, sans-serif
- **Font Sizes**: 12px - 36px with responsive scaling
- **Font Weights**: 300 (Light) to 700 (Bold)

### Spacing

- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Border Radius

- **Small**: 6px
- **Medium**: 8px
- **Large**: 12px
- **Extra Large**: 16px

## 🌐 Multi-language Support

The application supports three languages:

- **English** (en) - Default
- **Indonesian** (id) - Bahasa Indonesia
- **Arabic** (ar) - العربية with RTL support

Language files are located in `src/locales/` and can be easily extended.

## 🎯 Key Components

### Authentication

- **LoginPage**: Modern login form with validation
- **Protected Routes**: Route guards for authenticated users
- **Session Management**: Automatic token handling

### Dashboard

- **Statistics Cards**: Key metrics with trend indicators
- **Interactive Charts**: Line, bar, and pie charts with theme support
- **Activity Feed**: Real-time activity updates
- **Quick Actions**: Shortcut buttons for common tasks

### Navigation

- **Collapsible Sidebar**: Multi-level menu with smooth animations
- **Responsive Header**: Search, notifications, theme toggle, language selector
- **Breadcrumbs**: Clear navigation path indication

### UI Components

- **Button**: Multiple variants (primary, secondary, ghost, etc.)
- **Input**: Form inputs with validation and icons
- **Card**: Flexible container component
- **Loading**: Various loading states and animations

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Features adaptive layouts, collapsible navigation, and touch-friendly interactions.

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Theme Configuration

Themes are configured in `src/styles/_variables.scss` with CSS custom properties for easy customization.

### Language Configuration

Add new languages by:

1. Creating translation file in `src/locales/`
2. Adding language to `supportedLanguages` in `languageSlice.js`
3. Updating i18n configuration

### Chart Configuration

Charts are configured in `src/components/charts/` with theme-aware defaults and responsive options.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**
