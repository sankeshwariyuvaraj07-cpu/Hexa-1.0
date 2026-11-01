export type UserRole = 'student' | 'instructor' | 'technician' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  institutionId: string;
  studentIdOrEmployeeId: string;
  avatarUrl?: string;
  safetyTrainingVerified: boolean;
  trainingExpiresAt?: string;
  totalBookingsCompleted: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  institutionId: string;
  headOfDepartment: string;
  totalLabs: number;
  totalEquipment: number;
}

export interface Laboratory {
  id: string;
  name: string;
  code: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  buildingName: string;
  floor: string;
  roomNumber: string;
  description: string;
  capacity: number;
  openingDays: string[];
  operatingHours: {
    start: string; // e.g. "08:30"
    end: string;   // e.g. "17:30"
  };
  bookingDurationLimits: {
    minHours: number;
    maxHours: number;
  };
  bufferMinutesBetweenReservations: number;
  eligibleStudentGroups: string[];
  safetyRequirements: string[];
  trainingRequired: string;
  supervisionRequired: boolean;
  approvalRequired: boolean;
  usageRestrictions: string;
  labManagerId: string;
  labManagerName: string;
  isPublished: boolean;
  isAvailable: boolean;
  photoUrl: string;
}

export type EquipmentCategory =
  | 'Oscilloscope'
  | 'Function Generator'
  | 'Digital Multimeter'
  | 'Power Supply'
  | 'Trainer Kit'
  | 'Development Board'
  | 'Sensor & Transducer'
  | '3D Printer'
  | 'Fabrication Tool'
  | 'Computer Workstation'
  | 'Communication Tester'
  | 'Other';

export interface InventoryUnit {
  id: string;
  equipmentId: string;
  serialNumber: string;
  unitCode: string; // e.g., "OSC-ECE-001"
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  status: 'available' | 'reserved' | 'checked_out' | 'in_maintenance';
  currentBorrowerId?: string;
  currentBookingId?: string;
  storageLocation: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  model: string;
  manufacturer: string;
  description: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  laboratoryId: string;
  laboratoryName: string;
  inventoryCode: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  checkedOutQuantity: number;
  maintenanceQuantity: number;
  minBookingDurationHours: number;
  maxBookingDurationHours: number;
  eligibilityRequirement: string;
  trainingRequirement: string;
  requiresSupervision: boolean;
  requiresInstructorApproval: boolean;
  currentCondition: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  isUnderMaintenance: boolean;
  depositAmount: number;
  responsibleStaffName: string;
  isPublished: boolean;
  photoUrl: string;
  accessoriesIncluded: string[];
  units: InventoryUnit[];
}

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'waitlisted'
  | 'checked_out'
  | 'return_pending_inspection'
  | 'completed'
  | 'cancelled'
  | 'overdue'
  | 'under_review';

export interface FairSharePriority {
  score: number; // 0 to 100
  recentUsageFactor: number; // 50%
  waitingTimeFactor: number; // 30%
  bookingNeedFactor: number; // 20%
  explanation: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'equipment' | 'laboratory';
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  departmentId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  durationHours: number;
  requestedQuantity: number;
  purpose: string;
  additionalNotes?: string;
  status: BookingStatus;
  allocatedUnitIds?: string[];
  priority: FairSharePriority;
  waitlistPosition?: number;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  checkInRecordId?: string;
  returnRecordId?: string;
  incidentFlagged?: boolean;
}

export interface CheckInOutRecord {
  id: string;
  bookingId: string;
  resourceId: string;
  resourceName: string;
  unitIds: string[];
  type: 'handover' | 'return';
  timestamp: string;
  performedBy: string; // Staff member name
  borrowerName: string;
  conditionRating: 1 | 2 | 3 | 4 | 5; // 5 = Pristine, 1 = Damaged
  conditionNotes: string;
  accessoriesChecked: { name: string; present: boolean }[];
  existingDefects?: string;
  photoProofUrl?: string;
  discrepancyReported?: boolean;
}

export interface ConditionReport {
  id: string;
  bookingId: string;
  resourceId: string;
  initialCheckIn: CheckInOutRecord;
  returnCheckIn?: CheckInOutRecord;
  hasDiscrepancy: boolean;
  investigationStatus?: 'none' | 'pending_investigation' | 'cleared' | 'incident_escalated';
  investigatorNotes?: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  unitIds: string[];
  taskDescription: string;
  assignedStaff: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  findings?: string;
  actionsTaken?: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  ticketNumber: string;
  category:
    | 'Damaged Equipment'
    | 'Missing Components'
    | 'Late Return'
    | 'Safety Concern'
    | 'Unauthorized Usage'
    | 'Scheduling Conflict'
    | 'Equipment Malfunction';
  resourceId: string;
  resourceName: string;
  bookingId?: string;
  reporterName: string;
  reporterRole: UserRole;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'Reported' | 'Under Review' | 'Awaiting Information' | 'Resolved' | 'Closed';
  assignedReviewer: string;
  reviewerNotes?: string;
  resolutionTimestamp?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'Laboratory' | 'Equipment' | 'Booking' | 'Maintenance' | 'Incident' | 'User';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface ProjectKitBundle {
  id: string;
  title: string;
  category: string;
  targetCourse: string;
  description: string;
  equipmentIds: string[];
  equipmentNames: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  sensorModules: string[];
  schematicAvailable: boolean;
  popularity: number;
  iconName: string;
}

export interface StudentSafetyModule {
  id: string;
  title: string;
  description: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  status: 'passed' | 'pending' | 'expired';
  score?: number;
  completedAt?: string;
  unlocks: string[];
}

export interface SensorPinoutGuide {
  id: string;
  sensorName: string;
  equipmentId: string;
  operatingVoltage: string;
  communicationBus: string;
  pinout: { pin: string; function: string; note: string }[];
  sampleSnippet: string;
  precautions: string[];
}
