import {
  Booking,
  CheckInOutRecord,
  ConditionReport,
  Department,
  Equipment,
  FairSharePriority,
  Incident,
  InventoryUnit,
  Laboratory,
  MaintenanceRecord,
  NotificationItem,
  AuditLog,
  UserProfile,
  UserRole,
  ProjectKitBundle,
  StudentSafetyModule,
  SensorPinoutGuide,
} from '../types';
import {
  saveBookingToSupabase,
  cancelBookingInSupabase,
  fetchBookingsFromSupabase,
  testSupabaseConnection,
  syncAllBookingsToSupabase,
  SupabaseSyncState,
} from './supabase';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-std-1',
    name: 'Sankeshwari Yuvaraj',
    email: 'sankeshwariyuvaraj07@gmail.com',
    role: 'student',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication Engineering',
    institutionId: 'inst-jce',
    studentIdOrEmployeeId: '2JI21EC089',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    safetyTrainingVerified: true,
    trainingExpiresAt: '2027-06-30',
    totalBookingsCompleted: 14,
  },
  {
    id: 'user-inst-1',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@jce.ac.in',
    role: 'instructor',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication Engineering',
    institutionId: 'inst-jce',
    studentIdOrEmployeeId: 'FAC-ECE-402',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    safetyTrainingVerified: true,
    totalBookingsCompleted: 45,
  },
  {
    id: 'user-tech-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@jce.ac.in',
    role: 'technician',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication Engineering',
    institutionId: 'inst-jce',
    studentIdOrEmployeeId: 'TECH-ECE-105',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    safetyTrainingVerified: true,
    totalBookingsCompleted: 120,
  },
  {
    id: 'user-mgr-1',
    name: 'Dr. Meera Nambiar',
    email: 'meera.nambiar@jce.ac.in',
    role: 'manager',
    departmentId: 'dept-ece',
    departmentName: 'Dean of Academic Resources & Facilities',
    institutionId: 'inst-jce',
    studentIdOrEmployeeId: 'ADM-DEAN-001',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    safetyTrainingVerified: true,
    totalBookingsCompleted: 210,
  },
  {
    id: 'user-adm-1',
    name: 'Prof. Vikram Joshi',
    email: 'admin.joshi@jce.ac.in',
    role: 'admin',
    departmentId: 'dept-central',
    departmentName: 'Campus Infrastructure & Systems',
    institutionId: 'inst-jce',
    studentIdOrEmployeeId: 'SYS-ADMIN-99',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    safetyTrainingVerified: true,
    totalBookingsCompleted: 350,
  },
];

export const DEMO_DEPARTMENTS: Department[] = [
  {
    id: 'dept-ece',
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    institutionId: 'inst-jce',
    headOfDepartment: 'Dr. Ramesh Sundaram',
    totalLabs: 5,
    totalEquipment: 58,
  },
  {
    id: 'dept-cse',
    name: 'Computer Science and Engineering',
    code: 'CSE',
    institutionId: 'inst-jce',
    headOfDepartment: 'Dr. Ananya Roy',
    totalLabs: 4,
    totalEquipment: 62,
  },
  {
    id: 'dept-me',
    name: 'Mechanical Engineering',
    code: 'ME',
    institutionId: 'inst-jce',
    headOfDepartment: 'Dr. Balaji Govind',
    totalLabs: 3,
    totalEquipment: 25,
  },
];

export const INITIAL_LABORATORIES: Laboratory[] = [
  {
    id: 'lab-analog',
    name: 'Analog Electronics Laboratory',
    code: 'ECE-LAB-101',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    buildingName: 'Sir C.V. Raman Science Block',
    floor: '1st Floor',
    roomNumber: 'R-104',
    description: 'Equipped with precision signal generators, dual-channel oscilloscopes, and OP-AMP test stations for circuit design & simulation verification.',
    capacity: 35,
    openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    operatingHours: { start: '08:30', end: '17:30' },
    bookingDurationLimits: { minHours: 1, maxHours: 4 },
    bufferMinutesBetweenReservations: 15,
    eligibleStudentGroups: ['ECE 2nd-4th Year', 'EEE All Semesters', 'Research Scholars'],
    safetyRequirements: ['ESD Wristband mandatory', 'Safety goggles during soldering', 'No liquids at bench'],
    trainingRequired: 'Basic Electronics Lab Safety Level 1',
    supervisionRequired: true,
    approvalRequired: true,
    usageRestrictions: 'No high-voltage experimentation without direct instructor supervision.',
    labManagerId: 'user-inst-1',
    labManagerName: 'Dr. Aris Thorne',
    isPublished: true,
    isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lab-embedded',
    name: 'Embedded Systems & IoT Laboratory',
    code: 'ECE-LAB-203',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    buildingName: 'Sir C.V. Raman Science Block',
    floor: '2nd Floor',
    roomNumber: 'R-210',
    description: 'Hardware prototyping facility with ARM Cortex boards, Arduino kits, Raspberry Pi microcomputers, logic analyzers, and wireless sensor nodes.',
    capacity: 30,
    openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    operatingHours: { start: '09:00', end: '18:00' },
    bookingDurationLimits: { minHours: 1, maxHours: 5 },
    bufferMinutesBetweenReservations: 20,
    eligibleStudentGroups: ['ECE 3rd-4th Year', 'CSE IoT Specialization'],
    safetyRequirements: ['Grounding required', 'Static shield usage'],
    trainingRequired: 'Embedded Systems Workshop Completion',
    supervisionRequired: false,
    approvalRequired: true,
    usageRestrictions: 'Sensor shields must be inventoried before checkout.',
    labManagerId: 'user-inst-1',
    labManagerName: 'Dr. Aris Thorne',
    isPublished: true,
    isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lab-digital',
    name: 'Digital Electronics & Logic Design Lab',
    code: 'ECE-LAB-102',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    buildingName: 'Sir C.V. Raman Science Block',
    floor: '1st Floor',
    roomNumber: 'R-106',
    description: 'Modern trainer kits, FPGA development boards, digital IC testers, and logic state analyzers for digital logic experimentation.',
    capacity: 40,
    openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    operatingHours: { start: '08:30', end: '17:00' },
    bookingDurationLimits: { minHours: 1, maxHours: 3 },
    bufferMinutesBetweenReservations: 15,
    eligibleStudentGroups: ['ECE All Semesters', 'CSE 2nd Year'],
    safetyRequirements: ['ESD Mat compliance', 'Power supply limit 5V'],
    trainingRequired: 'Logic Safety Module',
    supervisionRequired: true,
    approvalRequired: true,
    usageRestrictions: 'Do not overload TTL circuit rails beyond 5.25V.',
    labManagerId: 'user-inst-1',
    labManagerName: 'Dr. Aris Thorne',
    isPublished: true,
    isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lab-comm',
    name: 'Communication Systems Laboratory',
    code: 'ECE-LAB-301',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    buildingName: 'Sir C.V. Raman Science Block',
    floor: '3rd Floor',
    roomNumber: 'R-302',
    description: 'Equipped with RF spectrum analyzers, microwave benches, SDR transceivers, fiber optic links, and modulation training rigs.',
    capacity: 25,
    openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    operatingHours: { start: '09:00', end: '16:30' },
    bookingDurationLimits: { minHours: 2, maxHours: 4 },
    bufferMinutesBetweenReservations: 30,
    eligibleStudentGroups: ['ECE 3rd-4th Year', 'Telecom Masters'],
    safetyRequirements: ['RF Emission safety limits', 'Fiber termination handling'],
    trainingRequired: 'RF & High-Frequency Safety Training',
    supervisionRequired: true,
    approvalRequired: true,
    usageRestrictions: 'High-power RF transmission requires explicit faculty clearance.',
    labManagerId: 'user-inst-1',
    labManagerName: 'Dr. Aris Thorne',
    isPublished: true,
    isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lab-vlsi',
    name: 'VLSI & Microelectronics Design Center',
    code: 'ECE-LAB-305',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    buildingName: 'Sir C.V. Raman Science Block',
    floor: '3rd Floor',
    roomNumber: 'R-315',
    description: 'Clean CAD workstations equipped with Cadence, Synopsys, and Xilinx Vivado for chip tape-out simulation and ASIC design.',
    capacity: 28,
    openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    operatingHours: { start: '08:00', end: '20:00' },
    bookingDurationLimits: { minHours: 1, maxHours: 6 },
    bufferMinutesBetweenReservations: 10,
    eligibleStudentGroups: ['ECE Final Year', 'VLSI Postgraduates'],
    safetyRequirements: ['Cleanroom shoe covers', 'No food/drinks'],
    trainingRequired: 'EDA Tool License & Cleanroom Etiquette',
    supervisionRequired: false,
    approvalRequired: true,
    usageRestrictions: 'Do not distribute foundry PDK libraries outside workstation subnet.',
    labManagerId: 'user-inst-1',
    labManagerName: 'Dr. Aris Thorne',
    isPublished: true,
    isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lab-prog',
    name: 'Advanced Programming & AI Laboratory',
    code: 'CSE-LAB-401',
    institutionId: 'inst-abc',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science',
    buildingName: 'Alan Turing Computing Center',
    floor: '4th Floor',
    roomNumber: 'C-401',
    description: 'GPU compute clusters with NVIDIA RTX workstations for deep learning model training, algorithm development, and competitive coding.',
    capacity: 50,
    openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    operatingHours: { start: '08:00', end: '21:00' },
    bookingDurationLimits: { minHours: 1, maxHours: 4 },
    bufferMinutesBetweenReservations: 10,
    eligibleStudentGroups: ['All Engineering Students'],
    safetyRequirements: ['Standard computer lab guidelines'],
    trainingRequired: 'Basic IT Ethics',
    supervisionRequired: false,
    approvalRequired: false,
    usageRestrictions: 'No unauthorized cryptocurrency mining or external torrenting.',
    labManagerId: 'user-inst-1',
    labManagerName: 'Dr. Ananya Roy',
    isPublished: true,
    isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lab-fab',
    name: 'Precision Manufacturing & Rapid Prototyping Workshop',
    code: 'ME-FAB-101',
    institutionId: 'inst-abc',
    departmentId: 'dept-me',
    departmentName: 'Mechanical Engineering',
    buildingName: 'Workshop Complex B',
    floor: 'Ground Floor',
    roomNumber: 'W-002',
    description: 'Equipped with industrial FDM & SLA 3D printers, CNC milling units, laser cutters, and mechanical measurement tools.',
    capacity: 20,
    openingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    operatingHours: { start: '09:00', end: '16:00' },
    bookingDurationLimits: { minHours: 2, maxHours: 6 },
    bufferMinutesBetweenReservations: 30,
    eligibleStudentGroups: ['ME Students', 'Robotics Club Members', 'Capstone Project Teams'],
    safetyRequirements: ['Steel-toe boots', 'Safety glasses', 'Hair tied back', 'No loose garments'],
    trainingRequired: 'Machine Shop Safety & 3D Slicing Certification',
    supervisionRequired: true,
    approvalRequired: true,
    usageRestrictions: 'Machine operation strictly restricted to certified operators under technician presence.',
    labManagerId: 'user-tech-1',
    labManagerName: 'Rajesh Kumar',
    isPublished: true,
    isAvailable: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
  },
];

