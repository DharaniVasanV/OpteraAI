import glob, os, re

src_path = r'E:\AgentOS\frontend\src'
old_colors = ['#0066ff', '#0066FF', '#0F172A', '#0f172a', '#1E293B', '#1e293b']

replacements = {
    '#0066ff': '#2563FF',
    '#0066FF': '#2563FF',
    '#0F172A': '#080808',
    '#0f172a': '#080808',
    '#1E293B': '#18181B',
    '#1e293b': '#18181B',
}

print('=== SCANNING FOR OLD COLORS ===')
files_changed = 0
for filepath in glob.glob(os.path.join(src_path, '**', '*.tsx'), recursive=True) + \
               glob.glob(os.path.join(src_path, '**', '*.ts'), recursive=True) + \
               glob.glob(os.path.join(src_path, '**', '*.css'), recursive=True):
    try:
        with open(filepath, encoding='utf-8') as f:
            content = f.read()
        original = content
        found = []
        for old_c in old_colors:
            cnt = content.lower().count(old_c.lower())
            if cnt > 0:
                found.append(f'{old_c}(x{cnt})')
        if found:
            rel = os.path.relpath(filepath, src_path)
            print(f'{rel}: {" | ".join(found)}')
            # Apply replacements
            for old_c, new_c in replacements.items():
                content = content.replace(old_c, new_c)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            files_changed += 1
    except Exception as e:
        print(f'ERROR on {filepath}: {e}')

print(f'\nFixed {files_changed} files.')
