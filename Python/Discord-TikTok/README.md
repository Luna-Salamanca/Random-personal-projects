# Discord TikTok Downloader Bot

This bot listens for TikTok links posted in a Discord channel, downloads the corresponding video using [yt-dlp](https://github.com/yt-dlp/yt-dlp), and sends the video back to the channel. The bot is designed to work seamlessly by resolving any shortlinks for TikTok URLs and providing user feedback during the process.

## Overview

The Discord TikTok Downloader Bot performs the following tasks:

- **Monitors Chat:** Listens for new messages in channels and scans for TikTok links.
- **URL Resolution:** Checks for shortened TikTok URLs and resolves them to their full versions.
- **Video Downloading:** Utilizes the `yt-dlp` library to download videos from TikTok.
- **User Interaction:** Sends a temporary processing message and, after successfully downloading, posts the video file.
- **Cleanup:** Deletes temporary files and removes the original message to keep the channel tidy.
- **Logging:** Uses Python’s built-in logging to record actions and errors for easier debugging.

## Features

- **Auto-detection:** Automatically detects TikTok URLs in user messages.
- **Link resolution:** Handles URL redirection for shortened TikTok links.
- **Robust error handling:** Provides clear error messages in case of download failures.
- **Temporary file management:** Generates unique filenames for downloads and deletes them after use.
- **Easy configuration:** Uses environment variables to securely store sensitive information like the Discord token.

## Prerequisites

- **Python 3.x** installed on your system.
- A Discord account with a server where the bot will operate.
- A registered Discord bot with its token.
- The following Python packages:
  - [discord.py](https://discordpy.readthedocs.io/en/stable/)
  - [yt-dlp](https://github.com/yt-dlp/yt-dlp)
  - [requests](https://docs.python-requests.org/en/latest/)
  - [python-dotenv](https://saurabh-kumar.com/python-dotenv/)
  - Standard libraries: `os`, `logging`, `re`, `uuid`, `datetime`

## Setup and Installation

1. **Clone or download the repository:**

   ```bash
   git clone https://your.repo.url/discord-tiktok-bot.git
   cd discord-tiktok-bot
   ```

2. **Create and activate a virtual environment (optional but recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install dependencies:**

   You can install the required packages by running:
   
   ```bash
   pip install discord.py yt-dlp requests python-dotenv
   ```

4. **Configure Environment Variables:**

   Create a `.env` file in the project directory with the following content:
   
   ```dotenv
   DISCORD_TOKEN=your_discord_bot_token_here
   ```

   Replace `your_discord_bot_token_here` with your bot’s actual token. The bot uses this token to authenticate with Discord.

## Usage

1. **Run the Bot:**

   Once everything is set up, launch the bot by running:
   
   ```bash
   python your_bot_filename.py
   ```
   
   The bot will log a message indicating that it’s logged in (e.g., `Logged in as <BotName>`).

2. **Using the Bot on Discord:**

   - Post any message containing a TikTok URL in a channel where the bot has access.
   - The bot will detect the TikTok link, resolve shortened URLs if necessary, and send a temporary "processing" message.
   - After downloading the video using `yt-dlp`, the bot will send the video file to the channel.
   - Finally, the bot deletes the original message (and the processing message) to maintain channel cleanliness.

## Code Structure

- **Environment Setup:**
  - Loads the Discord token from a `.env` file using `python-dotenv` to keep credentials secure.
  
- **Logging:**
  - Configured at the INFO level to track successful actions and provide debugging output.

- **Discord Client Configuration:**
  - Uses the `discord.Client` with message content intent enabled to monitor messages in real time.

- **Events:**
  - `on_ready`: Logs a message when the bot has successfully connected to Discord.
  - `on_message`: Checks every message for TikTok URLs, processes the link, downloads the video, and manages cleanup.

- **Downloading Mechanism:**
  - **URL Matching:** Uses a regular expression to find TikTok URLs.
  - **URL Resolution:** If a shortened URL is found, the bot resolves it with a `requests.head` call.
  - **Download Process:** Uses `yt_dlp` to download the TikTok video into a uniquely named file (using `uuid`).
  - **Cleanup:** Deletes the original temporary file from the system once the download and upload process is complete.

## Error Handling

- The bot provides user feedback if errors occur during URL resolution or video download.
- Logging is used to capture exceptions, which helps in troubleshooting any issues that might arise during its execution.