// Helper to generate realistic inventory units
function generateUnits(
  equipmentId: string,
  prefix: string,
  total: number,
  availableCount: number,
  reservedCount: number,
  checkedOutCount: number,
  maintenanceCount: number
): InventoryUnit[] {
  const units: InventoryUnit[] = [];
  let currentIdx = 1;

  for (let i = 0; i < availableCount; i++) {
    units.push({
      id: `${equipmentId}-unit-${currentIdx}`,
      equipmentId,
      serialNumber: `SN-${prefix}-${String(currentIdx).padStart(4, '0')}`,
      unitCode: `${prefix}-${String(currentIdx).padStart(3, '0')}`,
      condition: 'Excellent',
      status: 'available',
      storageLocation: 'Shelf A-2, Bin 1',
    });
    currentIdx++;
  }

  for (let i = 0; i < reservedCount; i++) {
    units.push({
      id: `${equipmentId}-unit-${currentIdx}`,
      equipmentId,
      serialNumber: `SN-${prefix}-${String(currentIdx).padStart(4, '0')}`,
      unitCode: `${prefix}-${String(currentIdx).padStart(3, '0')}`,
      condition: 'Good',
      status: 'reserved',
      storageLocation: 'Staging Cart #1',
    });
    currentIdx++;
  }

  for (let i = 0; i < checkedOutCount; i++) {
    units.push({
      id: `${equipmentId}-unit-${currentIdx}`,
      equipmentId,
      serialNumber: `SN-${prefix}-${String(currentIdx).padStart(4, '0')}`,
      unitCode: `${prefix}-${String(currentIdx).padStart(3, '0')}`,
      condition: 'Good',
      status: 'checked_out',
      currentBorrowerId: 'user-std-1',
      storageLocation: 'Active Handover Bench',
    });
    currentIdx++;
  }

  for (let i = 0; i < maintenanceCount; i++) {
    units.push({
      id: `${equipmentId}-unit-${currentIdx}`,
      equipmentId,
      serialNumber: `SN-${prefix}-${String(currentIdx).padStart(4, '0')}`,
      unitCode: `${prefix}-${String(currentIdx).padStart(3, '0')}`,
      condition: 'Needs Attention',
      status: 'in_maintenance',
      storageLocation: 'Calibration & Repair Bay B',
    });
    currentIdx++;
  }

  return units;
}

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-arduino',
    name: 'Arduino Uno R3 Development Kit',
    category: 'Development Board',
    model: 'Uno R3 SMD Edition with Sensor Starter Pack',
    manufacturer: 'Arduino Official',
    description: 'Comprehensive kit including Arduino Uno microcontroller board, breadboard, 30+ jumper wires, LEDs, ultrasonic sensors, servo motor, and USB cable.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'ARD-EMB-100',
    totalQuantity: 10,
    availableQuantity: 3,
    reservedQuantity: 4,
    checkedOutQuantity: 2,
    maintenanceQuantity: 1,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'Verified Institutional Students (ECE/CSE/EEE)',
    trainingRequirement: 'Embedded Systems Workshop Level 1',
    requiresSupervision: false,
    requiresInstructorApproval: true,
    currentCondition: 'Good',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['USB Type-B Cable', '400-Point Breadboard', 'Ultrasonic Sensor HC-SR04', 'Component Storage Box'],
    units: generateUnits('eq-arduino', 'ARD-EMB', 10, 3, 4, 2, 1),
  },
  {
    id: 'eq-osc',
    name: 'Digital Storage Oscilloscope 100MHz Dual-Channel',
    category: 'Oscilloscope',
    model: 'DSO-1102X 100MHz 1GSa/s',
    manufacturer: 'Keysight / Siglent',
    description: 'High-precision 2-channel bench oscilloscope with color TFT display, auto-measurement suite, FFT spectrum analysis, and USB data logging.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-analog',
    laboratoryName: 'Analog Electronics Laboratory',
    inventoryCode: 'OSC-ANA-200',
    totalQuantity: 5,
    availableQuantity: 2,
    reservedQuantity: 2,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'ECE 2nd-4th Year Students & Researchers',
    trainingRequirement: 'Basic Analog Instrumentation Safety',
    requiresSupervision: true,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['2x 100MHz Passive Probes (1X/10X)', 'Ground Leads', 'Power Cable', 'Probe Calibration Tool'],
    units: generateUnits('eq-osc', 'OSC-ANA', 5, 2, 2, 1, 0),
  },
  {
    id: 'eq-fgen',
    name: 'Arbitrary Function Generator 25MHz',
    category: 'Function Generator',
    model: 'FG-2025 Arbitrary / DDS',
    manufacturer: 'Tektronix',
    description: 'Dual channel DDS arbitrary waveform generator providing sine, square, ramp, pulse, and noise signals up to 25MHz with arbitrary waveform playback.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-analog',
    laboratoryName: 'Analog Electronics Laboratory',
    inventoryCode: 'FGN-ANA-300',
    totalQuantity: 5,
    availableQuantity: 3,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'All ECE / Electrical Students',
    trainingRequirement: 'Signal Generator Operation Briefing',
    requiresSupervision: false,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['2x BNC-to-Alligator Cables', 'BNC-to-BNC Cable', 'Power Cord'],
    units: generateUnits('eq-fgen', 'FGN-ANA', 5, 3, 1, 1, 0),
  },
  {
    id: 'eq-dmm',
    name: 'True RMS Digital Bench Multimeter 4.5 Digits',
    category: 'Digital Multimeter',
    model: 'DMM-3440 True RMS',
    manufacturer: 'Fluke / Agilent',
    description: 'Precision bench multimeter with dual display, resistance measurement up to 100MΩ, capacitance, frequency, and temperature probe support.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-analog',
    laboratoryName: 'Analog Electronics Laboratory',
    inventoryCode: 'DMM-ANA-400',
    totalQuantity: 10,
    availableQuantity: 6,
    reservedQuantity: 2,
    checkedOutQuantity: 1,
    maintenanceQuantity: 1,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'All Verified Engineering Students',
    trainingRequirement: 'General Multimeter Probe Safety',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Good',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Safety Shrouded Test Leads (Red/Black)', 'Alligator Clips', 'Thermocouple Probe'],
    units: generateUnits('eq-dmm', 'DMM-ANA', 10, 6, 2, 1, 1),
  },
  {
    id: 'eq-psu',
    name: 'Triple Output Regulated DC Power Supply (0-30V / 3A)',
    category: 'Power Supply',
    model: 'PS-3030 Triple Rail Linear',
    manufacturer: 'GW Instek',
    description: 'Dual adjustable 0-30V/3A DC outputs plus fixed 5V/3A auxiliary output. Overvoltage and current limit protection with digital LED readouts.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-digital',
    laboratoryName: 'Digital Electronics & Logic Design Lab',
    inventoryCode: 'PSU-DIG-500',
    totalQuantity: 8,
    availableQuantity: 4,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'ECE & CSE Hardware Lab Students',
    trainingRequirement: 'Power Supply Polarity & Short-Circuit Safety',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Banana to Alligator Cables (Red/Black)', 'Ground Wire', 'AC Mains Cable'],
    units: generateUnits('eq-psu', 'PSU-DIG', 8, 4, 2, 2, 0),
  },
  {
    id: 'eq-digital-trainer',
    name: 'Digital Logic & Circuit Trainer Kit',
    category: 'Trainer Kit',
    model: 'DLT-8000 Modular System',
    manufacturer: 'Scientech',
    description: 'Comprehensive digital training system featuring variable clocks, 8 logic switches, 8 LED indicators, 7-segment displays, and integrated solderless breadboard.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-digital',
    laboratoryName: 'Digital Electronics & Logic Design Lab',
    inventoryCode: 'TRN-DIG-600',
    totalQuantity: 5,
    availableQuantity: 3,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 3,
    eligibilityRequirement: 'ECE 2nd Year, CSE 2nd Year',
    trainingRequirement: 'Logic Safety Module',
    requiresSupervision: true,
    requiresInstructorApproval: true,
    currentCondition: 'Good',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Patch cords (50 pcs)', 'IC Extractor', 'Power Adapter'],
    units: generateUnits('eq-digital-trainer', 'TRN-DIG', 5, 3, 1, 1, 0),
  },
  {
    id: 'eq-analog-trainer',
    name: 'Analog Integrated Circuit Trainer Station',
    category: 'Trainer Kit',
    model: 'ACT-4000 Linear Workstation',
    manufacturer: 'Scientech',
    description: 'Analog circuits experimentation kit with built-in dual DC power supply, AC signal source, potentiometer banks, and OP-AMP test sockets.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-analog',
    laboratoryName: 'Analog Electronics Laboratory',
    inventoryCode: 'TRN-ANA-700',
    totalQuantity: 5,
    availableQuantity: 3,
    reservedQuantity: 1,
    checkedOutQuantity: 0,
    maintenanceQuantity: 1,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 3,
    eligibilityRequirement: 'ECE 2nd-3rd Year',
    trainingRequirement: 'Analog Circuits Lab Orientation',
    requiresSupervision: true,
    requiresInstructorApproval: true,
    currentCondition: 'Good',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Patch Cords Assortment', 'IC pin straightener', 'Manual'],
    units: generateUnits('eq-analog-trainer', 'TRN-ANA', 5, 3, 1, 0, 1),
  },
  {
    id: 'eq-workstation',
    name: 'High-Performance GPU CAD & Simulation Workstation',
    category: 'Computer Workstation',
    model: 'Precision 5820 RTX A4500 64GB RAM',
    manufacturer: 'Dell Technologies',
    description: 'Workstation optimized for electromagnetic field solvers (HFSS), Cadence Virtuoso IC layout, MATLAB neural network toolbox, and Vivado synthesis.',
    institutionId: 'inst-abc',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-vlsi',
    laboratoryName: 'VLSI & Microelectronics Design Center',
    inventoryCode: 'WSN-VLS-800',
    totalQuantity: 4,
    availableQuantity: 2,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'Final Year ECE & Research Scholars',
    trainingRequirement: 'EDA Tool License & Cleanroom Etiquette',
    requiresSupervision: false,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Dual 27-inch 4K Monitors', 'Keyboard & Ergonomic Mouse', 'Dongle key'],
    units: generateUnits('eq-workstation', 'WSN-VLS', 4, 2, 1, 1, 0),
  },
  {
    id: 'eq-3dprinter',
    name: 'Dual-Extrusion Precision 3D Printer',
    category: '3D Printer',
    model: 'UltiMaker S5 Dual Extruder',
    manufacturer: 'UltiMaker',
    description: 'Large-volume professional 3D printer for drone chassis, custom sensor enclosures, robotic couplers, and custom PCB housings with soluble PVA supports.',
    institutionId: 'inst-abc',
    departmentId: 'dept-me',
    departmentName: 'Mechanical Engineering',
    laboratoryId: 'lab-fab',
    laboratoryName: 'Precision Manufacturing & Rapid Prototyping Workshop',
    inventoryCode: 'PRN-FAB-900',
    totalQuantity: 1,
    availableQuantity: 1,
    reservedQuantity: 0,
    checkedOutQuantity: 0,
    maintenanceQuantity: 0,
    minBookingDurationHours: 2,
    maxBookingDurationHours: 8,
    eligibilityRequirement: 'Students with Approved CAD Models',
    trainingRequirement: 'Machine Shop Safety & 3D Slicing Certification',
    requiresSupervision: true,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Glass & Aluminum Build Plates', 'Print Core AA & BB', 'Nozzle cleaning kit'],
    units: generateUnits('eq-3dprinter', 'PRN-FAB', 1, 1, 0, 0, 0),
  },
  {
    id: 'eq-esp32',
    name: 'ESP32-WROOM-32 IoT Development Node (Wi-Fi + BLE)',
    category: 'Development Board',
    model: 'ESP32 NodeMCU 38-Pin Dual-Core 240MHz',
    manufacturer: 'Espressif Systems',
    description: 'Dual-core Xtensa 32-bit LX6 microcontroller with integrated 802.11 b/g/n Wi-Fi and Bluetooth 4.2 BLE, capacitive touch pins, Hall sensor, DAC, ADC, SPI, I2C, and PWM interfaces for IoT edge devices.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'ESP-EMB-101',
    totalQuantity: 12,
    availableQuantity: 8,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 5,
    eligibilityRequirement: 'All ECE / CSE / EEE Students with IoT Project',
    trainingRequirement: 'Embedded Systems Workshop Level 1',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Micro-USB Data Cable', '30-Pin Breakout Expansion Shield', 'DHT22 Temp & Humidity Sensor', '0.96-inch OLED I2C Display'],
    units: generateUnits('eq-esp32', 'ESP-EMB', 12, 8, 2, 2, 0),
  },
  {
    id: 'eq-rpi4',
    name: 'Raspberry Pi 4 Model B (4GB RAM) Embedded Linux Board',
    category: 'Development Board',
    model: 'RPi 4B Quad-Core Cortex-A72 @ 1.5GHz',
    manufacturer: 'Raspberry Pi Foundation',
    description: 'Single-board embedded computer featuring dual 4K micro-HDMI outputs, Gigabit Ethernet, 2x USB 3.0 ports, 40-pin GPIO header, and MIPI CSI camera connector for computer vision, ROS robotics, and edge AI.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'RPI-EMB-201',
    totalQuantity: 6,
    availableQuantity: 4,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'ECE 3rd-4th Year & Embedded Capstone Groups',
    trainingRequirement: 'Linux Embedded Systems Orientation',
    requiresSupervision: false,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['32GB SanDisk MicroSD with OS', 'Official 5V 3A USB-C Power Adapter', 'Micro-HDMI to HDMI Cable', '8MP Camera Module V2'],
    units: generateUnits('eq-rpi4', 'RPI-EMB', 6, 4, 1, 1, 0),
  },
  {
    id: 'eq-stm32',
    name: 'STM32 Nucleo-64 (ARM Cortex-M4 STM32F401RE) Dev Board',
    category: 'Development Board',
    model: 'NUCLEO-F401RE 84MHz 512KB Flash 96KB SRAM',
    manufacturer: 'STMicroelectronics',
    description: 'Industry-standard ARM Cortex-M4 microcontroller development board with integrated on-board ST-LINK/V2-1 debugger/programmer, Arduino Uno V3 connector compatibility, and full access to all MCU pins via ST Morpho headers.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'STM-EMB-301',
    totalQuantity: 8,
    availableQuantity: 5,
    reservedQuantity: 2,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'ECE / EEE Students with ARM RTOS Coursework',
    trainingRequirement: 'ARM Cortex Embedded Architecture Safety',
    requiresSupervision: false,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Mini-USB Programming Cable', 'ST-LINK V2 Interface Cable', '10x Female-to-Female DuPont Leads'],
    units: generateUnits('eq-stm32', 'STM-EMB', 8, 5, 2, 1, 0),
  },
  {
    id: 'eq-logic-analyzer',
    name: '8-Channel 24MHz USB Logic Analyzer (I2C/SPI/UART)',
    category: 'Communication Tester',
    model: 'LA-2408 Digital Bus Protocol Decoder',
    manufacturer: 'Saleae Compatible / USBee',
    description: 'Hardware protocol decoder supporting simultaneous sampling across 8 digital logic channels up to 24MHz. Real-time packet parsing for I2C, SPI, Async Serial UART, CAN bus, 1-Wire, and PWM signals via PulseView.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'LOG-EMB-401',
    totalQuantity: 6,
    availableQuantity: 4,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'All Verified Embedded Systems Students',
    trainingRequirement: 'Bus Protocol Analyzer Training',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['8-Channel Color-Coded DuPont Test Cable', '8x SMD Micro Grabber Test Clips', 'Shielded USB 2.0 Cable'],
    units: generateUnits('eq-logic-analyzer', 'LOG-EMB', 6, 4, 1, 1, 0),
  },
  {
    id: 'eq-lora',
    name: 'SX1278 LoRa & Zigbee Wireless Sensor Transceiver Kit',
    category: 'Communication Tester',
    model: 'E32-433T20D 433MHz LoRa Long-Range UART Node',
    manufacturer: 'EBYTE / Semtech',
    description: 'Long-range spread-spectrum wireless telemetry module with +20dBm output power, operating range up to 3km line-of-sight. Seamless UART serial interface for wireless sensor networks and smart campus telemetry.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'LRA-EMB-501',
    totalQuantity: 6,
    availableQuantity: 4,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 5,
    eligibilityRequirement: 'ECE 3rd-4th Year IoT Specialization',
    trainingRequirement: 'RF Emission & Wireless Safety Compliance',
    requiresSupervision: false,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['2x 433MHz SMA Rubber Duck Antennas', 'CP2102 USB-to-TTL UART Converter', 'Antenna Extension Pigtail'],
    units: generateUnits('eq-lora', 'LRA-EMB', 6, 4, 1, 1, 0),
  },
  {
    id: 'eq-msp430',
    name: 'Texas Instruments MSP430 Ultra-Low-Power LaunchPad',
    category: 'Development Board',
    model: 'MSP-EXP430G2ET LaunchPad Dev Kit',
    manufacturer: 'Texas Instruments',
    description: 'Ultra-low-power 16-bit RISC microcontroller kit with integrated flash emulation for programming and debugging via Code Composer Studio, 20-pin BoosterPack headers, and energy measurement jumpers.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'MSP-EMB-601',
    totalQuantity: 5,
    availableQuantity: 3,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'ECE Microcontroller Course Students',
    trainingRequirement: 'Low-Power Microcontroller Lab Module',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Good',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['USB A-to-Mini-B Cable', 'MSP430G2553 & MSP430G2452 DIP Microcontrollers', '32.768kHz Crystal'],
    units: generateUnits('eq-msp430', 'MSP-EMB', 5, 3, 1, 1, 0),
  },
  {
    id: 'eq-stlink',
    name: 'ST-LINK V2 / J-Link SWD In-Circuit Debugger & Flasher',
    category: 'Fabrication Tool',
    model: 'ST-LINK V2 Metal Enclosure In-Circuit Probe',
    manufacturer: 'STMicroelectronics / Segger',
    description: 'Hardware in-circuit debugger and flasher for STM8 and STM32 ARM microcontrollers supporting JTAG, SWD, and SWIM interfaces for live hardware breakpoint debugging and non-volatile flash memory programming.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'DBG-EMB-701',
    totalQuantity: 8,
    availableQuantity: 6,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'All Hardware Prototyping Students',
    trainingRequirement: 'SWD / JTAG In-Circuit Debugging Guidelines',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['4-Pin 2.54mm SWD Ribbon Cable', 'USB Extension Cable', 'Hardware Pinout Guide'],
    units: generateUnits('eq-stlink', 'DBG-EMB', 8, 6, 1, 1, 0),
  },
  {
    id: 'eq-sensor-ultrasonic',
    name: 'HC-SR04 Precision Ultrasonic Distance & Ranging Sensor',
    category: 'Sensor & Transducer',
    model: 'HC-SR04 40kHz Sonar Transducer',
    manufacturer: 'ElecFreaks / SparkFun',
    description: 'High-precision non-contact ultrasonic distance measuring module providing 2cm to 400cm measurement range with 3mm ranging accuracy. Features 5V TTL Trigger and Echo pins for robotics obstacle avoidance and distance measurement.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-ULT-01',
    totalQuantity: 20,
    availableQuantity: 16,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'All ECE / CSE Students',
    trainingRequirement: 'Sensor Interfacing & GPIO Safety',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['4-Pin Female-to-Male DuPont Jumper Wires', 'Acrylic Mounting Bracket with Screws'],
    units: generateUnits('eq-sensor-ultrasonic', 'SNR-ULT', 20, 16, 2, 2, 0),
  },
  {
    id: 'eq-sensor-dht22',
    name: 'DHT22 / AM2302 Digital Temperature & Humidity Sensor Module',
    category: 'Sensor & Transducer',
    model: 'DHT22 Capacitive Relative Humidity & NTC Thermistor',
    manufacturer: 'Aosong Electronics',
    description: 'Calibrated digital composite sensor outputting temperature (-40°C to 80°C ±0.5°C) and relative humidity (0% to 100% RH ±2%). Single-bus digital interface with onboard pull-up resistor and decoupling capacitor.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-DHT-02',
    totalQuantity: 18,
    availableQuantity: 14,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'All Verified IoT Lab Students',
    trainingRequirement: '1-Wire Timing & Bus Safety',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['3-Pin DuPont Jumper Cable', 'Onboard 4.7kΩ Pull-Up Resistor PCB', 'Calibration Sheet'],
    units: generateUnits('eq-sensor-dht22', 'SNR-DHT', 18, 14, 2, 2, 0),
  },
  {
    id: 'eq-sensor-mpu6050',
    name: 'MPU-6050 6-Axis Accelerometer & Gyroscope IMU Motion Sensor',
    category: 'Sensor & Transducer',
    model: 'GY-521 MPU-6050 3-Axis Gyro + 3-Axis Accel with DMP',
    manufacturer: 'InvenSense / TDK',
    description: 'Micro-Electro-Mechanical Systems (MEMS) 6-DoF inertial measurement unit with on-chip Digital Motion Processor (DMP). User-programmable gyro range (±250 to ±2000°/s) and accelerometer range (±2g to ±16g) over 400kHz I2C bus.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-MPU-03',
    totalQuantity: 15,
    availableQuantity: 11,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'ECE Robotics & Embedded Students',
    trainingRequirement: 'I2C Bus Addressing & Sensor Calibration',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['8-Pin Header Pins (Straight and Right-Angle)', 'Female-to-Female Ribbon Wire', 'I2C Register Map Guide'],
    units: generateUnits('eq-sensor-mpu6050', 'SNR-MPU', 15, 11, 2, 2, 0),
  },
  {
    id: 'eq-sensor-pir',
    name: 'HC-SR501 Pyroelectric Passive Infrared (PIR) Motion Sensor',
    category: 'Sensor & Transducer',
    model: 'HC-SR501 Dual-Element Infrared Motion Detector',
    manufacturer: 'Murata / SparkFun',
    description: 'Human body presence and motion detector utilizing Fresnel lens and BISS0001 micro-power processing chip. Features dual trimpots for adjustable delay time (0.3s to 5min) and detection range (3m to 7m, 120° cone).',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-PIR-04',
    totalQuantity: 16,
    availableQuantity: 12,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'All ECE / IoT Students',
    trainingRequirement: 'Digital Interrupt Handling Training',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['3-Pin Jumper Lead Set', 'Fresnel Dome Cap', 'Sensitivity Tuning Trimpot Screwdriver'],
    units: generateUnits('eq-sensor-pir', 'SNR-PIR', 16, 12, 2, 2, 0),
  },
  {
    id: 'eq-sensor-mq2',
    name: 'MQ-2 Combustible Gas, LPG, Propane & Smoke Detector',
    category: 'Sensor & Transducer',
    model: 'MQ-2 Metal Oxide Semiconductor Gas Transducer',
    manufacturer: 'Winsen Electronics',
    description: 'Tin dioxide (SnO2) sensitive sensor with high sensitivity to LPG, propane, methane, butane, alcohol, and hydrogen smoke. Dual output: analog voltage proportional to gas concentration and digital DO TTL output with LM393 comparator.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-MQ2-05',
    totalQuantity: 12,
    availableQuantity: 9,
    reservedQuantity: 1,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'Environmental & IoT Capstone Students',
    trainingRequirement: 'Heater Coil Preheat & Gas Lab Safety Protocol',
    requiresSupervision: true,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['4-Pin DuPont Cable', 'Pre-heater 5V Isolation Shield', 'Calibration Chart for PPM Calculation'],
    units: generateUnits('eq-sensor-mq2', 'SNR-MQ2', 12, 9, 1, 2, 0),
  },
  {
    id: 'eq-sensor-bme280',
    name: 'BME280 Atmospheric Pressure, Altitude, Temp & Humidity Module',
    category: 'Sensor & Transducer',
    model: 'BME280 Environmental Sensor (I2C / SPI)',
    manufacturer: 'Bosch Sensortec',
    description: 'Precision digital environmental sensor measuring barometric pressure (300 to 1100 hPa with ±1 hPa accuracy), altitude resolution down to 0.18m, temperature (±0.5°C), and relative humidity (±3% RH). Ideal for weather telemetry & drones.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-BME-06',
    totalQuantity: 14,
    availableQuantity: 11,
    reservedQuantity: 2,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'ECE / Aerospace / Robotics Projects',
    trainingRequirement: 'I2C/SPI Multi-Drop Bus Safety',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['6-Pin Right Angle Header', 'SPI/I2C Jumper Wire Harness', 'Hypsometric Formula Sheet'],
    units: generateUnits('eq-sensor-bme280', 'SNR-BME', 14, 11, 2, 1, 0),
  },
  {
    id: 'eq-sensor-soil',
    name: 'Capacitive Soil Moisture & Smart Agriculture Sensor Probe',
    category: 'Sensor & Transducer',
    model: 'V1.2 Corrosion-Resistant Capacitive Soil Probe',
    manufacturer: 'DFRobot',
    description: 'Corrosion-resistant capacitive moisture probe operating on capacitance changes rather than resistive conduction, extending operational life in soil. Operates on 3.3V or 5V DC with analog output voltage for smart irrigation.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-SOL-07',
    totalQuantity: 16,
    availableQuantity: 12,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'Agri-Tech & IoT Capstone Students',
    trainingRequirement: 'Analog ADC Calibration Guidelines',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['3-Pin Waterproof Cable', 'Waterproof Heatshrink Seal', 'Calibration Jar'],
    units: generateUnits('eq-sensor-soil', 'SNR-SOL', 16, 12, 2, 2, 0),
  },
  {
    id: 'eq-sensor-max30102',
    name: 'MAX30102 Optical Pulse Oximeter & Heart-Rate Biosensor',
    category: 'Sensor & Transducer',
    model: 'MAX30102 High-Sensitivity Photoplethysmography (PPG)',
    manufacturer: 'Maxim Integrated / Analog Devices',
    description: 'Clinical-grade integrated pulse oximetry and heart-rate monitor biosensor module with dual red (660nm) and infrared (880nm) LEDs, photodetector, and low-noise analog frontend with ambient light rejection over I2C.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-MAX-08',
    totalQuantity: 10,
    availableQuantity: 7,
    reservedQuantity: 1,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'Biomedical & Wearable IoT Students',
    trainingRequirement: 'Biosignal Noise Reduction & Human Testing Ethics',
    requiresSupervision: true,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Finger-Clip Sensor Mount', 'Shielded 5-Pin I2C Leads', 'SpO2 Calculation Algorithm Header'],
    units: generateUnits('eq-sensor-max30102', 'SNR-MAX', 10, 7, 1, 2, 0),
  },
  {
    id: 'eq-sensor-tcrt5000',
    name: 'TCRT5000 4-Channel Infrared Line Tracking & Obstacle Array',
    category: 'Sensor & Transducer',
    model: 'TCRT5000 Quad IR Reflective Optical Sensor Array',
    manufacturer: 'Vishay Telefunken',
    description: 'Array of 4 phototransistor optical reflective sensors operating in the 950nm infrared spectrum. Features LM339 comparator with per-channel sensitivity trimpots and indicator LEDs for line following robots and conveyor counting.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-TCR-09',
    totalQuantity: 12,
    availableQuantity: 9,
    reservedQuantity: 1,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 5,
    eligibilityRequirement: 'Robotics & Automation Students',
    trainingRequirement: 'Optical Sensor Alignment Safety',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['5-Pin Ribbon Connector Wire', 'Mounting Standoffs with M3 Screws'],
    units: generateUnits('eq-sensor-tcrt5000', 'SNR-TCR', 12, 9, 1, 2, 0),
  },
  {
    id: 'eq-sensor-acs712',
    name: 'ACS712 20A Hall-Effect Linear Current Sensor Module',
    category: 'Sensor & Transducer',
    model: 'ACS712ELCTR-20A-T Isolated Current Transducer',
    manufacturer: 'Allegro MicroSystems',
    description: 'Fully integrated, Hall-effect-based linear current sensor IC with 2.1 kVRMS voltage isolation and low-resistance copper conduction path. Outputs 100 mV/A analog voltage centered at VCC/2 for power monitoring and energy auditing.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-ACS-10',
    totalQuantity: 10,
    availableQuantity: 7,
    reservedQuantity: 1,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'Power Electronics & IoT Students',
    trainingRequirement: 'AC/DC High-Current Handling & Isolation Safety',
    requiresSupervision: true,
    requiresInstructorApproval: true,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Dr. Aris Thorne',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['Screw Terminal Block Connector', '3-Pin Analog Cable', 'Galvanic Isolation Safety Barrier'],
    units: generateUnits('eq-sensor-acs712', 'SNR-ACS', 10, 7, 1, 2, 0),
  },
  {
    id: 'eq-sensor-hx711',
    name: 'Precision 5kg Load Cell with HX711 24-Bit ADC Module',
    category: 'Sensor & Transducer',
    model: 'HX711 Dual-Channel 24-Bit Differential ADC + 5kg Strain Gauge',
    manufacturer: 'Avia Semiconductor',
    description: 'Aluminum-alloy strain gauge load cell coupled with HX711 24-bit analog-to-digital converter designed for precision electronic scales. Onboard low-noise programmable gain amplifier (PGA) with selectable gain of 64 or 128.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-HX7-11',
    totalQuantity: 8,
    availableQuantity: 6,
    reservedQuantity: 1,
    checkedOutQuantity: 1,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 4,
    eligibilityRequirement: 'Instrumentation & Industrial IoT Students',
    trainingRequirement: 'Strain Gauge Wheatstone Bridge Calibration',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['4-Wire Shielded Wheatstone Bridge Harness', 'HX711 Breakout Board', 'Standard 100g Calibration Weight'],
    units: generateUnits('eq-sensor-hx711', 'SNR-HX7', 8, 6, 1, 1, 0),
  },
  {
    id: 'eq-sensor-ldr',
    name: 'Photoresistor LDR Ambient Light Sensor Module with LM393',
    category: 'Sensor & Transducer',
    model: 'KY-018 / LM393 High-Sensitivity Cadmium Sulfide Light Sensor',
    manufacturer: 'Keyes / Texas Instruments',
    description: 'Optical light detection sensor module featuring CdS photoresistor and onboard LM393 voltage comparator. Outputs real-time analog light intensity voltage (AO) and digital threshold switching (DO) via multi-turn potentiometer.',
    institutionId: 'inst-jce',
    departmentId: 'dept-ece',
    departmentName: 'Electronics & Communication',
    laboratoryId: 'lab-embedded',
    laboratoryName: 'Embedded Systems & IoT Laboratory',
    inventoryCode: 'SNR-LDR-12',
    totalQuantity: 25,
    availableQuantity: 21,
    reservedQuantity: 2,
    checkedOutQuantity: 2,
    maintenanceQuantity: 0,
    minBookingDurationHours: 1,
    maxBookingDurationHours: 6,
    eligibilityRequirement: 'All Engineering Students',
    trainingRequirement: 'Basic Analog Sensor Interfacing',
    requiresSupervision: false,
    requiresInstructorApproval: false,
    currentCondition: 'Excellent',
    isUnderMaintenance: false,
    depositAmount: 0,
    responsibleStaffName: 'Rajesh Kumar',
    isPublished: true,
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    accessoriesIncluded: ['4-Pin DuPont Ribbon Wires', 'Light Focusing Shroud'],
    units: generateUnits('eq-sensor-ldr', 'SNR-LDR', 25, 21, 2, 2, 0),
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    resourceId: 'eq-osc',
    resourceName: 'Digital Storage Oscilloscope 100MHz Dual-Channel',
    resourceType: 'equipment',
    userId: 'user-std-1',
    userName: 'Sankeshwari Yuvaraj',
    userRole: 'student',
    userEmail: 'sankeshwariyuvaraj07@gmail.com',
    departmentId: 'dept-ece',
    date: '2026-11-02',
    startTime: '10:00',
    endTime: '12:00',
    durationHours: 2,
    requestedQuantity: 1,
    purpose: 'Measurement of frequency response and cutoff curves for 4th-order active Chebyshev low-pass filter.',
    additionalNotes: 'Need high-impedance 10X probe for noise sensitive analog measurements.',
    status: 'approved',
    allocatedUnitIds: ['eq-osc-unit-3'],
    priority: {
      score: 84.5,
      recentUsageFactor: 42.5,
      waitingTimeFactor: 24.0,
      bookingNeedFactor: 18.0,
      explanation: 'High priority due to capstone deadline and low booking frequency in past 14 days.',
    },
    approvedBy: 'Dr. Aris Thorne',
    approvedAt: '2026-10-30T10:15:00Z',
    createdAt: '2026-10-30T09:00:00Z',
  },
  {
    id: 'bk-102',
    resourceId: 'eq-arduino',
    resourceName: 'Arduino Uno R3 Development Kit',
    resourceType: 'equipment',
    userId: 'user-std-1',
    userName: 'Sankeshwari Yuvaraj',
    userRole: 'student',
    userEmail: 'sankeshwariyuvaraj07@gmail.com',
    departmentId: 'dept-ece',
    date: '2026-11-01',
    startTime: '14:00',
    endTime: '16:00',
    durationHours: 2,
    requestedQuantity: 1,
    purpose: 'Embedded firmware debugging for ultrasonic radar collision detection system.',
    status: 'checked_out',
    allocatedUnitIds: ['eq-arduino-unit-8'],
    priority: {
      score: 79.0,
      recentUsageFactor: 40.0,
      waitingTimeFactor: 22.0,
      bookingNeedFactor: 17.0,
      explanation: 'Approved under Embedded Systems lab practical curriculum.',
    },
    approvedBy: 'Dr. Aris Thorne',
    approvedAt: '2026-10-29T14:30:00Z',
    createdAt: '2026-10-29T11:20:00Z',
    checkInRecordId: 'chk-handover-102',
  },
  {
    id: 'bk-103',
    resourceId: 'lab-analog',
    resourceName: 'Analog Electronics Laboratory',
    resourceType: 'laboratory',
    userId: 'user-std-1',
    userName: 'Sankeshwari Yuvaraj',
    userRole: 'student',
    userEmail: 'sankeshwariyuvaraj07@gmail.com',
    departmentId: 'dept-ece',
    date: '2026-11-03',
    startTime: '09:00',
    endTime: '12:00',
    durationHours: 3,
    requestedQuantity: 1,
    purpose: 'Hardware evaluation of RF front-end receiver circuit with faculty guide.',
    status: 'pending',
    priority: {
      score: 88.0,
      recentUsageFactor: 45.0,
      waitingTimeFactor: 25.0,
      bookingNeedFactor: 18.0,
      explanation: 'High priority request with verified safety training credentials.',
    },
    createdAt: '2026-10-30T16:45:00Z',
  },
  {
    id: 'bk-104',
    resourceId: 'eq-arduino',
    resourceName: 'Arduino Uno R3 Development Kit',
    resourceType: 'equipment',
    userId: 'user-std-2',
    userName: 'Vikram Malhotra',
    userRole: 'student',
    userEmail: 'vikram.malhotra@abc.edu',
    departmentId: 'dept-ece',
    date: '2026-11-02',
    startTime: '10:00',
    endTime: '12:00',
    durationHours: 2,
    requestedQuantity: 2,
    purpose: 'I2C multi-master communication demonstration between two sensor nodes.',
    status: 'pending',
    priority: {
      score: 72.0,
      recentUsageFactor: 36.0,
      waitingTimeFactor: 20.0,
      bookingNeedFactor: 16.0,
      explanation: 'Standard request priority; waiting instructor review.',
    },
    createdAt: '2026-10-30T17:10:00Z',
  },
  {
    id: 'bk-105',
    resourceId: 'eq-dmm',
    resourceName: 'True RMS Digital Bench Multimeter 4.5 Digits',
    resourceType: 'equipment',
    userId: 'user-std-3',
    userName: 'Pooja Hegde',
    userRole: 'student',
    userEmail: 'pooja.hegde@abc.edu',
    departmentId: 'dept-ece',
    date: '2026-10-28',
    startTime: '11:00',
    endTime: '13:00',
    durationHours: 2,
    requestedQuantity: 1,
    purpose: 'Power consumption profile characterization on low power MCU.',
    status: 'completed',
    allocatedUnitIds: ['eq-dmm-unit-9'],
    priority: {
      score: 82.0,
      recentUsageFactor: 42.0,
      waitingTimeFactor: 22.0,
      bookingNeedFactor: 18.0,
      explanation: 'Completed with full return inspection.',
    },
    approvedBy: 'Rajesh Kumar',
    approvedAt: '2026-10-28T09:00:00Z',
    createdAt: '2026-10-27T14:00:00Z',
    checkInRecordId: 'chk-handover-105',
    returnRecordId: 'chk-return-105',
  },
  {
    id: 'bk-106',
    resourceId: 'eq-psu',
    resourceName: 'Triple Output Regulated DC Power Supply (0-30V / 3A)',
    resourceType: 'equipment',
    userId: 'user-std-4',
    userName: 'Karthik Raja',
    userRole: 'student',
    userEmail: 'karthik.raja@abc.edu',
    departmentId: 'dept-ece',
    date: '2026-10-26',
    startTime: '14:00',
    endTime: '16:00',
    durationHours: 2,
    requestedQuantity: 1,
    purpose: 'Bi-polar operational amplifier power rail supply testing.',
    status: 'overdue',
    allocatedUnitIds: ['eq-psu-unit-7'],
    priority: {
      score: 65.0,
      recentUsageFactor: 30.0,
      waitingTimeFactor: 20.0,
      bookingNeedFactor: 15.0,
      explanation: 'Overdue by 48 hours; automated return reminder issued.',
    },
    approvedBy: 'Rajesh Kumar',
    approvedAt: '2026-10-26T12:00:00Z',
    createdAt: '2026-10-25T10:00:00Z',
    checkInRecordId: 'chk-handover-106',
    incidentFlagged: true,
  },
];

