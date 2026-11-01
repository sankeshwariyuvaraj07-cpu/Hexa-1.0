# CAMPUSSHARE — PROJECT ARCHITECTURE & DESIGN DOCUMENT
## Complete Full-Stack Resource Sharing and Laboratory Management Platform
### CodeVerse India 2026 Hackathon

---

## 1. Problem Statement

Across higher education institutions and polytechnics, laboratories house expensive research-grade instrumentation (e.g. 100MHz oscilloscopes, RF spectrum analyzers, FPGA trainer benches, 3D printers) that operate at low average utilization (often under 30% of available weekly hours). Simultaneously, undergraduate and postgraduate students working on capstone hardware projects, IoT prototypes, and competitive engineering hackathons face severe hardware bottlenecks because individually purchasing or privately renting instrumentation is cost prohibitive.

Legacy paper logbooks and ad-hoc email requests suffer from critical systemic flaws:
1. **Resource Hoarding**: Influential project groups monopolize high-demand test benches.
2. **Double Booking Conflicts & Disputed Custody**: Lack of transactional state results in overlapping bookings.
3. **Missing or Damaged Accessories**: Components (probes, adapters, cables) disappear without before-and-after audit trails.
4. **Safety & Compliance Risks**: Untrained students operating high-voltage or RF equipment without certified training verification.

---

## 2. Target Users

1. **Students & Student Researchers**: Need fair, friction-free discovery and reservation of laboratory benches and specialized hardware tools.
2. **Instructors & Faculty Directors**: Need centralized authority over laboratory capacities, operating hours, safety mandates, and request approvals.
3. **Laboratory Technicians**: Require physical check-in/out workflows, accessory checklists, condition audits, and calibration scheduling.
4. **Institution Deans & Department Managers**: Need macro-level capacity utilization analytics, cross-department visibility, and audit accountability.
5. **System Administrators**: Require secure platform isolation, immutable audit trails, and role governance.

---

## 3. Selected Use Case: ABC Engineering College

The demonstration environment is configured for **ABC Engineering College**, with primary focus on the **Electronics and Communication Engineering (ECE)** department.

### Department & Facilities Hierarchy:
- **Electronics and Communication Engineering**:
  - *Analog Electronics Laboratory (ECE-LAB-101)*: Keysight 100MHz Dual-Channel DSOs, Tektronix 25MHz Arbitrary Function Generators, True RMS Multimeters.
  - *Embedded Systems & IoT Laboratory (ECE-LAB-203)*: Arduino Uno R3 kits, ARM Cortex development boards, sensor packs.
  - *Digital Electronics & Logic Design Lab (ECE-LAB-102)*: Modular digital trainers, triple-output DC power supplies.
  - *Communication Systems Laboratory (ECE-LAB-301)*: RF spectrum analyzers, SDR transceivers.
  - *VLSI & Microelectronics Design Center (ECE-LAB-305)*: CAD workstations for IC design.
- **Computer Science & Engineering**: Advanced Programming & AI Lab (RTX GPU clusters).
- **Mechanical Engineering**: Precision Manufacturing & Rapid Prototyping Workshop (Dual-extrusion 3D printers).

---

## 4. FairShare™ Allocation Engine Design

CampusShare enforces a non-discriminatory, explainable allocation model that prioritizes safety first, followed by mathematical fairness:

$$\text{Priority Score} = 0.50 \times \text{Past Usage Factor} + 0.30 \times \text{Waiting Factor} + 0.20 \times \text{Need Factor}$$

### Factor Details:
- **Recent Resource Usage (50% weight, max 50 points)**:
  $$\text{Past Usage Factor} = \max(10, 50 - (\text{Active/Recent Bookings} \times 6))$$
  Students who have not borrowed equipment in the recent cycle receive up to 50 points, mathematically preventing hoarding.
- **Waiting & Notice Time (30% weight, max 30 points)**:
  $$\text{Waiting Factor} = \min(30, 15 + (\text{Advance Days} \times 3))$$
  Requests made with advance planning or entries that have waited in the queue receive increased weighting.
- **Academic Need Score (20% weight, max 20 points)**:
  Scored on explainable academic milestones (Capstone projects, thesis deadlines, or laboratory practical examinations receive 18–20 points).

### Waiting List Promotion:
When any student or faculty member cancels an existing booking, the engine automatically re-evaluates the highest-scoring waitlisted request, promotes it to pending review, and dispatches an instant notification.

---

## 5. Physical Handover & Before-and-After Condition Auditing

A critical innovation in CampusShare is the **Custody Verification Protocol**:
1. **Handover (Check-Out)**:
   - Technicians verify borrower identity (Student ID).
   - Technicians audit specific included accessories (e.g. 2x 100MHz probes, ground leads, power cords).
   - Baseline condition rated (1–5 stars) with physical inspection notes.
   - Transitions booking to `checked_out` and marks serialized unit as in-use.
2. **Return & Inspection**:
   - Return timestamp recorded.
   - Final condition rating (1–5 stars) and return accessories verified.
   - **Discrepancy Detection**: If components are missing or condition drops by $\ge 2$ stars, an incident ticket is automatically generated, the unit is held in `return_pending_inspection`, and faculty review is prompted.
   - Clean returns automatically restock inventory units to `available`.

---

## 6. Three.js Procedural 3D Workbench

CampusShare features a high-fidelity 3D laboratory workbench adhering to the Three.js skill guidelines:
- **Procedural composite geometries**:
  - *Digital Storage Oscilloscope*: 8-part mesh (chassis, LCD bezel, procedural canvas screen with animated waveforms, carry handle, 4 BNC connectors, rotary knobs, illuminated pushbutton, non-slip feet).
  - *Arbitrary Function Generator*: 6-part mesh (chassis, 7-segment frequency readout display, jog wheel, dual BNC jacks).
  - *Arduino Development Board*: 7-part mesh (blue PCB, ATmega IC, header pin rows, USB jack, DC barrel jack, blinking TX/RX LEDs).
- **Lighting & Material Realism**: `PMREMGenerator` + `RoomEnvironment` for studio reflections; warm key light and cool fill light.
- **Mouse Parallax Motion**: Smooth exponential damping (`MathUtils.damp`) reacting to cursor coordinates.
- **Unified Bottom Control Dock**: Zero viewport occlusion layout featuring presets, turntable rotation, exploded assembly view, and signal waveform selection.

---

## 7. Security and Privacy

- **Row Level Security (RLS)**: Enforced via PostgreSQL schema.
- **Role Isolation**: Public registration restricted to Student roles. Privileged Instructor, Technician, and Manager roles require authorized credential provisioning.
- **Audit Logs**: Tamper-proof, append-only transaction logs. Ordinary users cannot edit or delete audit records.
- **Zero Secrets in Browser**: Privileged database keys are never exposed in client bundles.

---

## 8. Summary of Completed Deliverables

1. Full React 19 + TypeScript + Vite responsive web application.
2. Complete Dark Mode toggle with seamless theme transitions.
3. Interactive 3D Three.js laboratory canvas with mouse reaction.
4. Comprehensive laboratory creation & management console.
5. Authoritative equipment inventory with serialized unit tracking.
6. FairShare™ allocation engine with explainable scoring.
7. Handover and return inspection station with condition reports.
8. Preventative maintenance & incident management ticketing.
9. Utilisation analytics powered by Recharts.
10. Immutable audit history.
11. 18-step interactive demonstration walkthrough runner.
12. Full PostgreSQL schema with RLS policies and documentation.
