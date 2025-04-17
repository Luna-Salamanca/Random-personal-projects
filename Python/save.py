import os
e={"__pycache__",".git","node_modules","output.txt","markdown",".DS_Store"}
def t(d, p=""):
    o = []
    s = sorted(x for x in os.listdir(d) if x not in e)
    for i, f in enumerate(s):
        prefix = "└── " if i == len(s) - 1 else "├── "
        o.append(f"{p}{prefix}{f}")
        path = os.path.join(d, f)
        if not os.path.isdir(path):
            with open(path, encoding="utf-8") as file:
                lines = file.read().splitlines()
                o.extend([( "    " if i == len(s) - 1 else "│   ") + "    " + l for l in lines])
        else:
            o.extend(t(path, p + ("    " if i == len(s) - 1 else "│   ")))
    return o
if __name__=="__main__":b=os.path.dirname(__file__);open(os.path.join(b,"output.txt"),"w",encoding="utf-8").write("\n".join(t(b)));print("Saved")
