# CampusShare — Laboratory & Equipment Resource Sharing Platform
### CodeVerse India 2026 Hackathon

CampusShare is a full-stack, enterprise-grade laboratory management and resource-sharing platform engineered for colleges, universities, research centers, and makerspaces.

Institutions frequently own high-value scientific instrumentation and facilities that remain idle, while students, researchers, and multidisciplinary project teams lack access because purchasing or renting equipment is prohibitive. CampusShare solves this problem through an accountable, safe, and transparent digital custody lifecycle.

---

## 🚀 Key Features

1. **Interactive 3D Procedural Laboratory Workbench**:
   - Built with Three.js r160+ and WebGL2.
   - Procedural 3D models (3–12 parts per instrument) of a 4-channel Digital Storage Oscilloscope with animated glowing phosphor screen, Arbitrary Waveform Generator with LCD frequency display, and Arduino/Embedded microcontroller development board.
   - Parallax camera motion responding to mouse coordinates with exponential spring damping.
   - Unified collapsible bottom control dock (zero viewport occlusion) supporting turntable rotation, exploded component view, signal waveform selection (Sine, Square, Pulse, Noise), and camera focal presets.
   - Studio lighting reflections powered by `PMREMGenerator` and `RoomEnvironment`.

2. **Enterprise Academic Hierarchy**:
   - Institution → Department → Laboratory / Facility → Serialized Inventory Unit.
   - Demonstrated on **ABC Engineering College** and its **Electronics and Communication Engineering (ECE)** department, alongside Computer Science and Mechanical Engineering facilities.

3. **Laboratory Management**:
   - Facility registration with capacity limits, building/floor/room tracking, daily operating hours, buffer intervals between reservations, and eligible student groups.
   - Prerequisites enforcement (e.g. ESD protection, soldering safety, Cleanroom etiquette, faculty supervision).

4. **Authoritative Equipment Inventory**:
   - Real quantity calculations derived from authoritative unit records: Total, Available, Reserved, Checked Out, and Maintenance.
   - Serialized inventory unit registry (`OSC-ANA-001`, `ARD-EMB-008`), tracking physical condition and current custody.
   - Support for 10 Arduino Kits, 5 Digital Storage Oscilloscopes, 5 Function Generators, 10 Digital Multimeters, 8 Power Supplies, Trainer Kits, and 3D Printers.

5. **FairShare™ Allocation Engine**:
   - Transparent, explainable priority scoring (0–100):
     - **Recent Resource Usage (50%)**: Prevents resource monopolization; students with infrequent recent borrowing receive higher priority scores.
     - **Waiting & Notice Time (30%)**: Normalizes reservation notice period and queue duration.
     - **Academic Need Score (20%)**: Recognizes verified capstone milestones, thesis deadlines, or exam sessions.
   - Automated waiting list with instant reconsideration upon booking cancellations.

6. **Check-In & Check-Out Handover Station**:
   - Physical handover audit: Technicians inspect accessories (probes, power leads, USB cords) and log baseline 5-star condition ratings before dispatch.
   - Return & inspection workflow: Return condition is verified against handover audit records.
   - Discrepancy flagging: Discrepancies immediately create condition reports and route tickets to faculty review without punitive algorithmic penalties.

7. **Preventative Maintenance & Incident Management**:
   - Dedicated modules for scheduling periodic calibration, repair tasks, and ISO/IEC 17025 compliance checks.
   - Scheduled maintenance locks take equipment out of student booking circulation immediately.
   - Auditable incident tickets (late returns, hardware faults, safety concerns) with resolution notes.

8. **Resource Utilisation Analytics & Audit Trail**:
   - Interactive charts (Recharts) visualizing equipment utilization %, laboratory demand by facility code, and reservation status breakdowns.
   - Immutable audit trail recording every laboratory creation, reservation submission, faculty approval, handover, return inspection, and maintenance operation.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons, Recharts.
- **3D Graphics**: Three.js, RoomEnvironment, OrbitControls.
- **Backend & Database**: Supabase, PostgreSQL, Row Level Security (RLS) policies.
- **State Architecture**: Reactive event-driven store with persistent browser storage and real-time subscriber re-renders.

---

## 💻 Local Development Setup

### 1. Clone repository & install dependencies:
```bash
npm install
```

### 2. Run local development server:
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 3. Production build & validation:
```bash
npm run build
npm run lint
```

---

## 🔐 Demonstration Personas

CampusShare includes an instant persona switcher located in the top-right user menu to evaluate role-specific workflows:

| Role | Persona Name | Role Scope |
|---|---|---|
| **Student** | Sankeshwari Yuvaraj | ECE Final Year; searches equipment, checks eligibility, books slots, monitors waiting list. |
| **Instructor** | Dr. Aris Thorne | ECE Lab Director; creates labs, configures hours, reviews FairShare™ requests, approves/rejects bookings. |
| **Technician** | Rajesh Kumar | Senior Lab Tech; conducts physical handovers, audits accessories, inspects returns, logs maintenance. |
| **Institution Manager** | Dr. Meera Nambiar | Dean of Academic Resources; oversees department capacity, resolves escalated incidents, reviews utilization analytics. |
| **System Admin** | Prof. Vikram Joshi | Campus Infrastructure; reviews audit trails and global system configurations. |

---

## 🗄️ Supabase PostgreSQL Setup & Migrations

CampusShare includes a complete production SQL migration script in `/src/services/supabase.ts`.

To deploy with Supabase:
1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of `SUPABASE_SQL_MIGRATION` (located in `/src/services/supabase.ts`) and click **Run**.
4. Set environment variables in your deployment settings:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

*Note*: If external Supabase credentials are not provided, CampusShare automatically runs in Local Demonstration Mode with 100% feature and state parity.

---

## 🧪 Automated Testing & Verification

CampusShare has been verified across:
- TypeScript static compilation (`npm run lint` / `tsc --noEmit`).
- Production bundle optimization (`npm run build`).
- End-to-end 18-stage demonstration walkthrough executable via the top-bar **Interactive Demo Runner**.
