import glob, os

src_path = r'E:\AgentOS\frontend\src'
old_colors = ['#0066ff', '#0066FF', '#0F172A', '#0f172a', '#1E293B', '#1e293b']

replacements = {
    '#0066FF': '#2563FF',
    '#0066ff': '#2563FF',
    '#0F172A': '#080808',
    '#0f172a': '#080808',
    '#1E293B': '#18181B',
    '#1e293b': '#18181B',
}

results = {}
for filepath in glob.glob(os.path.join(src_path, '**', '*'), recursive=True):
    if not os.path.isfile(filepath):
        continue
    ext = os.path.splitext(filepath)[1].lower()
    if ext not in ['.tsx', '.ts', '.css', '.js', '.jsx']:
        continue
    try:
        content = open(filepath, encoding='utf-8').read()
        found_old = []
        for c in old_colors:
            cnt = content.lower().count(c.lower())
            if cnt > 0:
                found_old.append(c)
        if found_old:
            rel = os.path.relpath(filepath, src_path)
            print(f'FIXING: {rel}: {found_old}')
            for old_c, new_c in replacements.items():
                content = content.replace(old_c, new_c)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
    except Exception as e:
        print(f'ERROR: {filepath}: {e}')

print('Done!')
