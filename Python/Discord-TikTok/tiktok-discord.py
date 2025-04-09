import discord
import yt_dlp
import re
import os
import requests
import uuid
import logging
from dotenv import load_dotenv

# Load token from .env
load_dotenv()
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

# Logging setup
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

# Discord client setup
intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    logging.info(f'Logged in as {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    # Match TikTok links
    tiktok_url_match = re.search(r'(https?://(?:www\.)?tiktok\.com/\S+)', message.content)
    if tiktok_url_match:
        tiktok_url = tiktok_url_match.group(0)

        # Resolve shortlinks if needed
        if "tiktok.com/t/" in tiktok_url:
            try:
                response = requests.head(tiktok_url, allow_redirects=True)
                tiktok_url = response.url
                logging.info(f'Resolved TikTok URL: {tiktok_url}')
            except requests.RequestException as e:
                await message.channel.send(f"❌ Failed to resolve TikTok link: {e}")
                return

        processing_msg = await message.channel.send('⏳ Processing TikTok link...')

        # Create a unique temp filename
        filename = f"tiktok_{uuid.uuid4().hex}.mp4"

        try:
            ydl_opts = {
                'format': 'best',
                'outtmpl': filename,
                'quiet': True,
                'no_warnings': True,
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(tiktok_url, download=True)
                logging.info(f"Downloaded TikTok: {info.get('title')}")

            await message.channel.send(file=discord.File(filename))

            # Delete original message and processing message
            await message.delete()
            await processing_msg.delete()

        except Exception as e:
            logging.error(f"Error downloading TikTok: {e}")
            await processing_msg.edit(content=f"❌ Error: {e}")

        finally:
            if os.path.exists(filename):
                os.remove(filename)

client.run(DISCORD_TOKEN)
