<p align="center">
  <img src="media/banner.svg" width="600" alt="Brekkie Beacon Banner">
</p>

# 🥣 Brekkie Beacon: Automatic DIY Pet Feeder

**Brekkie Beacon** is an IoT-based automatic pet feeding solution. By retrofitting a standard manual cereal dispenser with a stepper motor and a Raspberry Pi, this system provides a robust, web-controlled way to manage your pet's meals. 
The software utilizes a modern stack to ensure real-time communication and reliable scheduling, all manageable from any device on your local network.


## 🌟 Key Features
* **Flexible Scheduling:** Fully configurable feeding schedules managed via the web dashboard. 
* **Real-Time Control:** Trigger a manual dispense or flash the indicator LEDs instantly from any browser.
* **Web Dashboard:** A responsive Next.js frontend communicating with an ASP.NET backend.
* **Dockerized Deployment:** Simple one-command setup using Docker Compose.


## 🛠️ System Architecture

* **Backend:** ASP.NET Core Application using `System.Device.Gpio` for hardware control.
* **Frontend:** Next.js Client Application.
* **Scheduler:** Quartz.NET for reliable cron-based feeding cycles.
* **Real-Time:** SignalR for instant hardware-to-UI communication.
* **Infrastructure:** Multi-container Docker environment.

## 🔌 Hardware Setup

### Bill of Materials
* **Controller:** Raspberry Pi 4 Model B (Tested with Rev 1.5).
* **Motor:** Stepper Motor (e.g. Nema23—*Note: This is an example and may be overpowered; smaller motors can be used*).
* **Driver:** Stepper Motor Driver (e.g. TB6600—*Note: Match this to your chosen motor*).
* **Dispenser:** Wall-mounted cereal dispenser (e.g., [this model](https://www.amazon.de/-/en/kangten-Dispenser-Mounted-Kitchen-Cornflakes/dp/B09LM9TDH1)).
* **Power:** Raspberry Pi Power Supply + Dedicated Stepper Motor Power Supply.
* **Mechanical:** Shaft coupler, (3D-printed) casing, and custom internal drive screw.
* **Optional:** 4x LEDs and corresponding resistors.

### Assembly Instructions
1.  **Mechanical:** Unscrew the manual handle from the cereal feeder. Insert a screw into the paddle mechanism and connect it to the stepper motor using the shaft coupler.
2.  **Housing:** Mount the motor and dispenser assembly into the 3D-printed casing.
3.  **Wiring:** Connect the stepper motor to the TB6600 driver, then wire the driver and optional LEDs to the Raspberry Pi GPIO pins using the diagram below.

### Pinout Configuration (BCM)
> [!IMPORTANT]  
> The software uses the **BCM pin numbering scheme**. Ensure your jumper cables are connected to the correct physical pins based on the BCM mapping.

**Motor Driver (TB6600)**
| Function | BCM Pin | Physical Pin |
| :--- | :--- | :--- |
| **Direction (DIR)** | GPIO 26 | Pin 37 |
| **Step (PUL)** | GPIO 19 | Pin 35 |
| **Enable (EN)** | GPIO 13 | Pin 33 |

**Indicator LEDs (Optional)**
| LED | BCM Pin | Physical Pin |
| :--- | :--- | :--- |
| LED 1 | GPIO 21 | Pin 40 |
| LED 2 | GPIO 20 | Pin 38 |
| LED 3 | GPIO 16 | Pin 36 |
| LED 4 | GPIO 12 | Pin 32 |

## 🚀 Software Installation

### 1. Prerequisite
Ensure Docker and Docker Compose are installed on your Raspberry Pi.

### 2. Deployment
Clone the repository and run the production profile:

```bash
git clone http://github.com/new-er/brekkie-beacon.git
docker compose --profile prod up -d
```
## 3. Usage

<p align="center">
  <img src="media/website-screenshot.png" width="800" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
</p>

Once the containers are running, access the web interface at the IP address of your Raspberry Pi.
Within the dashboard, you can:
- Feeding Times: The application defaults to four daily auto-feeding times, which can be modified directly in the UI.
- Manual Trigger: Use the dashboard to dispense food manually or test the LED indicators.
- View Logs: Check the backend logs for real-time feedback on motor actions and schedule executions.

---

<p align="center"><i>"Kibble in the bin, Docker for the win—let the stepper motor spin."</i></p>
