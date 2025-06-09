import { AppDataSource } from "../config/database";
import { User } from "../models/schema";
import { Retailer } from "../models/schema";
import { Voucher } from "../models/schema";
import * as bcrypt from "bcryptjs";

const seedData = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Seeding database...");

        // Create admin user
        const adminUser = new User();
        adminUser.email = "admin@loyaltytree.com";
        adminUser.password = await bcrypt.hash("admin123", 10);
        adminUser.name = "Admin User";
        adminUser.role = "admin";
        await AppDataSource.manager.save(adminUser);

        // Create sample retailers
        const retailers = [
            {
                name: "Green Coffee",
                email: "contact@greencoffee.com",
                password: await bcrypt.hash("retailer123", 10),
                description: "Eco-friendly coffee shop chain"
            },
            {
                name: "Nature's Basket",
                email: "info@naturesbasket.com",
                password: await bcrypt.hash("retailer123", 10),
                description: "Organic grocery store"
            }
        ];

        for (const retailerData of retailers) {
            const retailer = new Retailer();
            Object.assign(retailer, retailerData);
            await AppDataSource.manager.save(retailer);

            // Create sample vouchers for each retailer
            const vouchers = [
                {
                    title: `${retailerData.name} - 10% Off`,
                    description: "Get 10% off on your next purchase",
                    pointsRequired: 500,
                    quantity: 100,
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    retailerId: retailer.id
                },
                {
                    title: `${retailerData.name} - Free Item`,
                    description: "Get a free item with any purchase",
                    pointsRequired: 1000,
                    quantity: 50,
                    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
                    retailerId: retailer.id
                }
            ];

            for (const voucherData of vouchers) {
                const voucher = new Voucher();
                Object.assign(voucher, voucherData);
                await AppDataSource.manager.save(voucher);
            }
        }

        console.log("Database seeded successfully");
        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(1);
    }
};

seedData(); 