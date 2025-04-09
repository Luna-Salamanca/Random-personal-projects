import discord
from discord.ext import commands
from discord import app_commands
import requests
import asyncio
import logging
from config import PULSOID_API_KEY, DISCORD_TOKEN, PULSOID_API_URL, YOUR_APP_ID
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(filename='heart_rate.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

class MyClient(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.bg_task = self.bot.loop.create_task(self.update_heart_rate_status())
        self.previous_status_message = None
        self.last_heart_rate = None
        self.last_heart_rate_time = datetime.utcnow()

    async def fetch_heart_rate(self):
        """Fetch heart rate data from Pulsoid API."""
        try:
            response = requests.get(PULSOID_API_URL, headers={'Authorization': f'Bearer {PULSOID_API_KEY}'})
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logging.error(f"Request error: {e}")
            return None

    async def update_heart_rate_status(self):
        """Update bot's status with heart rate and log the data."""
        await self.bot.wait_until_ready()

        while not self.bot.is_closed():
            data = await self.fetch_heart_rate()
            if data:
                heart_rate = data.get('data', {}).get('heart_rate')
                current_time = datetime.utcnow()

                if heart_rate is not None:
                    if heart_rate == self.last_heart_rate:
                        # Check if the heart rate has been the same for 1 minute or more
                        if current_time - self.last_heart_rate_time >= timedelta(minutes=1):
                            status_message = "0 BPM 💀"
                    else:
                        # Heart rate has changed, update the last heart rate and time
                        self.last_heart_rate = heart_rate
                        self.last_heart_rate_time = current_time
                        status_message = f"{heart_rate} BPM ❤️"
                else:
                    status_message = "0 BPM 💀"
                    self.last_heart_rate = None
                    self.last_heart_rate_time = current_time
            else:
                status_message = "0 BPM 💀"
                self.last_heart_rate = None
                self.last_heart_rate_time = datetime.utcnow()

            if status_message != self.previous_status_message:
                activity = discord.Game(name=status_message)
                await self.bot.change_presence(activity=activity)
                logging.info(f"Updated status: {status_message}")
                self.previous_status_message = status_message

            await asyncio.sleep(10)  # Update interval, adjust as needed

    @app_commands.command(name='current_heart_rate', description='Show the current heart rate')
    async def current_heart_rate(self, interaction: discord.Interaction):
        """Command to show the current heart rate in the channel where the command was used."""
        data = await self.fetch_heart_rate()
        if data:
            heart_rate = data.get('data', {}).get('heart_rate')
            if heart_rate is not None:
                await interaction.response.send_message(f"Current Heart Rate: {heart_rate} BPM ❤️")
            else:
                await interaction.response.send_message("Watch is offline or no heart rate data available.")
        else:
            await interaction.response.send_message("0 BPM 💀")

    @commands.Cog.listener()
    async def on_ready(self):
        logging.info(f'{self.bot.user} has connected to Discord!')
        try:
            synced = await self.bot.tree.sync()
            logging.info(f"Slash commands synced: {synced}")
        except Exception as e:
            logging.error(f"Failed to sync commands: {e}")

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents, application_id=YOUR_APP_ID)

@bot.event
async def on_ready():
    logging.info(f'{bot.user} has connected to Discord!')
    await bot.add_cog(MyClient(bot))

bot.run(DISCORD_TOKEN)
