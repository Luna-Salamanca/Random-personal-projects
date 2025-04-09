# Discord Heart Rate Bot

A simple Discord bot that displays a live heart rate in its status, using data pulled from the [Pulsoid API](https://pulsoid.net/). Includes a slash command to check your current heart rate and logs everything for analysis.

---

## Features

- Real-time heart rate updates every 10 seconds via Pulsoid API
- Bot displays the current BPM in its Discord status
- `/current_heart_rate` slash command to check the BPM in chat
- Handles offline/no data gracefully with a 💀 icon
- Automatically logs all updates and errors to `heart_rate.log`

---

## Setup

### 1. Clone the project

```bash
git clone https://github.com/yourusername/discord-heart-rate-bot.git
cd discord-heart-rate-bot
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

**`requirements.txt`**
```txt
discord.py
requests
```

### 3. Configure your environment

Create a `config.py` file and add the following variables:

```python
# config.py

PULSOID_API_KEY = "your-pulsoid-api-key"
DISCORD_TOKEN = "your-discord-bot-token"
PULSOID_API_URL = "https://dev.pulsoid.net/api/v1/data/heart_rate/latest"
YOUR_APP_ID = 123456789012345678  # Replace with your Discord app's ID
```


---

## Running the Bot

Once configured, run the bot with:

```bash
python pulsoid_hr.py
```

The bot will:
- Set its status to `{BPM} BPM ❤️` or `0 BPM 💀`
- Respond to `/current_heart_rate` with a live reading

---

## Example

**Bot Status:** `85 BPM ❤️`

**Slash Command Response:**
```
Current Heart Rate: 85 BPM ❤️
```

---

## 🛠 Developer Notes

- Status updates every 10 seconds (adjustable in `await asyncio.sleep(10)`)
- If heart rate is unchanged for 1 minute or the watch goes offline, it shows `0 BPM 💀`
- Logs to `heart_rate.log` for debugging and historical data

---