import random
from datetime import datetime, timedelta

# List of ridiculous tasks
chaotic_tasks = [
    "Argue with your toaster",
    "Reorganize your thoughts alphabetically",
    "Stare into the void (productively)",
    "Have a breakdown (scheduled)",
    "Summon motivation via interpretive dance",
    "Build a nest out of paperwork",
    "Pretend to work while actually panicking",
    "Host a meeting with your inner demons",
    "Cry at cat memes",
    "Try manifesting a nap",
    "Reschedule reality",
    "Practice your villain monologue",
    "Google 'how to escape the simulation'",
    "Contemplate taxes",
    "Aggressively vibe to lo-fi beats",
    "Water your emotional support plant",
    "Talk to the moon about your goals",
    "Mentally uninstall responsibilities",
    "Write a haiku about existential dread",
    "High-five a ghost (or try to)",
]

def generate_schedule(start_hour=9, end_hour=17, interval_minutes=60):
    now = datetime.now().replace(hour=start_hour, minute=0, second=0, microsecond=0)
    end = now.replace(hour=end_hour)

    schedule = []
    while now < end:
        task = random.choice(chaotic_tasks)
        schedule.append(f"{now.strftime('%I:%M %p')} – {task}")
        now += timedelta(minutes=interval_minutes)

    return schedule

def main():
    print("✨ Welcome to Chaos Scheduler ✨\n")
    print("Your perfectly useless day plan:\n")

    schedule = generate_schedule()
    for entry in schedule:
        print(entry)

    print("\n🌀 Remember: productivity is subjective.")

if __name__ == "__main__":
    main()
