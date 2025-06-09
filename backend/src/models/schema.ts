import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ default: 0 })
    points: number;

    @Column({ default: "user" })
    role: "user" | "retailer" | "admin";

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(() => TreePlanting, (treePlanting) => treePlanting.user)
    treePlantings: TreePlanting[];

    @OneToMany(() => VoucherRedemption, (redemption) => redemption.user)
    redemptions: VoucherRedemption[];
}

@Entity()
export class TreePlanting {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "image_url" })
    imageUrl: string;

    @Column({ default: "pending" })
    status: "pending" | "approved" | "rejected";

    @Column({ nullable: true, name: "rejection_reason" })
    rejectionReason: string;

    @ManyToOne(() => User, (user) => user.treePlantings)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "user_id" })
    userId: string;

    @Column({ type: "float", nullable: true })
    latitude: number;

    @Column({ type: "float", nullable: true })
    longitude: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}

@Entity()
export class Retailer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    logo: string;

    @OneToMany(() => Voucher, (voucher) => voucher.retailer, {
        cascade: ["update"]
    })
    vouchers: Voucher[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ name: "points_required" })
    pointsRequired: number;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "timestamp", name: "expiry_date" })
    expiryDate: Date;

    @Column({ nullable: true, name: "image_url" })
    imageUrl: string;

    @ManyToOne(() => Retailer, (retailer) => retailer.vouchers, {
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "retailer_id" })
    retailer: Retailer;

    @Column({ name: "retailer_id" })
    retailerId: string;

    @OneToMany(() => VoucherRedemption, (redemption) => redemption.voucher)
    redemptions: VoucherRedemption[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}

@Entity()
export class VoucherRedemption {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.redemptions)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "user_id" })
    userId: string;

    @ManyToOne(() => Voucher, (voucher) => voucher.redemptions)
    @JoinColumn({ name: "voucher_id" })
    voucher: Voucher;

    @Column({ name: "voucher_id" })
    voucherId: string;

    @Column({ default: "active" })
    status: "active" | "used" | "expired";

    @Column({ name: "points_spent" })
    pointsSpent: number;

    @Column({ name: "redemption_code", unique: true })
    redemptionCode: string;

    @Column({ type: "timestamp", name: "expires_at", nullable: true })
    expiresAt: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
