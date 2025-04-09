### About This Project

I originally built this tool for myself, a simple, no-frills way to visualize folder structures while working on various coding projects. It helps me stay organized, quickly share directory layouts, and avoid scrolling through bloated trees manually. And I'm lazy...

---

### Directory Tree Printer

A Python script to recursively print the directory tree structure of a given folder. Supports ASCII tree formatting and depth control.

---

## What It Does

- Shows the folder + file structure in a tree format  
- Outputs clean, readable ASCII lines  
- Lets you limit how deep it goes (`--max-depth`)  
- Save the result to a file (`--output`) if you want to keep it

---

## Getting Started

No setup, no nonsense. Just clone the repo and run the script:

```bash
git clone
python tree_ascii.py --help
```

---

## How to Use It

```bash
python tree_ascii.py [path] [--output OUTPUT] [--max-depth N]
```

### Options

| Option           | What it does                                           |
|------------------|--------------------------------------------------------|
| `path`           | Where to start (defaults to current directory)         |
| `--output`, `-o` | Save the tree to a file (default: `tree_output.txt`)   |
| `--max-depth`    | Limit how deep the tree goes (default: full depth)     |

---

## Examples

```bash
# Just print the current directory
python tree_ascii.py

# Print a specific folder and save to a file
python tree_ascii.py ~/my_project -o structure.txt

# Only go 2 levels deep
python tree_ascii.py /var/www --max-depth 2
```

---

## Example Output

```
my_project/
├── .gitignore
├── README.md
├── tree_ascii.py
└── src/
    ├── main.py
    └── utils/
        └── helpers.py
```