export const INITIAL_CHECKINS: CheckInOutRecord[] = [
  {
    id: 'chk-handover-102',
    bookingId: 'bk-102',
    resourceId: 'eq-arduino',
    resourceName: 'Arduino Uno R3 Development Kit',
    unitIds: ['eq-arduino-unit-8'],
    type: 'handover',
    timestamp: '2026-10-29T13:58:00Z',
    performedBy: 'Rajesh Kumar (Senior Lab Tech)',
    borrowerName: 'Sankeshwari Yuvaraj',
    conditionRating: 5,
    conditionNotes: 'Kit in pristine condition. All 30 jumper wires present. Board powered via USB port cleanly.',
    accessoriesChecked: [
      { name: 'USB Type-B Cable', present: true },
      { name: '400-Point Breadboard', present: true },
      { name: 'Ultrasonic Sensor HC-SR04', present: true },
      { name: 'Component Storage Box', present: true },
    ],
  },
  {
    id: 'chk-handover-105',
    bookingId: 'bk-105',
    resourceId: 'eq-dmm',
    resourceName: 'True RMS Digital Bench Multimeter 4.5 Digits',
    unitIds: ['eq-dmm-unit-9'],
    type: 'handover',
    timestamp: '2026-10-28T10:55:00Z',
    performedBy: 'Rajesh Kumar (Senior Lab Tech)',
    borrowerName: 'Pooja Hegde',
    conditionRating: 5,
    conditionNotes: 'Calibrated unit. Shrouded leads inspected with no conductor exposure.',
    accessoriesChecked: [
      { name: 'Safety Shrouded Test Leads (Red/Black)', present: true },
      { name: 'Alligator Clips', present: true },
      { name: 'Thermocouple Probe', present: true },
    ],
  },
  {
    id: 'chk-return-105',
    bookingId: 'bk-105',
    resourceId: 'eq-dmm',
    resourceName: 'True RMS Digital Bench Multimeter 4.5 Digits',
    unitIds: ['eq-dmm-unit-9'],
    type: 'return',
    timestamp: '2026-10-28T13:05:00Z',
    performedBy: 'Rajesh Kumar (Senior Lab Tech)',
    borrowerName: 'Pooja Hegde',
    conditionRating: 5,
    conditionNotes: 'Returned on time in spotless condition. All test leads coiled and verified.',
    accessoriesChecked: [
      { name: 'Safety Shrouded Test Leads (Red/Black)', present: true },
      { name: 'Alligator Clips', present: true },
      { name: 'Thermocouple Probe', present: true },
    ],
  },
  {
    id: 'chk-handover-106',
    bookingId: 'bk-106',
    resourceId: 'eq-psu',
    resourceName: 'Triple Output Regulated DC Power Supply (0-30V / 3A)',
    unitIds: ['eq-psu-unit-7'],
    type: 'handover',
    timestamp: '2026-10-26T13:50:00Z',
    performedBy: 'Rajesh Kumar (Senior Lab Tech)',
    borrowerName: 'Karthik Raja',
    conditionRating: 4,
    conditionNotes: 'Minor scratches on metal casing top. Display and terminal posts verified operational.',
    accessoriesChecked: [
      { name: 'Banana to Alligator Cables (Red/Black)', present: true },
      { name: 'Ground Wire', present: true },
      { name: 'AC Mains Cable', present: true },
    ],
  },
];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'maint-01',
    equipmentId: 'eq-arduino',
    equipmentName: 'Arduino Uno R3 Development Kit',
    unitIds: ['eq-arduino-unit-10'],
    taskDescription: 'Replace damaged ATmega328P DIP IC socket and verify USB CH340 / 16U2 serial communication.',
    assignedStaff: 'Rajesh Kumar',
    startDate: '2026-10-28',
    expectedEndDate: '2026-11-03',
    status: 'in_progress',
    findings: 'Broken IC pin caused intermittent serial lockups.',
    actionsTaken: 'Desoldered old socket, installed machined gold pin socket. Testing bootloader.',
    createdAt: '2026-10-28T09:00:00Z',
  },
  {
    id: 'maint-02',
    equipmentId: 'eq-dmm',
    equipmentName: 'True RMS Digital Bench Multimeter 4.5 Digits',
    unitIds: ['eq-dmm-unit-10'],
    taskDescription: 'Annual ISO/IEC 17025 calibration and replacement of fast-acting 10A internal ceramic fuse.',
    assignedStaff: 'Rajesh Kumar',
    startDate: '2026-10-25',
    expectedEndDate: '2026-11-01',
    status: 'in_progress',
    findings: 'Current shunt fuse was blown due to inadvertent overcurrent.',
    actionsTaken: 'Replaced with Bussmann DMM-B-11A fuse. Zero-point recalibrated.',
    createdAt: '2026-10-25T11:00:00Z',
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-01',
    ticketNumber: 'INC-2026-081',
    category: 'Late Return',
    resourceId: 'eq-psu',
    resourceName: 'Triple Output Regulated DC Power Supply (0-30V / 3A)',
    bookingId: 'bk-106',
    reporterName: 'Rajesh Kumar',
    reporterRole: 'technician',
    description: 'Equipment borrowed on Oct 26 was due by 16:00. Student did not return item and failed to respond to SMS notification. Active reservation conflict pending.',
    severity: 'medium',
    status: 'Under Review',
    assignedReviewer: 'Dr. Aris Thorne',
    reviewerNotes: 'Attempted phone call. Student informed project demonstration ran late. Requested immediate handover before 11:00 AM.',
    createdAt: '2026-10-27T10:00:00Z',
  },
  {
    id: 'inc-02',
    ticketNumber: 'INC-2026-079',
    category: 'Damaged Equipment',
    resourceId: 'eq-osc',
    resourceName: 'Digital Storage Oscilloscope 100MHz Dual-Channel',
    reporterName: 'Rajesh Kumar',
    reporterRole: 'technician',
    description: 'BNC input jack Channel 1 loose ground collar detected during return inspection on unit OSC-ANA-004. Probe signals display excessive 50Hz hum.',
    severity: 'high',
    status: 'Reported',
    assignedReviewer: 'Dr. Aris Thorne',
    createdAt: '2026-10-29T16:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-std-1',
    title: 'Booking Approved: 100MHz Oscilloscope',
    message: 'Dr. Aris Thorne approved your reservation for Monday Nov 2, 10:00 AM. Please arrive at Analog Lab with student ID.',
    type: 'success',
    isRead: false,
    createdAt: '2026-10-30T10:15:00Z',
    linkTab: 'bookings',
  },
  {
    id: 'notif-2',
    userId: 'user-std-1',
    title: 'Active Check-Out Reminder',
    message: 'You have Arduino Kit ARD-EMB-008 checked out. Expected return: Nov 1, 16:00.',
    type: 'info',
    isRead: false,
    createdAt: '2026-10-29T14:00:00Z',
    linkTab: 'handovers',
  },
  {
    id: 'notif-3',
    userId: 'user-inst-1',
    title: 'New Booking Request Awaiting Approval',
    message: 'Sankeshwari Yuvaraj submitted a request for Analog Electronics Lab (Nov 3, 09:00 AM). Priority Score: 88.0.',
    type: 'warning',
    isRead: false,
    createdAt: '2026-10-30T16:45:00Z',
    linkTab: 'approvals',
  },
  {
    id: 'notif-4',
    userId: 'user-tech-1',
    title: 'Scheduled Maintenance Due',
    message: 'Calibration check on DMM-ANA-010 is scheduled for completion by Nov 1.',
    type: 'info',
    isRead: true,
    createdAt: '2026-10-28T09:00:00Z',
    linkTab: 'maintenance',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    actorName: 'Dr. Aris Thorne',
    actorRole: 'instructor',
    action: 'APPROVED_BOOKING',
    entityType: 'Booking',
    entityId: 'bk-101',
    details: 'Approved reservation for 100MHz Oscilloscope. Borrower: Sankeshwari Yuvaraj.',
    timestamp: '2026-10-30T10:15:00Z',
  },
  {
    id: 'aud-002',
    actorName: 'Rajesh Kumar',
    actorRole: 'technician',
    action: 'EQUIPMENT_HANDOVER',
    entityType: 'Equipment',
    entityId: 'eq-arduino',
    details: 'Handed over Unit ARD-EMB-008 to Sankeshwari Yuvaraj. Condition: Pristine (5/5).',
    timestamp: '2026-10-29T13:58:00Z',
  },
  {
    id: 'aud-003',
    actorName: 'Dr. Aris Thorne',
    actorRole: 'instructor',
    action: 'CREATED_LABORATORY',
    entityType: 'Laboratory',
    entityId: 'lab-analog',
    details: 'Created Analog Electronics Laboratory (ECE-LAB-101) with capacity 35.',
    timestamp: '2026-10-20T09:30:00Z',
  },
  {
    id: 'aud-004',
    actorName: 'Rajesh Kumar',
    actorRole: 'technician',
    action: 'RETURN_INSPECTION_COMPLETED',
    entityType: 'Equipment',
    entityId: 'eq-dmm',
    details: 'Inspected return for Unit DMM-ANA-009. Condition: Pristine. Restored to inventory.',
    timestamp: '2026-10-28T13:05:00Z',
  },
  {
    id: 'aud-005',
    actorName: 'Rajesh Kumar',
    actorRole: 'technician',
    action: 'FLAGGED_INCIDENT',
    entityType: 'Incident',
    entityId: 'inc-01',
    details: 'Flagged overdue equipment DC Power Supply (PSU-DIG-007). Assigned to Dr. Aris Thorne.',
    timestamp: '2026-10-27T10:00:00Z',
  },
];

