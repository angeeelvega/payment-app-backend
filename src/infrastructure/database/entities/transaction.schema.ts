import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('transactions')
export class TransactionSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  transactionNumber: string;

  @Column({ type: 'varchar', length: 150, nullable: true, default: '' })
  @Index()
  customerEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  customerFirstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  customerLastName: string;

  @Column({ type: 'text', nullable: true, default: '' })
  customerAddress: string;

  @Column({ type: 'varchar', length: 30, nullable: true, default: '' })
  customerDocumentId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: 'N/A' })
  customerCity: string;

  @Column({ type: 'uuid' })
  @Index()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  productAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  baseFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentTransactionId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  statusMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
