Of course, Luna 🌙 Here's a clean and simple `README.md` for your **GitHub Contribution Heatmap Generator**:

---

## ✅ Minimal `README.md`

```markdown
# GitHub Contribution Heatmap

This is a little script that fetches my GitHub contribution data and generates a pretty heatmap using pastel colors.

It uses the GitHub GraphQL API and saves the chart as both SVG and PNG in the `output/` folder.

---

### How to Use

1. Generate a GitHub token from [github.com/settings/tokens](https://github.com/settings/tokens)
2. Set it in your terminal:
   ```powershell
   $env:GITHUB_TOKEN = "your_token_here"
   ```
3. Run the script:
   ```bash
   python generate_heatmap.py
   ```

---

### Example Output

<img src="./output/heatmap.svg" width="600" alt="Contribution heatmap" />
```

---