export const INITIAL_PROJECT_KITS: ProjectKitBundle[] = [
  {
    id: 'kit-iot-weather',
    title: 'IoT Microclimate & Environmental Weather Station Kit',
    category: 'Internet of Things (IoT)',
    targetCourse: 'ECE 6th Sem • IoT & Wireless Sensor Networks',
    description: 'Complete edge node bundle for remote atmospheric telemetry. Measures barometric pressure, ambient temperature, humidity, and altitude with real-time OLED graph plotting and Wi-Fi cloud sync.',
    equipmentIds: ['eq-esp32', 'eq-sensor-bme280', 'eq-sensor-ldr'],
    equipmentNames: [
      'ESP32-WROOM-32 IoT Node (Wi-Fi + BLE)',
      'BME280 Atmospheric Pressure, Altitude, Temp & Humidity Module',
      'Photoresistor LDR Ambient Light Sensor Module with LM393',
    ],
    difficulty: 'Beginner',
    estimatedHours: 4,
    sensorModules: ['BME280 (I2C: 0x76)', 'CdS LDR (Analog AO)', '0.96 OLED (I2C: 0x3C)'],
    schematicAvailable: true,
    popularity: 98,
    iconName: 'CloudRain',
  },
  {
    id: 'kit-smart-agriculture',
    title: 'Precision Automated Smart Agriculture & Irrigation Kit',
    category: 'Embedded Agri-Tech',
    targetCourse: 'ECE / CSE Capstone & Mini-Project Lab',
    description: 'Autonomous soil moisture monitoring and smart pump triggering system. Prevents over-irrigation using capacitive corrosion-proof probes and dual ambient atmospheric tracking.',
    equipmentIds: ['eq-esp32', 'eq-sensor-soil', 'eq-sensor-dht22', 'eq-psu'],
    equipmentNames: [
      'ESP32-WROOM-32 IoT Node (Wi-Fi + BLE)',
      'Capacitive Soil Moisture & Smart Agriculture Sensor Probe',
      'DHT22 / AM2302 Digital Temperature & Humidity Sensor Module',
      'Triple Output Regulated DC Power Supply (0-30V / 3A)',
    ],
    difficulty: 'Intermediate',
    estimatedHours: 6,
    sensorModules: ['Capacitive Soil Probe (Analog 0-3.3V)', 'DHT22 (1-Wire GPIO4)', '5V Relay Module'],
    schematicAvailable: true,
    popularity: 94,
    iconName: 'Sprout',
  },
  {
    id: 'kit-obstacle-robot',
    title: 'Autonomous Mobile Robot Navigation & Obstacle Avoidance Kit',
    category: 'Robotics & Control',
    targetCourse: 'ECE 5th Sem • Microcontrollers & Robotics Laboratory',
    description: 'Hardware navigation kit for autonomous rovers. Features 40kHz ultrasonic echolocation ranging combined with 4-channel reflective infrared line tracking arrays.',
    equipmentIds: ['eq-stm32', 'eq-sensor-ultrasonic', 'eq-sensor-tcrt5000', 'eq-logic-analyzer'],
    equipmentNames: [
      'STM32 Nucleo-64 (ARM Cortex-M4 STM32F401RE) Dev Board',
      'HC-SR04 Precision Ultrasonic Distance & Ranging Sensor',
      'TCRT5000 4-Channel Infrared Line Tracking & Obstacle Array',
      '8-Channel 24MHz USB Logic Analyzer Protocol Decoder',
    ],
    difficulty: 'Intermediate',
    estimatedHours: 8,
    sensorModules: ['HC-SR04 (Sonar Trig/Echo)', 'TCRT5000 (4-Ch Digital DO)', 'L298N Motor Driver'],
    schematicAvailable: true,
    popularity: 96,
    iconName: 'Bot',
  },
  {
    id: 'kit-biomedical-vitals',
    title: 'Wearable Biosignal & Pulse Oximetry Patient Monitor Kit',
    category: 'Biomedical Electronics',
    targetCourse: 'ECE 7th Sem • Biomedical Signal Processing',
    description: 'Clinical-grade photoplethysmography (PPG) vitals monitoring bundle. Extracts blood oxygen saturation (SpO2) and heart-rate pulses with active motion artifact rejection.',
    equipmentIds: ['eq-esp32', 'eq-sensor-max30102', 'eq-dmm'],
    equipmentNames: [
      'ESP32-WROOM-32 IoT Node (Wi-Fi + BLE)',
      'MAX30102 Optical Pulse Oximeter & Heart-Rate Biosensor',
      'True RMS Digital Bench Multimeter 4.5 Digits',
    ],
    difficulty: 'Advanced',
    estimatedHours: 6,
    sensorModules: ['MAX30102 (I2C: 0x57)', 'Active Buzzer Indicator', 'OLED PPG Waveform Display'],
    schematicAvailable: true,
    popularity: 91,
    iconName: 'HeartPulse',
  },
  {
    id: 'kit-energy-audit',
    title: 'Industrial Current, Power Factor & Energy Auditing Kit',
    category: 'Power Electronics',
    targetCourse: 'ECE / EEE Power Electronics & Energy Management',
    description: 'Non-invasive AC/DC load current monitoring with 2.1 kVRMS galvanic isolation. Calculates true RMS current, active power consumption, and peak transients.',
    equipmentIds: ['eq-esp32', 'eq-sensor-acs712', 'eq-osc', 'eq-dmm'],
    equipmentNames: [
      'ESP32-WROOM-32 IoT Node (Wi-Fi + BLE)',
      'ACS712 20A Hall-Effect Linear Current Sensor Module',
      'Digital Storage Oscilloscope 100MHz Dual-Channel',
      'True RMS Digital Bench Multimeter 4.5 Digits',
    ],
    difficulty: 'Advanced',
    estimatedHours: 5,
    sensorModules: ['ACS712-20A (Analog 100mV/A)', 'True RMS Sampling', 'BNC Differential Probe'],
    schematicAvailable: true,
    popularity: 88,
    iconName: 'Zap',
  },
  {
    id: 'kit-imu-flight',
    title: 'UAV 6-DoF Inertial Flight Attitude & Dynamics Tracking Kit',
    category: 'Aerospace & Navigation',
    targetCourse: 'ECE / Mechanical Robotics & Drone Dynamics',
    description: 'Six degrees-of-freedom inertial motion tracker with on-chip Digital Motion Processor (DMP). Delivers pitch, roll, and yaw Euler angles for stabilizing quadcopters and robotic arms.',
    equipmentIds: ['eq-stm32', 'eq-sensor-mpu6050', 'eq-logic-analyzer'],
    equipmentNames: [
      'STM32 Nucleo-64 (ARM Cortex-M4 STM32F401RE) Dev Board',
      'MPU-6050 6-Axis Accelerometer & Gyroscope IMU Motion Sensor',
      '8-Channel 24MHz USB Logic Analyzer Protocol Decoder',
    ],
    difficulty: 'Advanced',
    estimatedHours: 7,
    sensorModules: ['MPU-6050 (I2C: 0x68 DMP)', 'Logic Analyzer SPI/I2C Probes', 'UART Telemetry'],
    schematicAvailable: true,
    popularity: 95,
    iconName: 'Compass',
  },
];

