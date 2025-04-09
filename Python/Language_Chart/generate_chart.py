import requests
import matplotlib.pyplot as plt
import matplotlib.patheffects as path_effects
import matplotlib.image as mpimg
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.offsetbox import OffsetImage, AnnotationBbox

from PIL import Image, ImageDraw
import numpy as np
from io import BytesIO
import base64
import os

# === GitHub Info ===
username = "Luna-Salamanca"
repo = "Random-personal-projects"
lang_url = f"https://api.github.com/repos/{username}/{repo}/languages"
user_url = f"https://api.github.com/users/{username}"

# === Fetch Language Data ===
lang_data = requests.get(lang_url).json()
if not lang_data:
    raise Exception("No language data found.")
sorted_data = sorted(lang_data.items(), key=lambda x: x[1], reverse=True)
languages, sizes = zip(*sorted_data)

# === Fetch GitHub Avatar ===
avatar_url = requests.get(user_url).json()['avatar_url']
avatar_response = requests.get(avatar_url)
avatar_img = Image.open(BytesIO(avatar_response.content)).convert("RGBA")

# === Crop avatar into a circle ===
def crop_circle(im):
    bigsize = (im.size[0] * 3, im.size[1] * 3)
    mask = Image.new('L', bigsize, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + bigsize, fill=255)
    mask = mask.resize(im.size, Image.LANCZOS)
    im.putalpha(mask)
    return im

avatar_img = crop_circle(avatar_img)
avatar_img = avatar_img.resize((150, 150), Image.LANCZOS)

# === Convert avatar to base64 image (used in both formats) ===
buffer = BytesIO()
avatar_img.save(buffer, format="PNG")
avatar_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
avatar_io = BytesIO(base64.b64decode(avatar_base64))

# === Gradient Colors ===
twilight_pastel = LinearSegmentedColormap.from_list("twilight_pastel", [
    "#383366", "#544582", "#7461AB", "#A183D4", "#B19BE0", "#C6AEEB"
])
colors = [twilight_pastel(i / (len(languages) - 1)) for i in range(len(languages))]

# === Setup Plot ===
plt.rcParams['font.family'] = 'DejaVu Sans'
fig, ax = plt.subplots(figsize=(10, 8), dpi=200)
fig.patch.set_alpha(0.0)  # Transparent background

# === Donut Chart ===
wedges, texts, autotexts = ax.pie(
    sizes,
    labels=languages,
    autopct='%1.1f%%',
    startangle=140,
    colors=colors,
    wedgeprops=dict(width=0.4, edgecolor='white'),
    textprops={'fontsize': 12}
)

# === Label Styling ===
for text, color in zip(texts, colors):
    text.set_color(color)
    text.set_path_effects([
        path_effects.withStroke(linewidth=3, foreground='white')
    ])
for autotext in autotexts:
    autotext.set_path_effects([
        path_effects.withStroke(linewidth=3, foreground='white')
    ])

# === Add Avatar to Center as OffsetImage ===
imagebox = OffsetImage(mpimg.imread(avatar_io), zoom=0.5)
ab = AnnotationBbox(imagebox, (0, 0), frameon=False, zorder=10)
ax.add_artist(ab)

# === Add Username + Repo below Avatar ===
ax.text(
    0, -0.28,
    f"{username}\n/{repo}",
    ha='center', va='center',
    fontsize=11, weight='bold',
    zorder=11,
    path_effects=[
        path_effects.withStroke(linewidth=4, foreground='white'),
        path_effects.Normal()
    ]
)

# === Save to Charts/ Folder ===
ax.axis('equal')
plt.tight_layout()

output_dir = "Python/Language_Chart/charts"
os.makedirs(output_dir, exist_ok=True)

plt.savefig(f"{output_dir}/languages.svg", format="svg", transparent=True)
plt.savefig(f"{output_dir}/languages.png", format="png", transparent=True)
