# Discord Message Scraper

This script is designed to extract messages from specified Discord channels and export them into a JSON file. It leverages the Discord API to fetch chat history, tracks progress using a command-line progress bar (via `tqdm`), and saves the scraped data in a structured JSON format within your Documents folder.

## Overview

The script performs the following tasks:

- **Environment Setup:**  
  Loads configuration details such as the Discord bot token and channel IDs from a separate configuration file (`config.py`).

- **Export Path Configuration:**  
  Creates a directory and a unique filename within the user's Documents folder to store the scraped messages, formatted with a timestamp.

- **Discord Bot Initialization:**  
  Uses the Discord Python library with appropriate intents (message content, guilds, and members) to connect the bot and access channels.

- **Message Scraping:**  
  Iterates over each specified channel, retrieving the full history of messages. For each message, it records:
  - Channel name
  - Author of the message
  - Message content
  - Timestamp (in ISO format)

- **Progress Reporting:**  
  Uses `tqdm` to display a progress bar for each channel, giving live feedback on the number of messages processed.

- **Data Export:**  
  Writes the collected messages into a JSON file in the designated export path, with proper formatting for easy readability.

- **Cleanup:**  
  After completion, prints a summary of the total messages scraped and the file location, then gracefully closes the Discord client.

## Prerequisites

To run this script, ensure you have:

- **Python 3.x** installed on your machine.
- The following Python packages:
  - [discord.py](https://discordpy.readthedocs.io/en/stable/) – For connecting and interacting with Discord.
  - [tqdm](https://github.com/tqdm/tqdm) – For displaying progress bars.
- A configuration file (`config.py`) that includes:
  - `DISCORD_TOKEN`: Your Discord bot token.
  - `CHANNEL_IDS`: A list of channel IDs from which you want to scrape messages.

## Setup and Installation

1. **Clone or Download the Repository:**

   ```bash
   git clone https://your.repo.url/discord-message-scraper.git
   cd discord-message-scraper
   ```

2. **Create a Virtual Environment (Optional but Recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. **Install Dependencies:**

   Install the required packages using pip:

   ```bash
   pip install discord.py tqdm
   ```

4. **Configure `config.py`:**

   Create or update the `config.py` file in the project directory with your bot token and the list of channel IDs. For example:

   ```python
   DISCORD_TOKEN = 'your_discord_bot_token'
   CHANNEL_IDS = [123456789012345678, 987654321098765432]
   ```

## How It Works

1. **Running the Script:**

   Execute the script using Python:

   ```bash
   python your_script_filename.py
   ```

2. **Bot Operation:**

   - When the bot connects, the `on_ready` event fires and the script begins iterating over each channel ID specified in the configuration.
   - For each channel, it checks if the channel exists. If a channel is not found, a warning is displayed, and the script moves to the next channel.
   - A progress bar is shown (using `tqdm`) while messages are being scraped from each channel's history.
   - Details of each message—channel name, author, content, and timestamp—are collected into a list.
   - After processing all channels, the data is written to a JSON file located in your Documents folder.

3. **Output:**

   The JSON file is named with a timestamp (e.g., `discord_messages_20230427_153045.json`) and contains an array of message objects. Each object includes:
   - `channel`: The channel name or ID.
   - `author`: The user who sent the message.
   - `content`: The text content of the message.
   - `timestamp`: The timestamp when the message was created in ISO format.

## Code Structure

- **Export Path and Directory Setup:**
  - The export path is defined by combining the user's home directory (specifically the Documents folder) with a unique filename based on the current UTC time.
  - The script ensures that the target folder exists by creating it if necessary.

- **Discord Client Initialization:**
  - The bot uses specified Discord intents for full access to message, guild, and member information.
  - The client is set up using `discord.Client()` with these intents.

- **Event Handlers:**
  - `on_ready`: Triggered when the bot is successfully connected to Discord. It initiates the scraping process.
  
- **Message Scraping Process:**
  - For each channel identified in `CHANNEL_IDS`, the bot retrieves all messages from the channel history.
  - Each message is appended to a list with structured data.
  - The progress for each channel is displayed using `tqdm`.

- **Data Export and Cleanup:**
  - The collected messages are written to a JSON file using `json.dump` with indentation for readability.
  - The bot prints summary information, including total messages scraped and the file path, then closes the Discord client.
