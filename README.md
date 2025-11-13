# 🚚 Delivery ETA Predictor

**AI-Powered Supply Chain Intelligence Platform**

An intelligent delivery prediction system that uses machine learning and historical data analysis to predict delivery delays, assess risk factors, and provide actionable mitigation strategies for supply chain management.

## 🌟 Features

### 📊 Real-Time Dashboard
- **Key Metrics**: Total orders, on-time delivery rate, average delays, at-risk orders
- **Active Alerts**: High-priority delivery risk notifications with recommended actions
- **Purchase Orders Table**: Comprehensive view of all orders with status and risk assessment
- **Supplier Performance**: Top suppliers ranked by performance score
- **Delay Trends**: Historical delay patterns and category-wise analysis

### 🤖 AI Prediction Engine
- Analyzes historical delay patterns by supplier and category
- Considers order volume, shipment mode, and distance
- Evaluates seasonality and market conditions
- Calculates delay probability with confidence scores
- Generates actionable mitigation strategies

### 🚨 Intelligent Alert System
- Proactive alerts for at-risk deliveries
- Severity-based prioritization (CRITICAL, HIGH, MEDIUM, LOW)
- Recommended actions for each alert
- Alert acknowledgment and resolution tracking

### 📈 Analytics & Insights
- Supplier performance metrics and trends
- Delay pattern identification
- Category-wise delay analysis
- On-time delivery rate tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Dark Mode**: next-themes
- **API**: RESTful endpoints with comprehensive error handling

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 12+
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/PrasadPaturi/delivery-eta-predictor.git
cd delivery-eta-predictor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/delivery_eta_predictor"
```

### 4. Set Up Database
```bash
# Create the database
createdb -h localhost delivery_eta_predictor

# Run Prisma migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Project Structure

```
delivery-eta-predictor/
├── app/
│   ├── api/
│   │   ├── alerts/          # Alert management endpoints
│   │   ├── predictions/     # ETA prediction endpoints
│   │   ├── purchase-orders/ # Purchase order endpoints
│   │   └── suppliers/       # Supplier data endpoints
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Dashboard page
├── components/
│   ├── dashboard/
│   │   ├── alerts-section.tsx        # Active alerts display
│   │   ├── delay-trends.tsx          # Delay analysis
│   │   ├── metrics-grid.tsx          # KPI metrics
│   │   ├── purchase-orders-table.tsx # Orders table
│   │   └── supplier-performance.tsx  # Supplier rankings
│   └── ui/                  # shadcn/ui components
├── lib/
│   └── db.ts               # Prisma client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding script
└── public/                 # Static assets
```

## 🗄️ Database Schema

### Core Models
- **PurchaseOrder**: Main order records with delivery tracking
- **Supplier**: Supplier information and performance metrics
- **ProductCategory**: Product categories with complexity levels
- **ETAPrediction**: AI-generated delivery predictions
- **DeliveryAlert**: Risk alerts for at-risk orders
- **DelayPattern**: Historical delay patterns and triggers
- **SupplierPerformance**: Monthly performance metrics
- **User**: User accounts with roles

## 🔌 API Endpoints

### Purchase Orders
- `GET /api/purchase-orders` - Fetch orders with filtering and pagination
- Query params: `page`, `limit`, `status`, `isDelayed`, `supplierId`

### Suppliers
- `GET /api/suppliers` - Get all suppliers with performance metrics

### Predictions
- `GET /api/predictions` - Fetch ETA predictions
- `POST /api/predictions` - Generate new prediction for a purchase order

### Alerts
- `GET /api/alerts` - Fetch delivery alerts with filtering
- `PATCH /api/alerts` - Acknowledge or resolve alerts
- Query params: `status`, `severity`, `alertType`

## 📊 Sample Data

The database is pre-populated with:
- **5 Suppliers** across different regions
- **5 Product Categories** with varying complexity
- **50 Historical Purchase Orders** with delivery data
- **3 Delay Patterns** based on various triggers
- **2 Open Purchase Orders** for testing predictions
- **ETA Predictions** with risk factors
- **Delivery Alerts** for at-risk orders

## 🧪 Testing the Application

1. **View Dashboard**: Navigate to the home page to see all metrics and alerts
2. **Check Predictions**: View predicted delivery dates and delay probabilities
3. **Monitor Alerts**: See active alerts with recommended mitigation actions
4. **Analyze Trends**: Review delay patterns and supplier performance

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run seed         # Seed database with sample data
npx prisma studio   # Open Prisma Studio

# Linting
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Run migrations: `npx prisma migrate deploy`
4. Start the server: `npm start`

## 📚 Documentation

### AI Prediction Logic
The prediction engine analyzes:
- Historical delay patterns by supplier and category
- Order volume thresholds
- Shipment modes and distances
- Seasonality and market conditions
- Supplier performance metrics
- Product complexity levels

### Risk Assessment
Risk factors include:
- Low supplier on-time delivery rate
- High product complexity
- Large order volumes
- Long shipment distances
- Seasonal demand peaks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Prasad Paturi**
- Email: paturi20@gmail.com
- GitHub: [@PrasadPaturi](https://github.com/PrasadPaturi)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Icons from [lucide-react](https://lucide.dev/)

## 📞 Support

For support, email paturi20@gmail.com or open an issue on GitHub.

---

**Made with ❤️ for supply chain intelligence**
