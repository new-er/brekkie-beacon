<p align="center">
  <img src="media/banner.svg" width="600" alt="Brekkie Beacon Banner">
</p>

# 🥣 Brekkie Beacon: Automatic DIY Pet Feeder

**Brekkie Beacon** is an IoT-based automatic pet feeding solution. By retrofitting a standard manual cereal dispenser with a stepper motor and a Raspberry Pi, this system provides a robust, web-controlled way to manage your pet's meals. 
The software utilizes a modern stack to ensure real-time communication and reliable scheduling, all manageable from any device on your local network.

<p align="center">
  <img src="media/website-screenshot.png" width="800" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
</p>

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
* **Controller:** Raspberry Pi (Tested with Pi 4 Model B Rev 1.5) 
* **Motor:** Stepper Motor (e.g. Nema23—*Note: This is an example and may be overpowered; smaller motors can be used*).
* **Driver:** Stepper Motor Driver (e.g. TB6600—*Note: Match this to your chosen motor*).
* **Dispenser:** Any standard cereal dispenser will work. I originally designed this for a *standing* model (which is currently hard to find), so the example link below is for a **wall-mounted** version. 
  * [Example Dispenser Model](https://www.amazon.de/-/en/kangten-Dispenser-Mounted-Kitchen-Cornflakes/dp/B09LM9TDH1) 
  * *Note: If using the wall-mounted version, some 3D-modeled adaptations will be required.*
* **Power:** Raspberry Pi Power Supply + Dedicated Stepper Motor Power Supply.
* **Mechanical:** Shaft coupler, (3D-printed) casing (see [models folder](./models)), and custom internal drive screw.
* **Optional:** 4x LEDs and corresponding resistors.

### 🖨️ 3D Printing
The main enclosure houses the electronics and aligns the motor with the dispenser. You can find the STL file in the [**/models folder**](./models).

| Part | File | Purpose |
| :--- | :--- | :--- |
| **(Base) Casing** | `casing.stl` | Protective housing with integrated food bowl area and motor-to-dispenser alignment. |

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

### 1. Prerequisites
- Docker & Docker Compose: Installed on your Raspberry Pi.
- GPIO Access: The container uses /dev/gpiomem to access the Pi's pins without requiring full root/privileged mode.

### 2. Clone the Repository
Clone the repository to your local machine:
```bash
git clone [http://github.com/new-er/brekkie-beacon.git](http://github.com/new-er/brekkie-beacon.git)
cd brekkie-beacon
```

Copy and paste the following into your .env file:

```
# --- System Settings ---
# Find your timezone here: [https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
TIMEZONE=Europe/Amsterdam
PIN_MODE=prod
DATABASE_PATH=/data

# --- Networking ---
# Update ALLOWED_ORIGINS if accessing from a specific domain
ALLOWED_ORIGINS=http://localhost:3000
# Update API_BASE_URL to your Pi's IP (e.g., [http://192.168.1.50:5098](http://192.168.1.50:5098)) 
# so the browser can reach the backend.
API_BASE_URL=http://localhost:5098
```

### 4. Deployment
Run the production profile to start the services:
```bash
docker compose --profile prod up -d
```

### 5. Usage
Once the containers are running, access the web interface at the IP address of your Raspberry Pi. Within the dashboard, you can:
- **Feeding Times:** The application defaults to four daily auto-feeding times, which can be modified directly in the UI.
- **Manual Trigger:** Use the dashboard to dispense food manually or test the LED indicators.
- **View Logs:** Check the backend logs for real-time feedback on motor actions and schedule executions.

## Status
Current Status: 🟢 Stable and feeding one very happy cat.
Contributions, bug reports and PRs always welcome!
