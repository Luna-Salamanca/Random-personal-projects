import requests
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import os
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

# === CONFIG ===
USERNAME = "Luna-Salamanca"
TOKEN = os.getenv("GITHUB_TOKEN")
OUTDIR = "Python/Contribution_Heatmap/output"
os.makedirs(OUTDIR, exist_ok=True)

# === QUERY CONTRIBUTIONS ===
query = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
"""

headers = {
    "Authorization": f"Bearer {TOKEN}"
}

variables = {
    "login": USERNAME
}

response = requests.post(
    "https://api.github.com/graphql",
    json={"query": query, "variables": variables},
    headers=headers
)

weeks = response.json()['data']['user']['contributionsCollection']['contributionCalendar']['weeks']

# === BUILD 7x52 GRID ===
grid = np.zeros((7, len(weeks)))

for w_idx, week in enumerate(weeks):
    for d_idx, day in enumerate(week['contributionDays']):
        grid[d_idx, w_idx] = day['contributionCount']

# === PASTEL PURPLE GRADIENT ===
colors = ["#f0e6fa", "#dabff6", "#b597ef", "#9872e4", "#7c57c6", "#533a94"]
cmap = mcolors.LinearSegmentedColormap.from_list("pastel_purple", colors)
norm = mcolors.Normalize(vmin=0, vmax=np.max(grid))

# === PLOT ===
fig, ax = plt.subplots(figsize=(12, 2), dpi=150)
heatmap = ax.imshow(grid, cmap=cmap, norm=norm, aspect='auto')

ax.set_xticks([])
ax.set_yticks([])
ax.set_title(f"{USERNAME}'s GitHub Contributions", fontsize=12, pad=10)
ax.spines[:].set_visible(False)

# === SAVE ===
plt.tight_layout()
plt.savefig(f"{OUTDIR}/heatmap.svg", transparent=True)
plt.savefig(f"{OUTDIR}/heatmap.png", transparent=True)
plt.close()

print("✅ Contribution heatmap saved!")