export const INITIAL_SAFETY_MODULES: StudentSafetyModule[] = [
  {
    id: 'safe-01',
    title: 'Level 1: General Laboratory Safety & ESD Protection',
    description: 'Core institutional safety guidelines: anti-static wristband protocols, bench grounding, clean work surfaces, and chemical eyewash emergency procedures.',
    tier: 'Tier 1',
    status: 'passed',
    score: 100,
    completedAt: '2026-09-15',
    unlocks: ['Bench Multimeters', 'Digital Trainer Kits', 'Prototyping Breadboards', 'Basic DC Sensors'],
  },
  {
    id: 'safe-02',
    title: 'Level 2: Microcontroller Voltage Regulation & Bus Interfacing',
    description: 'Protocols for handling 3.3V vs 5V logic tolerances, preventing GPIO back-powering, bus pull-up sizing for I2C, and USB short-circuit prevention.',
    tier: 'Tier 2',
    status: 'passed',
    score: 95,
    completedAt: '2026-10-02',
    unlocks: ['ESP32 DevKit', 'STM32 Nucleo-64', 'Raspberry Pi 4B', 'USB Logic Analyzer', 'SX1278 LoRa Node'],
  },
  {
    id: 'safe-03',
    title: 'Level 3: Hazardous Gas, RF Emissions & High-Current Safety',
    description: 'Safe handling of combustible gas pre-heaters (MQ-2), high-power RF transmission limits, 20A current isolation barriers, and Cleanroom EDA procedures.',
    tier: 'Tier 3',
    status: 'pending',
    score: undefined,
    unlocks: ['MQ-2 Flammable Gas Sensor', 'ACS712 20A Current Transducer', 'Linear Power Supply 30V/3A', 'VLSI Workstation Subnet'],
  },
];

