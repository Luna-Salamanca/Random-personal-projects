import discum
import time

token =
guild_id =
channel_id =
bot = discum.Client(token=token, log=True)

# Fetch members
bot.gateway.fetchMembers(guild_id, channel_id, keep=['public_flags', 'username', 'discriminator', 'premium_since'], startIndex=0, method='overlap')

@bot.gateway.command
def memberTest(resp):
    if bot.gateway.finishedMemberFetching(guild_id):
        lenmembersfetched = len(bot.gateway.session.guild(guild_id).members)
        print(str(lenmembersfetched) + ' members fetched')
        bot.gateway.removeCommand(memberTest)
        bot.gateway.close()

bot.gateway.run()

def __get_badges(flags) -> list[str]:
    BADGES = {
        1 << 0: 'Discord Employee',
        1 << 1: 'Partnered Server Owner',
        1 << 2: 'HypeSquad Events',
        1 << 3: 'Bug Hunter Level 1',
        1 << 9: 'Early Supporter',
        1 << 10: 'Team User',
        1 << 12: 'System',
        1 << 14: 'Bug Hunter Level 2',
        1 << 16: 'Verified Bot',
        1 << 17: 'Early Verified Bot Developer',
        1 << 18: 'Discord Certified Moderator'
    }

    badges = []

    for badge_flag, badge_name in BADGES.items():
        if flags & badge_flag == badge_flag:
            badges.append(badge_name)

    return badges

fetched_data = []

try:
    # Wait for the member fetching to complete
    while not bot.gateway.finishedMemberFetching(guild_id):
        time.sleep(1)

    members = list(bot.gateway.session.guild(guild_id).members.keys())[:5]  # Limit to 5 members
    for memberID in members:
        id = str(memberID)
        temp = bot.gateway.session.guild(guild_id).members[memberID].get('public_flags')
        user = str(bot.gateway.session.guild(guild_id).members[memberID].get('username'))
        disc = str(bot.gateway.session.guild(guild_id).members[memberID].get('discriminator'))
        username = f'{user}#{disc}'
        creation_date = str(time.strftime('%d-%m-%Y %H:%M:%S', time.localtime(((int(id) >> 22) + 1420070400000) / 1000)))
        if temp is not None:
            z = __get_badges(temp)
            if len(z) != 0:
                badges = ', '.join(z)
                output = f'ID: <@{id}> | Username: {username} | Badges: {badges} | Creation Date: {creation_date}'
                print(output)
                fetched_data.append(output)
except KeyboardInterrupt:
    print("Script terminated by user. Writing fetched data to result.txt.")
finally:
    with open('result.txt', 'w', encoding="utf-8") as file:
        for output in fetched_data:
            file.write(output + '\n')
