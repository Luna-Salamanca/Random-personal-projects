import os
from collections import defaultdict

# File extensions to include
VALID_EXTENSIONS = {}
# Directories to skip
SKIP_DIRS = {}
# File extensions to skip
SKIP_EXTENSIONS = {}

# Group everything under this depth (e.g., src/components) nothihng under components
GROUP_DEPTH = 2

def is_valid_file(file):
    ext = os.path.splitext(file)[1].lower()
    return ext in VALID_EXTENSIONS and ext not in SKIP_EXTENSIONS

def get_bucket_key(base_dir, full_path):
    rel_path = os.path.relpath(full_path, base_dir)
    parts = rel_path.split(os.sep)
    limited_parts = parts[:GROUP_DEPTH]
    return os.path.join(*limited_parts)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_root = os.path.join(base_dir, "python_output")
    grouped_files = defaultdict(list)

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith("python_output")]
        if "python_output" in root:
            continue

        for file in files:
            if not is_valid_file(file):
                continue

            full_path = os.path.join(root, file)
            bucket = get_bucket_key(base_dir, root)
            grouped_files[bucket].append(full_path)

    for bucket, files in grouped_files.items():
        output_dir = os.path.join(output_root, bucket)
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, "output.txt")
        with open(output_path, "w", encoding="utf-8") as out:
            out.write(f"=== {bucket} ===\n\n")
            for file_path in files:
                try:
                    rel_file_path = os.path.relpath(file_path, base_dir)
                    relative_path = os.path.relpath(file_path, base_dir)
                    out.write(f"// --- FILE: {relative_path} ---\n")
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        out.write(f.read())
                    out.write("\n\n")
                except Exception as e:
                    out.write(f"\n⚠️ Could not read {file_path}: {e}\n")

    print(f"Grouped by depth={GROUP_DEPTH} — outputs in: python_output/")

if __name__ == "__main__":
    main()