export const INITIAL_PINOUT_GUIDES: SensorPinoutGuide[] = [
  {
    id: 'pinout-ultrasonic',
    sensorName: 'HC-SR04 Ultrasonic Distance Sensor',
    equipmentId: 'eq-sensor-ultrasonic',
    operatingVoltage: '5.0V DC (TTL)',
    communicationBus: 'Dual GPIO Digital (Trigger / Echo)',
    pinout: [
      { pin: 'VCC', function: '+5V Power Supply', note: 'Connect to 5V rail; not 3.3V.' },
      { pin: 'Trig', function: 'Trigger Input Pulse', note: '10µs HIGH TTL pulse initiates 8-cycle 40kHz sonic burst.' },
      { pin: 'Echo', function: 'Echo Output Pulse', note: 'Width proportional to distance. Use 1k/2k voltage divider for 3.3V MCUs.' },
      { pin: 'GND', function: 'Ground', note: 'Common ground with MCU.' },
    ],
    sampleSnippet: `// Arduino / ESP32 HC-SR04 Readout
const int trigPin = 5;
const int echoPin = 18;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  float distanceCm = duration * 0.034 / 2.0;
  Serial.printf("Distance: %.2f cm\\n", distanceCm);
  delay(100);
}`,
    precautions: [
      'Do not connect 5V Echo pin directly to ESP32 without a voltage divider (2.2k / 4.7k).',
      'Target surface should have a minimum area of 0.5 sq meters for maximum 4m range.',
    ],
  },
  {
    id: 'pinout-bme280',
    sensorName: 'BME280 Atmospheric Pressure, Altitude & Temp',
    equipmentId: 'eq-sensor-bme280',
    operatingVoltage: '3.3V DC (Strict)',
    communicationBus: 'I2C (Address 0x76 or 0x77) / SPI',
    pinout: [
      { pin: 'VCC', function: '3.3V Power', note: 'Never connect to 5V without onboard regulator.' },
      { pin: 'GND', function: 'Ground', note: 'System ground.' },
      { pin: 'SCL', function: 'I2C Clock / SPI SCK', note: 'ESP32 default SCL = GPIO22.' },
      { pin: 'SDA', function: 'I2C Data / SPI MOSI', note: 'ESP32 default SDA = GPIO21.' },
    ],
    sampleSnippet: `// BME280 Readout using Adafruit_BME280 library
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void setup() {
  Serial.begin(115200);
  if (!bme.begin(0x76)) {
    Serial.println("BME280 not found! Check wiring.");
    while (1);
  }
}

void loop() {
  Serial.print("Temp: "); Serial.print(bme.readTemperature()); Serial.println(" *C");
  Serial.print("Pressure: "); Serial.print(bme.readPressure() / 100.0F); Serial.println(" hPa");
  Serial.print("Approx Altitude: "); Serial.print(bme.readAltitude(1013.25)); Serial.println(" m");
  delay(1000);
}`,
    precautions: [
      'BME280 operates at 3.3V logic. 5V VCC will damage the Bosch MEMS sensor element.',
      'Check SDO pin state: Tied to GND gives address 0x76; tied to VCC gives 0x77.',
    ],
  },
  {
    id: 'pinout-mpu6050',
    sensorName: 'MPU-6050 6-Axis Accelerometer & Gyroscope',
    equipmentId: 'eq-sensor-mpu6050',
    operatingVoltage: '3.3V - 5.0V (Onboard LDO)',
    communicationBus: 'I2C (Address 0x68 default, 0x69 if AD0 High)',
    pinout: [
      { pin: 'VCC', function: 'Power Input', note: 'Module features onboard 3.3V regulator.' },
      { pin: 'GND', function: 'Ground', note: '0V Reference.' },
      { pin: 'SCL', function: 'I2C Clock', note: 'Requires 4.7kΩ pull-up to 3.3V.' },
      { pin: 'SDA', function: 'I2C Data', note: 'Bidirectional data line.' },
      { pin: 'INT', function: 'Interrupt Output', note: 'Signals FIFO buffer ready to host MCU.' },
    ],
    sampleSnippet: `// MPU-6050 Raw Sensor Reader
#include <Wire.h>
const int MPU_ADDR = 0x68;
int16_t AcX, AcY, AcZ, Tmp, GyX, GyY, GyZ;

void setup() {
  Wire.begin();
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); // PWR_MGMT_1 register
  Wire.write(0);    // Wake up MPU-6050
  Wire.endTransmission(true);
  Serial.begin(115200);
}

void loop() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B); // Starting from register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true);

  AcX = Wire.read()<<8|Wire.read();
  AcY = Wire.read()<<8|Wire.read();
  AcZ = Wire.read()<<8|Wire.read();
  Serial.printf("Accel X: %d | Y: %d | Z: %d\\n", AcX, AcY, AcZ);
  delay(100);
}`,
    precautions: [
      'Calibrate sensor offsets while placing board on an absolutely level surface.',
      'Do not apply mechanical stress or flexing forces to the GY-521 breakout board.',
    ],
  },
  {
    id: 'pinout-dht22',
    sensorName: 'DHT22 / AM2302 Temp & Humidity Sensor',
    equipmentId: 'eq-sensor-dht22',
    operatingVoltage: '3.3V - 5.5V DC',
    communicationBus: 'Proprietary 1-Wire Digital Bus',
    pinout: [
      { pin: 'Pin 1 (Left)', function: 'VCC', note: '3.3V to 5V DC power.' },
      { pin: 'Pin 2', function: 'Data (SDA)', note: 'Single-wire bidirectional data. Add 4.7k pullup.' },
      { pin: 'Pin 3', function: 'NC', note: 'No connection.' },
      { pin: 'Pin 4 (Right)', function: 'GND', note: 'Ground.' },
    ],
    sampleSnippet: `// DHT22 Readout
#include "DHT.h"
#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  delay(2000); // 2-second minimum sampling interval
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  Serial.printf("Humidity: %.1f %% | Temp: %.1f *C\\n", h, t);
}`,
    precautions: [
      'Sampling rate must not exceed once every 2 seconds (0.5Hz max frequency).',
      'Keep away from direct heat sources and direct sunlight.',
    ],
  },
  {
    id: 'pinout-max30102',
    sensorName: 'MAX30102 Optical Pulse Oximeter & Heart-Rate',
    equipmentId: 'eq-sensor-max30102',
    operatingVoltage: '3.3V DC (Module)',
    communicationBus: 'I2C (Address 0x57)',
    pinout: [
      { pin: 'VIN', function: '3.3V Power', note: 'Input supply.' },
      { pin: 'GND', function: 'Ground', note: 'Common ground.' },
      { pin: 'SCL', function: 'I2C Clock', note: 'Connect to ESP32 GPIO22.' },
      { pin: 'SDA', function: 'I2C Data', note: 'Connect to ESP32 GPIO21.' },
      { pin: 'INT', function: 'Active-Low Interrupt', note: 'Optional data-ready interrupt.' },
    ],
    sampleSnippet: `// MAX30102 Heart-Rate Sensor using SparkFun library
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

MAX30105 particleSensor;

void setup() {
  Serial.begin(115200);
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 was not found. Please check wiring/power.");
    while (1);
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

void loop() {
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue)) {
    Serial.println("Pulse Detected!");
  }
  delay(20);
}`,
    precautions: [
      'Gently place finger on sensor without heavy pressure to avoid occluding capillary blood flow.',
      'Cover with black cloth during testing if strong ambient fluorescent light causes noise.',
    ],
  },
];

// Reactive Store Implementation with LocalStorage persistence
type Listener = () => void;

class CampusStore {
  private listeners: Set<Listener> = new Set();
  private storageKey = 'campusshare_v1_data';

  private registeredUsers: UserProfile[] = [...DEMO_USERS];
  private laboratories: Laboratory[] = [];
  private equipment: Equipment[] = [];
  private bookings: Booking[] = [];
  private checkIns: CheckInOutRecord[] = [];
  private maintenance: MaintenanceRecord[] = [];
  private incidents: Incident[] = [];
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLog[] = [];
  private safetyModules: StudentSafetyModule[] = [...INITIAL_SAFETY_MODULES];
  private projectKits: ProjectKitBundle[] = [...INITIAL_PROJECT_KITS];
  private pinoutGuides: SensorPinoutGuide[] = [...INITIAL_PINOUT_GUIDES];
  private currentUser: UserProfile = DEMO_USERS[0];
  private supabaseSyncState: SupabaseSyncState = {
    status: 'disconnected',
    lastSyncedAt: null,
    errorMessage: null,
    totalSynced: 0,
  };

