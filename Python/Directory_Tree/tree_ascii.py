import os
import sys
import argparse

IGNORED = {'node_modules', '.git', '__pycache__', '.next', 'package-lock.json'}

def print_tree(dir_path, prefix, file_handle, depth, max_depth):
    if os.path.basename(dir_path) in IGNORED:
        return

    try:
        entries = sorted(os.listdir(dir_path))
    except PermissionError:
        file_handle.write(prefix + "└── [Permission Denied]\n")
        return

    entries = [e for e in entries if e not in IGNORED]
    for idx, entry in enumerate(entries):
        full_path = os.path.join(dir_path, entry)
        is_last = (idx == len(entries) - 1)
        connector = "└── " if is_last else "├── "
        next_prefix = prefix + ("    " if is_last else "│   ")

        file_handle.write(prefix + connector + entry + ("/" if os.path.isdir(full_path) else "") + "\n")

        if os.path.isdir(full_path) and depth < max_depth:
            print_tree(full_path, next_prefix, file_handle, depth + 1, max_depth)

def main():
    parser = argparse.ArgumentParser(description="Print ASCII directory tree with max depth.")
    parser.add_argument("path", nargs="?", default=".", help="Root directory to scan")
    parser.add_argument("-o", "--output", default="tree_output.txt", help="Output file")
    parser.add_argument("--max-depth", type=int, default=99, help="Maximum depth (default: unlimited)")
    args = parser.parse_args()

    root_path = os.path.abspath(args.path)

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(f"{os.path.basename(root_path)}/\n")
        print_tree(root_path, "", f, depth=1, max_depth=args.max_depth)

    print(f"ASCII tree saved to {args.output}")

if __name__ == "__main__":
    main()
