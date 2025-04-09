import os
import json
import discord
from tqdm import tqdm
from datetime import datetime
from config import DISCORD_TOKEN, CHANNEL_IDS

# Constants
EXPORT_PATH = os.path.join(
    os.path.expanduser("~"),
    "Documents",
    "DiscordMessages",
    f"discord_messages_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
)

# Ensure export folder exists
os.makedirs(os.path.dirname(EXPORT_PATH), exist_ok=True)

# Discord bot setup
intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True
intents.members = True

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"[INFO] Logged in as {client.user}")
    
    total_messages = 0
    all_messages = []

    for channel_id in CHANNEL_IDS:
        channel = client.get_channel(channel_id)

        if channel is None:
            print(f"[WARN] Channel with ID {channel_id} not found. Skipping.")
            continue

        channel_name = getattr(channel, "name", f"ID_{channel_id}")
        print(f"[INFO] Scraping messages from #{channel_name}...")

        try:
            message_count = 0
            with tqdm(desc=f'Scraping #{channel_name}', unit=' message') as pbar:
                async for message in channel.history(limit=None, oldest_first=True):
                    all_messages.append({
                        "channel": channel_name,
                        "author": str(message.author),
                        "content": message.content,
                        "timestamp": message.created_at.isoformat()
                    })
                    message_count += 1
                    pbar.update(1)

            print(f"[INFO] Scraped {message_count} messages from #{channel_name}")
            total_messages += message_count

        except Exception as e:
            print(f"[ERROR] Failed to scrape channel {channel_id}: {e}")

    with open(EXPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_messages, f, ensure_ascii=False, indent=4)

    print(f"[SUCCESS] Total messages scraped: {total_messages}")
    print(f"[SUCCESS] Saved to: {EXPORT_PATH}")

    await client.close()

client.run(DISCORD_TOKEN)
