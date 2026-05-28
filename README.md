# QuantumCalc 🎛️

**QuantumCalc** is a high-density, single-page calculator application featuring a luxurious glassmorphic dashboard layout with a dark theme. Perfect for finance engineers, developers, and keyboard enthusiasts, it combines standard arithmetic functionality with an immersive, tactile digital retro-futuristic workspace.

---

## 🌟 Visual & Interactive Features

### 1. High-Density Quantum Dashboard
* **Dynamic OLED Screen**: Displays formatted large numerical outputs, real-time expression trails (equations), active computation memory indicators (`ACC`), and live processor status lights.
* **Calculation History Tape Deck**: Displays previous calculation logs of the current session. Click on any item to instantly restore it back to the active calculator display screen.
* **Hardware Memory Registers**: A dedicated high-density visual component tracking:
  * `M1`: Stored active accumulator values.
  * `M2`: Peak positive score/outcome calculated during the user session.
  * `M3`: Physical keypress registry log.
  * `M4`: Operational audio engine indicator.
* **Processor Telemetry Footer**: Monitored stats simulating processor states (`IDLE`, `COMPUTING`, `HALTED`), elapsed session clocks, dynamic heap allocations, and thread routing.
* **Cosmic Slated Background**: Drifting cosmic visual orbs and technical grid alignment grids.

### 2. Tactile Synthetic Sound Experience
* **Dynamic Web Audio API**: Utilizes raw browser oscillators to generate low-latency high-tech haptic tones (with quick click ticks, warning signals, and pleasant flush/clean sweeps) without loading heavy external sound files. This can be muted dynamically inside the header dashboard.

### 3. Safety Bounds & Error Architecture
* **Intelligent Decimal Validation**: Seamlessly intercepts double decimal points.
* **Division by Zero Protection**: Gracefully halts execution, fires custom low-frequency warning tones, activates visual shake animations, and displays literal humans warnings ("Cannot divide by 0").
* **Digit Font Scaling**: Automatically shrinks layout text as lengths expand, keeping long values beautifully visible without breaking CSS margins.

---

## ⌨️ Physical Keybinding Mappings

Control the calculator directly from your hardware keyboard:

| Physical Key | UI Command Trigger |
| :--- | :--- |
| **`0` – `9`** | Input numeric digits |
| **`.`** / **`,`** | Append fractional decimal point |
| **`+`** | Select Addition operation |
| **`-`** | Select Subtraction operation |
| **`*`** / **`x`** | Select Multiplication operation |
| **`/`** | Select Division operation |
| **`%`** | Immediate decimal percentage conversion |
| **`Enter`** / **`=`** | Evaluate calculation pipeline |
| **`Backspace`** | Delete last typed character symbol |
| **`Escape`** / **`c`** / **`C`** | Flush/Clear computation session state |

---

## 🛠️ Stack and Architecture

* **Framework**: React 19 (Functional Hooks & State Managers).
* **Language Support**: TypeScript (Robust type-safety and interfaces).
* **Styling**: Tailwind CSS v4 (Full glassmorphism filters, keyframe drifts, and custom layouts).
* **Icons**: Lucide React.
* **Physical Audio**: Synthesized HTML5 Web Audio Context API.
