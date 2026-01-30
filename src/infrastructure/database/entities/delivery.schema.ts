import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('deliveries')
export class DeliverySchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  transactionId: string;

  @Column({ type: 'varchar', length: 150, nullable: true, default: '' })
  @Index()
  customerEmail: string;

  @Column({ type: 'varchar', length: 30, nullable: true, default: '' })
  customerDocumentId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
