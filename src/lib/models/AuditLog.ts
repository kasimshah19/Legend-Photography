import mongoose from 'mongoose';

export interface IAuditLog {
  _id: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
  createdAt: Date;
}

const AuditLogSchema = new mongoose.Schema(
  {
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for faster queries
AuditLogSchema.index({ adminEmail: 1 });
AuditLogSchema.index({ resource: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