  constructor() {
    this.loadFromStorage();
    // Background sync with Supabase project nozotfhooeqhetjhtjmr
    this.initSupabaseSync();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.registeredUsers = data.registeredUsers || [...DEMO_USERS];
        this.laboratories = data.laboratories || INITIAL_LABORATORIES;
        
        // Merge any newly introduced equipment (such as sensors and embedded boards) so they always appear
        if (data.equipment && Array.isArray(data.equipment)) {
          const existingIds = new Set(data.equipment.map((e: Equipment) => e.id));
          const missing = INITIAL_EQUIPMENT.filter((e) => !existingIds.has(e.id));
          this.equipment = [...data.equipment, ...missing];
        } else {
          this.equipment = INITIAL_EQUIPMENT;
        }

        this.bookings = data.bookings || INITIAL_BOOKINGS;
        this.checkIns = data.checkIns || INITIAL_CHECKINS;
        this.maintenance = data.maintenance || INITIAL_MAINTENANCE;
        this.incidents = data.incidents || INITIAL_INCIDENTS;
        this.notifications = data.notifications || INITIAL_NOTIFICATIONS;
        this.auditLogs = data.auditLogs || INITIAL_AUDIT_LOGS;

        const storedUserId = localStorage.getItem('campusshare_current_user_id');
        const foundUser = this.registeredUsers.find((u) => u.id === storedUserId) || DEMO_USERS.find((u) => u.id === storedUserId);
        this.currentUser = foundUser || this.registeredUsers[0] || DEMO_USERS[0];
        return;
      }
    } catch (e) {
      console.warn('Failed to load CampusShare data from localStorage, falling back to defaults', e);
    }

    this.resetToDefaults();
  }

  private saveToStorage() {
    try {
      const data = {
        registeredUsers: this.registeredUsers,
        laboratories: this.laboratories,
        equipment: this.equipment,
        bookings: this.bookings,
        checkIns: this.checkIns,
        maintenance: this.maintenance,
        incidents: this.incidents,
        notifications: this.notifications,
        auditLogs: this.auditLogs,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      localStorage.setItem('campusshare_current_user_id', this.currentUser.id);
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public resetToDefaults() {
    this.registeredUsers = JSON.parse(JSON.stringify(DEMO_USERS));
    this.laboratories = JSON.parse(JSON.stringify(INITIAL_LABORATORIES));
    this.equipment = JSON.parse(JSON.stringify(INITIAL_EQUIPMENT));
    this.bookings = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
    this.checkIns = JSON.parse(JSON.stringify(INITIAL_CHECKINS));
    this.maintenance = JSON.parse(JSON.stringify(INITIAL_MAINTENANCE));
    this.incidents = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.currentUser = DEMO_USERS[0];
    this.notify();
  }

  // Getters
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public getRegisteredUsers(): UserProfile[] {
    return this.registeredUsers;
  }

  public registerUser(data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    departmentId: string;
    departmentName: string;
    studentIdOrEmployeeId: string;
    safetyTrainingVerified?: boolean;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanId = data.studentIdOrEmployeeId.trim().toUpperCase();

    const existing = this.registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.studentIdOrEmployeeId.toUpperCase() === cleanId
    );
    if (existing) {
      return { success: false, error: 'An account with this institutional email or USN already exists.' };
    }

    const newUser: UserProfile = {
      id: `user-custom-${Date.now().toString().slice(-6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      institutionId: 'inst-jce',
      studentIdOrEmployeeId: cleanId,
      avatarUrl: data.role === 'student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      safetyTrainingVerified: data.safetyTrainingVerified ?? true,
      trainingExpiresAt: '2028-06-30',
      totalBookingsCompleted: 0,
    };

    this.registeredUsers.push(newUser);
    this.currentUser = newUser;
    this.notify();

    this.addAuditLog({
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: newUser.id,
      details: `Registered account for ${newUser.name} (${newUser.studentIdOrEmployeeId}) in ${newUser.departmentName}`,
    });

    return { success: true, user: newUser };
  }

  public loginUser(identifier: string, _password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const clean = identifier.trim().toLowerCase();
    const user = this.registeredUsers.find(
      (u) => u.email.toLowerCase() === clean || u.studentIdOrEmployeeId.toLowerCase() === clean
    );
    if (!user) {
      return { success: false, error: 'No user account found matching this email or USN.' };
    }
    this.currentUser = user;
    this.notify();

    this.addAuditLog({
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: `User ${user.name} logged into CampusShare portal`,
    });

    return { success: true, user };
  }

  public logoutUser() {
    this.currentUser = DEMO_USERS[0];
    this.notify();
  }

  public setCurrentUser(roleOrId: string) {
    const user = this.registeredUsers.find((u) => u.id === roleOrId || u.role === roleOrId) ||
                 DEMO_USERS.find((u) => u.id === roleOrId || u.role === roleOrId);
    if (user) {
      this.currentUser = user;
      this.notify();
    }
  }

  public getLaboratories(): Laboratory[] {
    return this.laboratories;
  }

  public getEquipment(): Equipment[] {
    return this.equipment;
  }

  public getBookings(): Booking[] {
    return this.bookings;
  }

  public getCheckIns(): CheckInOutRecord[] {
    return this.checkIns;
  }

  public getMaintenance(): MaintenanceRecord[] {
    return this.maintenance;
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }

  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  // Authoritative FairShare Calculation Engine
  public calculatePriority(userId: string, date: string, purpose: string): FairSharePriority {
    // 1. Recent usage factor (50% weight):
    // Users with fewer completed/active bookings get higher score (max 50)
    const userBookings = this.bookings.filter(
      (b) => b.userId === userId && b.status !== 'cancelled' && b.status !== 'rejected'
    );
    const activeCount = userBookings.length;
    // Lower active bookings => higher factor
    const recentUsageFactor = Math.max(10, 50 - activeCount * 6);

    // 2. Waiting time factor (30% weight):
    // If request submitted for date further out or waiting list, score increases
    const now = new Date();
    const reqDate = new Date(date);
    const diffDays = Math.max(0, Math.ceil((reqDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));
    const waitingTimeFactor = Math.min(30, 15 + diffDays * 3);

    // 3. Booking need score (20% weight):
    // Keywords indicating academic/capstone/exam/research need
    const lowerP = purpose.toLowerCase();
    let needScore = 14;
    if (lowerP.includes('capstone') || lowerP.includes('thesis') || lowerP.includes('exam')) {
      needScore = 20;
    } else if (lowerP.includes('research') || lowerP.includes('project') || lowerP.includes('assignment')) {
      needScore = 18;
    }
    const bookingNeedFactor = needScore;

    const totalScore = parseFloat((recentUsageFactor + waitingTimeFactor + bookingNeedFactor).toFixed(1));

    let explanation = `Priority ${totalScore}/100: `;
    if (recentUsageFactor >= 40) {
      explanation += 'High fairness score awarded due to infrequent recent borrowing.';
    } else {
      explanation += 'Moderate score balanced with user current active reservations.';
    }

    return {
      score: totalScore,
      recentUsageFactor,
      waitingTimeFactor,
      bookingNeedFactor,
      explanation,
    };
  }

  // Availability & Overlap Checker
  public checkConflicts(
    resourceId: string,
    resourceType: 'equipment' | 'laboratory',
    date: string,
    startTime: string,
    endTime: string,
    requestedQuantity: number = 1
  ): { hasConflict: boolean; reason?: string; availableUnitsRemaining: number } {
    if (resourceType === 'laboratory') {
      const lab = this.laboratories.find((l) => l.id === resourceId);
      if (!lab) return { hasConflict: true, reason: 'Laboratory not found', availableUnitsRemaining: 0 };
      if (!lab.isAvailable || !lab.isPublished) {
        return { hasConflict: true, reason: 'Laboratory is currently closed or unpublished', availableUnitsRemaining: 0 };
      }

      // Check operating hours
      if (startTime < lab.operatingHours.start || endTime > lab.operatingHours.end) {
        return {
          hasConflict: true,
          reason: `Requested time is outside operating hours (${lab.operatingHours.start} - ${lab.operatingHours.end})`,
          availableUnitsRemaining: 0,
        };
      }

      // Check overlapping confirmed bookings
      const overlappingBookings = this.bookings.filter(
        (b) =>
          b.resourceId === resourceId &&
          b.date === date &&
          ['approved', 'checked_out'].includes(b.status) &&
          !(endTime <= b.startTime || startTime >= b.endTime)
      );

      if (overlappingBookings.length > 0) {
        return {
          hasConflict: true,
          reason: `Conflicting reservation already approved (${overlappingBookings[0].startTime} - ${overlappingBookings[0].endTime})`,
          availableUnitsRemaining: 0,
        };
      }

      return { hasConflict: false, availableUnitsRemaining: lab.capacity };
    } else {
      // Equipment
      const eq = this.equipment.find((e) => e.id === resourceId);
      if (!eq) return { hasConflict: true, reason: 'Equipment not found', availableUnitsRemaining: 0 };
      if (eq.isUnderMaintenance) {
        return { hasConflict: true, reason: 'Equipment model is under scheduled maintenance', availableUnitsRemaining: 0 };
      }

      // Find overlapping bookings for this equipment
      const overlappingActiveBookings = this.bookings.filter(
        (b) =>
          b.resourceId === resourceId &&
          b.date === date &&
          ['approved', 'checked_out'].includes(b.status) &&
          !(endTime <= b.startTime || startTime >= b.endTime)
      );

      const reservedInSlot = overlappingActiveBookings.reduce((sum, b) => sum + b.requestedQuantity, 0);
      const unitsWorking = eq.totalQuantity - eq.maintenanceQuantity;
      const remainingInSlot = Math.max(0, unitsWorking - reservedInSlot);

      if (requestedQuantity > remainingInSlot) {
        return {
          hasConflict: true,
          reason: `Requested quantity (${requestedQuantity}) exceeds available units (${remainingInSlot} available in this timeslot)`,
          availableUnitsRemaining: remainingInSlot,
        };
      }

      return { hasConflict: false, availableUnitsRemaining: remainingInSlot };
    }
  }

  // Create Booking
  public createBooking(data: {
    resourceId: string;
    resourceName: string;
    resourceType: 'equipment' | 'laboratory';
    date: string;
    startTime: string;
    endTime: string;
    requestedQuantity: number;
    purpose: string;
    additionalNotes?: string;
  }): { success: boolean; booking?: Booking; error?: string; isWaitlisted?: boolean } {
    const user = this.currentUser;

    // Safety and eligibility verification check
    if (user.role === 'student' && !user.safetyTrainingVerified) {
      return {
        success: false,
        error: 'Mandatory Safety Training Level 1 certification is required before requesting this laboratory or equipment.',
      };
    }

    const durationHours = Math.max(1, parseInt(data.endTime.split(':')[0]) - parseInt(data.startTime.split(':')[0]));
    const conflictCheck = this.checkConflicts(
      data.resourceId,
      data.resourceType,
      data.date,
      data.startTime,
      data.endTime,
      data.requestedQuantity
    );

    const priority = this.calculatePriority(user.id, data.date, data.purpose);
    const isWaitlisted = conflictCheck.hasConflict;

    let assignedUnits: string[] = [];
    if (!isWaitlisted && data.resourceType === 'equipment') {
      const eq = this.equipment.find((e) => e.id === data.resourceId);
      if (eq) {
        const availableUnits = eq.units.filter((u) => u.status === 'available');
        assignedUnits = availableUnits.slice(0, data.requestedQuantity).map((u) => u.id);
        // Mark units as reserved
        assignedUnits.forEach((uid) => {
          const u = eq.units.find((unit) => unit.id === uid);
          if (u) u.status = 'reserved';
        });
        this.recalculateEquipmentQuantities(eq.id);
      }
    }

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      resourceId: data.resourceId,
      resourceName: data.resourceName,
      resourceType: data.resourceType,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email,
      departmentId: user.departmentId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      durationHours,
      requestedQuantity: data.requestedQuantity,
      purpose: data.purpose,
      additionalNotes: data.additionalNotes,
      status: isWaitlisted ? 'waitlisted' : 'pending',
      allocatedUnitIds: assignedUnits,
      priority,
      waitlistPosition: isWaitlisted ? 1 : undefined,
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);

    // Save appointment details in user's Supabase account (nozotfhooeqhetjhtjmr)
    saveBookingToSupabase(newBooking)
      .then((res) => {
        if (res.success) {
          this.supabaseSyncState.status = 'connected';
          this.supabaseSyncState.lastSyncedAt = new Date().toISOString();
          this.supabaseSyncState.totalSynced += 1;
          this.supabaseSyncState.errorMessage = null;
          this.notify();
        } else if (res.tablePending) {
          this.supabaseSyncState.status = 'table_pending';
          this.supabaseSyncState.errorMessage = 'Supabase bookings table needs to be created in SQL editor';
          this.notify();
        } else {
          this.supabaseSyncState.status = 'error';
          this.supabaseSyncState.errorMessage = res.error || 'Failed to sync with Supabase';
          this.notify();
        }
      })
      .catch((err) => {
        this.supabaseSyncState.status = 'error';
        this.supabaseSyncState.errorMessage = err?.message || 'Supabase sync failed';
        this.notify();
      });

    // Audit Log
    this.addAuditLog({
      actorName: user.name,
      actorRole: user.role,
      action: isWaitlisted ? 'WAITLISTED_BOOKING_SUBMITTED' : 'BOOKING_SUBMITTED',
      entityType: 'Booking',
      entityId: newBooking.id,
      details: `Requested ${data.resourceName} for ${data.date} (${data.startTime} - ${data.endTime}). Status: ${newBooking.status}. Priority: ${priority.score}`,
    });

    // Notify Instructors
    this.addNotification({
      userId: 'user-inst-1',
      title: isWaitlisted ? 'Waitlist Request Submitted' : 'New Booking Request',
      message: `${user.name} submitted request for ${data.resourceName} on ${data.date}. Priority: ${priority.score}`,
      type: isWaitlisted ? 'warning' : 'info',
      linkTab: 'approvals',
    });

    this.notify();
    return { success: true, booking: newBooking, isWaitlisted };
  }

  // Instructor Approvals
  public approveBooking(bookingId: string, approverName: string = this.currentUser.name) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    booking.status = 'approved';
    booking.approvedBy = approverName;
    booking.approvedAt = new Date().toISOString();

    if (booking.resourceType === 'equipment') {
      const eq = this.equipment.find((e) => e.id === booking.resourceId);
      if (eq) {
        if (!booking.allocatedUnitIds || booking.allocatedUnitIds.length === 0) {
          const availableUnits = eq.units.filter((u) => u.status === 'available');
          booking.allocatedUnitIds = availableUnits.slice(0, booking.requestedQuantity).map((u) => u.id);
          booking.allocatedUnitIds.forEach((uid) => {
            const u = eq.units.find((unit) => unit.id === uid);
            if (u) u.status = 'reserved';
          });
        }
        this.recalculateEquipmentQuantities(eq.id);
      }
    }

    this.addNotification({
      userId: booking.userId,
      title: 'Booking Approved!',
      message: `Your booking for ${booking.resourceName} on ${booking.date} (${booking.startTime}) has been approved by ${approverName}.`,
      type: 'success',
      linkTab: 'bookings',
    });

    this.addAuditLog({
      actorName: approverName,
      actorRole: this.currentUser.role,
      action: 'APPROVED_BOOKING',
      entityType: 'Booking',
      entityId: booking.id,
      details: `Approved booking ${booking.id} for borrower ${booking.userName}`,
    });

    this.notify();
  }

  public rejectBooking(bookingId: string, reason: string, reviewerName: string = this.currentUser.name) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    booking.status = 'rejected';
    booking.rejectionReason = reason;

    // Release any reserved units
    if (booking.allocatedUnitIds && booking.resourceType === 'equipment') {
      const eq = this.equipment.find((e) => e.id === booking.resourceId);
      if (eq) {
        booking.allocatedUnitIds.forEach((uid) => {
          const u = eq.units.find((unit) => unit.id === uid);
          if (u && u.status === 'reserved') u.status = 'available';
        });
        this.recalculateEquipmentQuantities(eq.id);
      }
    }

    this.addNotification({
      userId: booking.userId,
      title: 'Booking Request Declined',
      message: `Your booking for ${booking.resourceName} was rejected. Reason: ${reason}`,
      type: 'error',
      linkTab: 'bookings',
    });

    this.addAuditLog({
      actorName: reviewerName,
      actorRole: this.currentUser.role,
      action: 'REJECTED_BOOKING',
      entityType: 'Booking',
      entityId: booking.id,
      details: `Declined booking ${booking.id}. Reason: ${reason}`,
    });

    this.notify();
  }

  // Equipment Check-out (Handover)
  public checkOutEquipment(
    bookingId: string,
    handoverData: {
      conditionRating: 1 | 2 | 3 | 4 | 5;
      conditionNotes: string;
      accessoriesChecked: { name: string; present: boolean }[];
      staffName: string;
    }
  ) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    booking.status = 'checked_out';
    const recordId = `chk-handover-${Date.now().toString().slice(-6)}`;
    booking.checkInRecordId = recordId;

    const record: CheckInOutRecord = {
      id: recordId,
      bookingId: booking.id,
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      unitIds: booking.allocatedUnitIds || [],
      type: 'handover',
      timestamp: new Date().toISOString(),
      performedBy: handoverData.staffName,
      borrowerName: booking.userName,
      conditionRating: handoverData.conditionRating,
      conditionNotes: handoverData.conditionNotes,
      accessoriesChecked: handoverData.accessoriesChecked,
    };

    this.checkIns.unshift(record);

    // Update equipment unit statuses
    const eq = this.equipment.find((e) => e.id === booking.resourceId);
    if (eq && booking.allocatedUnitIds) {
      booking.allocatedUnitIds.forEach((uid) => {
        const u = eq.units.find((unit) => unit.id === uid);
        if (u) {
          u.status = 'checked_out';
          u.currentBorrowerId = booking.userId;
          u.currentBookingId = booking.id;
        }
      });
      this.recalculateEquipmentQuantities(eq.id);
    }

    this.addNotification({
      userId: booking.userId,
      title: 'Equipment Handover Completed',
      message: `You have successfully checked out ${booking.resourceName}. Please return promptly before ${booking.endTime}.`,
      type: 'info',
      linkTab: 'handovers',
    });

    this.addAuditLog({
      actorName: handoverData.staffName,
      actorRole: this.currentUser.role,
      action: 'EQUIPMENT_HANDOVER',
      entityType: 'Equipment',
      entityId: booking.resourceId,
      details: `Dispatched units [${(booking.allocatedUnitIds || []).join(', ')}] to ${booking.userName}. Condition Rating: ${handoverData.conditionRating}/5`,
    });

    this.notify();
  }

  // Equipment Return & Inspection
  public returnEquipment(
    bookingId: string,
    returnData: {
      conditionRating: 1 | 2 | 3 | 4 | 5;
      conditionNotes: string;
      accessoriesChecked: { name: string; present: boolean }[];
      staffName: string;
      hasDiscrepancy: boolean;
      discrepancyDetails?: string;
    }
  ) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const recordId = `chk-return-${Date.now().toString().slice(-6)}`;
    booking.returnRecordId = recordId;

    const returnRecord: CheckInOutRecord = {
      id: recordId,
      bookingId: booking.id,
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      unitIds: booking.allocatedUnitIds || [],
      type: 'return',
      timestamp: new Date().toISOString(),
      performedBy: returnData.staffName,
      borrowerName: booking.userName,
      conditionRating: returnData.conditionRating,
      conditionNotes: returnData.conditionNotes,
      accessoriesChecked: returnData.accessoriesChecked,
      discrepancyReported: returnData.hasDiscrepancy,
    };

    this.checkIns.unshift(returnRecord);

    const eq = this.equipment.find((e) => e.id === booking.resourceId);

    if (returnData.hasDiscrepancy || returnData.conditionRating <= 2) {
      booking.status = 'return_pending_inspection';
      booking.incidentFlagged = true;

      // Flag an incident automatically
      this.reportIncident({
        category: returnData.conditionRating <= 2 ? 'Damaged Equipment' : 'Missing Components',
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        bookingId: booking.id,
        reporterName: returnData.staffName,
        reporterRole: this.currentUser.role,
        description: `Discrepancy on return: ${returnData.discrepancyDetails || returnData.conditionNotes}`,
        severity: returnData.conditionRating === 1 ? 'critical' : 'medium',
        assignedReviewer: 'Dr. Aris Thorne',
      });

      // Mark unit as needing attention
      if (eq && booking.allocatedUnitIds) {
        booking.allocatedUnitIds.forEach((uid) => {
          const u = eq.units.find((unit) => unit.id === uid);
          if (u) {
            u.status = 'in_maintenance';
            u.condition = 'Needs Attention';
          }
        });
        this.recalculateEquipmentQuantities(eq.id);
      }
    } else {
      // Clean return
      booking.status = 'completed';

      // Restore units to available
      if (eq && booking.allocatedUnitIds) {
        booking.allocatedUnitIds.forEach((uid) => {
          const u = eq.units.find((unit) => unit.id === uid);
          if (u) {
            u.status = 'available';
            u.currentBorrowerId = undefined;
            u.currentBookingId = undefined;
          }
        });
        this.recalculateEquipmentQuantities(eq.id);
      }
    }

    this.addAuditLog({
      actorName: returnData.staffName,
      actorRole: this.currentUser.role,
      action: returnData.hasDiscrepancy ? 'RETURN_FLAGGED_DISCREPANCY' : 'RETURN_INSPECTION_COMPLETED',
      entityType: 'Equipment',
      entityId: booking.resourceId,
      details: `Return recorded for ${booking.resourceName}. Condition: ${returnData.conditionRating}/5. Status: ${booking.status}`,
    });

    this.addNotification({
      userId: booking.userId,
      title: 'Return Processed',
      message: `Return recorded for ${booking.resourceName}. Condition verified: ${returnData.conditionRating}/5. Status: ${booking.status}.`,
      type: returnData.hasDiscrepancy ? 'warning' : 'success',
      linkTab: 'bookings',
    });

    this.notify();
  }

  // Complete return inspection for flagged bookings
  public completeInspection(bookingId: string, reviewerNotes: string) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    booking.status = 'completed';
    const eq = this.equipment.find((e) => e.id === booking.resourceId);
    if (eq && booking.allocatedUnitIds) {
      booking.allocatedUnitIds.forEach((uid) => {
        const u = eq.units.find((unit) => unit.id === uid);
        if (u) {
          u.status = 'available';
          u.condition = 'Good';
        }
      });
      this.recalculateEquipmentQuantities(eq.id);
    }

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'INSPECTION_CLEARED',
      entityType: 'Booking',
      entityId: booking.id,
      details: `Inspection cleared by ${this.currentUser.name}. Notes: ${reviewerNotes}`,
    });

    this.notify();
  }

  // Add / Create Laboratory
  public createLaboratory(data: Omit<Laboratory, 'id' | 'isPublished' | 'isAvailable'>): Laboratory {
    const id = `lab-${data.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newLab: Laboratory = {
      ...data,
      id,
      isPublished: true,
      isAvailable: true,
    };
    this.laboratories.push(newLab);

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'CREATED_LABORATORY',
      entityType: 'Laboratory',
      entityId: id,
      details: `Created laboratory ${data.name} (${data.code}) in ${data.buildingName}`,
    });

    this.notify();
    return newLab;
  }

  // Add Equipment
  public addEquipment(data: Omit<Equipment, 'id' | 'availableQuantity' | 'reservedQuantity' | 'checkedOutQuantity' | 'maintenanceQuantity' | 'units'>): Equipment {
    const id = `eq-${data.category.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const prefix = data.inventoryCode || 'EQ-DEV';
    const units = generateUnits(id, prefix, data.totalQuantity, data.totalQuantity, 0, 0, 0);

    const newEq: Equipment = {
      ...data,
      id,
      availableQuantity: data.totalQuantity,
      reservedQuantity: 0,
      checkedOutQuantity: 0,
      maintenanceQuantity: 0,
      units,
    };

    this.equipment.push(newEq);

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ADDED_EQUIPMENT',
      entityType: 'Equipment',
      entityId: id,
      details: `Added ${data.totalQuantity}x ${data.name} to ${data.laboratoryName}`,
    });

    this.notify();
    return newEq;
  }

  // Maintenance operations
  public setEquipmentMaintenance(equipmentId: string, isMaintenance: boolean, taskDetails?: string) {
    const eq = this.equipment.find((e) => e.id === equipmentId);
    if (!eq) return;

    eq.isUnderMaintenance = isMaintenance;
    if (isMaintenance) {
      eq.maintenanceQuantity = eq.totalQuantity - eq.checkedOutQuantity;
      eq.availableQuantity = 0;
      eq.units.forEach((u) => {
        if (u.status !== 'checked_out') u.status = 'in_maintenance';
      });

      if (taskDetails) {
        this.maintenance.unshift({
          id: `maint-${Date.now().toString().slice(-6)}`,
          equipmentId: eq.id,
          equipmentName: eq.name,
          unitIds: eq.units.map((u) => u.id),
          taskDescription: taskDetails,
          assignedStaff: this.currentUser.name,
          startDate: new Date().toISOString().split('T')[0],
          expectedEndDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
          status: 'in_progress',
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      eq.maintenanceQuantity = 0;
      eq.units.forEach((u) => {
        if (u.status === 'in_maintenance') u.status = 'available';
      });
      this.recalculateEquipmentQuantities(eq.id);
    }

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: isMaintenance ? 'MAINTENANCE_SCHEDULED' : 'MAINTENANCE_RESTORED',
      entityType: 'Equipment',
      entityId: eq.id,
      details: `${eq.name} status updated: ${isMaintenance ? 'Under Maintenance' : 'Available for Booking'}`,
    });

    this.notify();
  }

  // Incident reporting
  public reportIncident(data: {
    category: Incident['category'];
    resourceId: string;
    resourceName: string;
    bookingId?: string;
    reporterName: string;
    reporterRole: UserRole;
    description: string;
    severity: Incident['severity'];
    assignedReviewer: string;
  }): Incident {
    const incident: Incident = {
      id: `inc-${Date.now().toString().slice(-6)}`,
      ticketNumber: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      ...data,
      status: 'Reported',
      createdAt: new Date().toISOString(),
    };

    this.incidents.unshift(incident);

    this.addAuditLog({
      actorName: data.reporterName,
      actorRole: data.reporterRole,
      action: 'REPORTED_INCIDENT',
      entityType: 'Incident',
      entityId: incident.id,
      details: `Reported [${data.category}] on ${data.resourceName}: ${data.description.slice(0, 80)}`,
    });

    this.notify();
    return incident;
  }

  public resolveIncident(incidentId: string, notes: string) {
    const inc = this.incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    inc.status = 'Resolved';
    inc.reviewerNotes = notes;
    inc.resolutionTimestamp = new Date().toISOString();

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'RESOLVED_INCIDENT',
      entityType: 'Incident',
      entityId: inc.id,
      details: `Resolved ticket ${inc.ticketNumber}. Notes: ${notes}`,
    });

    this.notify();
  }

  public cancelBooking(bookingId: string, reason: string) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    booking.status = 'cancelled';
    booking.rejectionReason = `Cancelled: ${reason}`;

    // Release units
    if (booking.allocatedUnitIds && booking.resourceType === 'equipment') {
      const eq = this.equipment.find((e) => e.id === booking.resourceId);
      if (eq) {
        booking.allocatedUnitIds.forEach((uid) => {
          const u = eq.units.find((unit) => unit.id === uid);
          if (u && (u.status === 'reserved' || u.status === 'checked_out')) {
            u.status = 'available';
          }
        });
        this.recalculateEquipmentQuantities(eq.id);
      }
    }

    // Check if there are waitlisted bookings for this resource to promote
    const waitlisted = this.bookings.find(
      (b) => b.resourceId === booking.resourceId && b.date === booking.date && b.status === 'waitlisted'
    );
    if (waitlisted) {
      waitlisted.status = 'pending';
      waitlisted.waitlistPosition = undefined;
      this.addNotification({
        userId: waitlisted.userId,
        title: 'Waitlist Update: Slot Available!',
        message: `A cancelled reservation freed up ${waitlisted.resourceName} on ${waitlisted.date}. Your request is now pending instructor approval.`,
        type: 'success',
        linkTab: 'bookings',
      });
    }

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'CANCELLED_BOOKING',
      entityType: 'Booking',
      entityId: booking.id,
      details: `Cancelled reservation ${booking.id}. Reason: ${reason}`,
    });

    // Synchronize cancellation with user's Supabase account
    cancelBookingInSupabase(booking.id, reason).then((res) => {
      if (res.success) {
        this.supabaseSyncState.lastSyncedAt = new Date().toISOString();
      }
    });

    this.notify();
  }

  public cancelOrder(bookingId: string, reason: string) {
    this.cancelBooking(bookingId, reason);
  }

  private recalculateEquipmentQuantities(equipmentId: string) {
    const eq = this.equipment.find((e) => e.id === equipmentId);
    if (!eq) return;

    eq.availableQuantity = eq.units.filter((u) => u.status === 'available').length;
    eq.reservedQuantity = eq.units.filter((u) => u.status === 'reserved').length;
    eq.checkedOutQuantity = eq.units.filter((u) => u.status === 'checked_out').length;
    eq.maintenanceQuantity = eq.units.filter((u) => u.status === 'in_maintenance').length;
  }

  public markNotificationAsRead(notifId: string) {
    const n = this.notifications.find((item) => item.id === notifId);
    if (n) {
      n.isRead = true;
      this.notify();
    }
  }

  public markAllNotificationsAsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    this.notify();
  }

  private addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) {
    this.notifications.unshift({
      id: `notif-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notif,
    });
  }

  private addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    this.auditLogs.unshift({
      id: `aud-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...log,
    });
  }

  // Student Feature Methods
  public getProjectKitBundles(): ProjectKitBundle[] {
    return this.projectKits;
  }

  public getStudentSafetyModules(): StudentSafetyModule[] {
    return this.safetyModules;
  }

  public getSensorPinoutGuides(): SensorPinoutGuide[] {
    return this.pinoutGuides;
  }

  public completeSafetyQuiz(moduleId: string, score: number): boolean {
    const mod = this.safetyModules.find((m) => m.id === moduleId);
    if (!mod) return false;

    mod.status = 'passed';
    mod.score = score;
    mod.completedAt = new Date().toISOString().split('T')[0];

    // If tier 3 completed, update user safety badge
    if (mod.tier === 'Tier 3') {
      this.currentUser.safetyTrainingVerified = true;
    }

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Safety Certification Achieved!',
      message: `Congratulations! You scored ${score}% on ${mod.title}. New hardware has been unlocked.`,
      type: 'success',
      linkTab: 'student',
    });

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'SAFETY_QUIZ_COMPLETED',
      entityType: 'User',
      entityId: this.currentUser.id,
      details: `Passed safety module ${mod.title} with score ${score}%. Unlocked: ${mod.unlocks.join(', ')}`,
    });

    this.notify();
    return true;
  }

  public requestBookingExtension(bookingId: string, additionalHours: number, reason: string): boolean {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    // Calculate new end time
    const [startH, startM] = booking.startTime.split(':').map(Number);
    const newEndH = Math.min(18, startH + booking.durationHours + additionalHours);
    const newEndTime = `${String(newEndH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    
    booking.durationHours += additionalHours;
    booking.endTime = newEndTime;
    booking.additionalNotes = `${booking.additionalNotes || ''} [Extension +${additionalHours}h granted: ${reason}]`.trim();

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Custody Extension Granted',
      message: `Your booking for ${booking.resourceName} was extended by ${additionalHours} hr(s) until ${newEndTime}.`,
      type: 'success',
      linkTab: 'bookings',
    });

    this.addAuditLog({
      actorName: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'BOOKING_EXTENSION_GRANTED',
      entityType: 'Booking',
      entityId: booking.id,
      details: `Extended custody of ${booking.resourceName} by ${additionalHours}h until ${newEndTime}. Reason: ${reason}`,
    });

    this.notify();
    return true;
  }

  public bookProjectKitBundle(
    kitId: string,
    date: string,
    startTime: string,
    durationHours: number,
    purpose: string,
    teamUSNs: string[] = []
  ): { success: boolean; bookingIds: string[] } {
    const kit = this.projectKits.find((k) => k.id === kitId);
    if (!kit) return { success: false, bookingIds: [] };

    const bookingIds: string[] = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const endH = Math.min(18, startH + durationHours);
    const endTime = `${String(endH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;

    kit.equipmentIds.forEach((eqId) => {
      const eq = this.equipment.find((e) => e.id === eqId);
      if (!eq) return;

      const teamNote = teamUSNs.length > 0 ? ` [Team Members: ${teamUSNs.join(', ')}]` : '';
      const result = this.createBooking({
        resourceId: eq.id,
        resourceName: eq.name,
        resourceType: 'equipment',
        date,
        startTime,
        endTime,
        requestedQuantity: 1,
        purpose: `[${kit.title}] ${purpose}${teamNote}`,
        additionalNotes: `Auto-bundled kit component for ${kit.category}. Target course: ${kit.targetCourse}`,
      });

      if (result.booking) {
        bookingIds.push(result.booking.id);
      }
    });

    this.addNotification({
      userId: this.currentUser.id,
      title: 'Capstone Kit Order Submitted!',
      message: `All hardware for "${kit.title}" (${bookingIds.length} items) has been queued for faculty approval.`,
      type: 'success',
      linkTab: 'bookings',
    });

    this.notify();
    return { success: true, bookingIds };
  }

  // Supabase Cloud Storage Integration Methods
  public getSupabaseSyncState(): SupabaseSyncState {
    return { ...this.supabaseSyncState };
  }

  public async testSupabase() {
    return await testSupabaseConnection();
  }

  public async syncWithSupabase(): Promise<{ success: boolean; message: string }> {
    this.supabaseSyncState.status = 'syncing';
    this.notify();

    try {
      // 1. Fetch remote bookings from Supabase
      const remote = await fetchBookingsFromSupabase();

      if (remote.tablePending) {
        this.supabaseSyncState.status = 'table_pending';
        this.supabaseSyncState.errorMessage = 'Supabase table "bookings" has not been created yet.';
        this.notify();
        return {
          success: false,
          message: 'Connected to Supabase, but "bookings" table needs to be created in Supabase SQL editor.',
        };
      }

      if (remote.success && remote.bookings.length > 0) {
        // Merge remote bookings into local list
        const localMap = new Map(this.bookings.map((b) => [b.id, b]));
        remote.bookings.forEach((rb) => {
          localMap.set(rb.id, rb);
        });
        this.bookings = Array.from(localMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      // 2. Upload any local bookings to Supabase to keep remote in full sync
      const uploadRes = await syncAllBookingsToSupabase(this.bookings);
      if (uploadRes.tablePending) {
        this.supabaseSyncState.status = 'table_pending';
        this.supabaseSyncState.errorMessage = 'Table "bookings" pending creation in Supabase SQL editor.';
        this.notify();
        return {
          success: false,
          message: 'Table "bookings" does not exist yet. Please run the provided SQL in Supabase Dashboard.',
        };
      }

      this.supabaseSyncState.status = 'connected';
      this.supabaseSyncState.lastSyncedAt = new Date().toISOString();
      this.supabaseSyncState.totalSynced = this.bookings.length;
      this.supabaseSyncState.errorMessage = null;
      this.notify();

      return {
        success: true,
        message: `Successfully synchronized ${this.bookings.length} booking records with Supabase project nozotfhooeqhetjhtjmr.`,
      };
    } catch (err: any) {
      this.supabaseSyncState.status = 'error';
      this.supabaseSyncState.errorMessage = err?.message || 'Sync failed';
      this.notify();
      return {
        success: false,
        message: err?.message || 'Failed to sync with Supabase',
      };
    }
  }

  public async initSupabaseSync() {
    try {
      // Probe connectivity non-blockingly
      const probe = await testSupabaseConnection();
      if (!probe.connected) {
        this.supabaseSyncState.status = 'disconnected';
        this.supabaseSyncState.errorMessage = probe.message;
        this.notify();
        return;
      }

      if (!probe.tableExists) {
        this.supabaseSyncState.status = 'table_pending';
        this.supabaseSyncState.errorMessage = 'Supabase connected. Please create "bookings" table via SQL editor.';
        this.notify();
        return;
      }

      // Table exists - trigger initial 2-way sync
      await this.syncWithSupabase();
    } catch (e: any) {
      this.supabaseSyncState.status = 'disconnected';
      this.supabaseSyncState.errorMessage = e?.message;
      this.notify();
    }
  }
}

export const campusStore = new CampusStore();
