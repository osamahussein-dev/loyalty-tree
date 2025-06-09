# LoyaltyTree - Environmental Loyalty Platform

A comprehensive loyalty platform that rewards users for environmental actions like tree planting with points that can be redeemed for vouchers from partner retailers.

## 🌟 Features

- **Tree Planting Tracking**: Upload photos and GPS coordinates of planted trees
- **Points System**: Earn points for approved environmental actions
- **Voucher Marketplace**: Redeem points for vouchers from partner retailers
- **My Vouchers**: Manage redeemed vouchers with unique codes and expiry tracking
- **Retailer Dashboard**: Create and manage voucher offerings
- **Real-time Updates**: Points and redemptions update instantly
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Material-UI + Redux Toolkit
- **Backend**: Node.js + Express + TypeScript + TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **File Upload**: Multer for image handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd loyalty-final-tree
```

### 2. Database Setup

#### Install PostgreSQL

1. Download and install PostgreSQL from the official website
2. During installation, remember the password you set for the `postgres` user
3. Make sure PostgreSQL service is running

#### Create Database

```bash
# Connect to PostgreSQL (you'll be prompted for password)
psql -U postgres

# Create the database
CREATE DATABASE loyalty_tree;

# Create a user (optional but recommended)
CREATE USER loyalty_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE loyalty_tree TO loyalty_user;

# Exit psql
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Environment Variables

Edit the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=loyalty_user
DB_PASSWORD=your_password
DB_DATABASE=loyalty_tree

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Run Database Migrations

```bash
# Run migrations to create tables
npm run migration:run

# Optional: Seed the database with sample data
npm run seed
```

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

The backend server will start on `http://localhost:3000`

### 4. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Register a new account or use the seeded data (if you ran the seed command)
3. Start using the application!

## 👥 Default User Accounts (if seeded)

After running the seed command, you can use these accounts:

### Customer Account

- **Email**: `customer@example.com`
- **Password**: `password123`
- **Role**: Customer
- **Points**: 1000

### Retailer Account

- **Email**: `retailer@example.com`
- **Password**: `password123`
- **Role**: Retailer

## 🗄️ Database Management

### Database Location

The PostgreSQL database is typically stored in:

- **Windows**: `C:\Program Files\PostgreSQL\<version>\data`
- **macOS**: `/usr/local/var/postgres`
- **Linux**: `/var/lib/postgresql/<version>/main`
- **WSL (Windows Subsystem for Linux)**: `/var/lib/postgresql/<version>/main`

#### WSL-Specific Information

If you're using WSL, your database is located at `/var/lib/postgresql/14/main` (or similar version number). You can access your WSL files from Windows File Explorer using:

**Windows Path**: `\\wsl$\Ubuntu\home\<your-username>\`

For example, if your username is `hannoun`, you can access your home directory at:
`\\wsl$\Ubuntu\home\hannoun\`

### Export Database

#### Full Database Export

```bash
# Export entire database
pg_dump -U loyalty_user -h localhost loyalty_tree > loyalty_tree_backup.sql

# Export with custom format (recommended for large databases)
pg_dump -U loyalty_user -h localhost -Fc loyalty_tree > loyalty_tree_backup.dump
```

#### WSL Database Export

If you're using WSL, you can export your database using these commands:

```bash
# Navigate to your home directory
cd ~

# Export using postgres user (recommended for WSL)
sudo -u postgres pg_dump loyalty_tree > loyalty_tree_backup.sql

# Export with custom format
sudo -u postgres pg_dump -Fc loyalty_tree > loyalty_tree_backup.dump

# Check the exported files
ls -la loyalty_tree_backup.*
```

**Access from Windows**: Your exported files will be available at:
`\\wsl$\Ubuntu\home\<your-username>\loyalty_tree_backup.sql`
`\\wsl$\Ubuntu\home\<your-username>\loyalty_tree_backup.dump`

For example: `\\wsl$\Ubuntu\home\hannoun\loyalty_tree_backup.sql`

#### Export Specific Tables

```bash
# Export only data (no schema)
pg_dump -U loyalty_user -h localhost --data-only loyalty_tree > loyalty_tree_data.sql

# Export only schema (no data)
pg_dump -U loyalty_user -h localhost --schema-only loyalty_tree > loyalty_tree_schema.sql

# Export specific tables
pg_dump -U loyalty_user -h localhost -t user -t voucher loyalty_tree > specific_tables.sql
```

### Import Database

```bash
# Import from SQL file
psql -U loyalty_user -h localhost loyalty_tree < loyalty_tree_backup.sql

# Import from custom format
pg_restore -U loyalty_user -h localhost -d loyalty_tree loyalty_tree_backup.dump
```

### Database Connection via GUI Tools

You can also use GUI tools to manage your database:

#### pgAdmin (Recommended)

1. Download from [pgAdmin website](https://www.pgadmin.org/)
2. Connect with these settings:
   - **Host**: localhost
   - **Port**: 5432
   - **Database**: loyalty_tree
   - **Username**: loyalty_user
   - **Password**: your_password

#### DBeaver (Alternative)

1. Download from [DBeaver website](https://dbeaver.io/)
2. Create new PostgreSQL connection with the same settings

## 📁 Project Structure

```
loyalty-final-tree/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Authentication, file upload
│   │   ├── migrations/      # Database migrations
│   │   ├── models/          # TypeORM entities
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Migration and seed scripts
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── uploads/             # Uploaded images
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── routes/          # React Router configuration
│   │   ├── store/           # Redux store and slices
│   │   ├── theme/           # Material-UI theme
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with auto-reload
npm run build        # Build for production
npm start           # Start production server
npm run migration:run    # Run database migrations
npm run migration:revert # Revert last migration
npm run seed        # Seed database with sample data
```

### Frontend Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Trees

- `GET /api/trees/my` - Get user's planted trees
- `POST /api/trees` - Upload new tree planting
- `PUT /api/trees/:id/approve` - Approve tree (admin only)
- `PUT /api/trees/:id/reject` - Reject tree (admin only)

### Vouchers

- `GET /api/vouchers` - Get available vouchers
- `POST /api/vouchers/redeem` - Redeem a voucher
- `GET /api/vouchers/my-redemptions` - Get user's redeemed vouchers

### Retailer

- `GET /api/vouchers/retailer` - Get retailer's vouchers
- `POST /api/vouchers/retailer` - Create new voucher
- `PUT /api/vouchers/retailer/:id` - Update voucher
- `DELETE /api/vouchers/retailer/:id` - Delete voucher
- `GET /api/vouchers/retailer/stats` - Get retailer statistics

## 🔒 Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=loyalty_user
DB_PASSWORD=your_password
DB_DATABASE=loyalty_tree

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Server
PORT=3000
NODE_ENV=development
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Make sure PostgreSQL is running and credentials are correct.

#### Migration Errors

```
Error: relation "table_name" already exists
```

**Solution**: Check if migrations were already run or reset the database.

#### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution**: Kill the process using the port or change the port in `.env`.

#### Frontend Build Errors

```
Module not found: Can't resolve...
```

**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install`.

### Reset Database

If you need to start fresh:

```bash
# Connect to PostgreSQL
psql -U postgres

# Drop and recreate database
DROP DATABASE loyalty_tree;
CREATE DATABASE loyalty_tree;
GRANT ALL PRIVILEGES ON DATABASE loyalty_tree TO loyalty_user;
\q

# Run migrations again
cd backend
npm run migration:run
npm run seed
```

## 📝 Development Notes

### Adding New Features

1. Backend: Add routes in `/routes`, controllers in `/controllers`, update models if needed
2. Frontend: Add pages in `/pages`, update routing in `/routes`, add Redux slices if needed
3. Database: Create migrations for schema changes

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m "Add feature"`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Look at existing issues in the repository
3. Create a new issue with detailed information about the problem
4. Include error messages, steps to reproduce, and your environment details

## 🔄 Updates and Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest versions (be careful)
npm install package-name@latest
```

### Database Maintenance

```bash
# Check database size
psql -U loyalty_user -c "SELECT pg_size_pretty(pg_database_size('loyalty_tree'));"

# Vacuum database (cleanup)
psql -U loyalty_user -c "VACUUM ANALYZE;" loyalty_tree
```

---

**Happy coding! 🌱**
