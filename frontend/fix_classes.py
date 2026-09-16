import glob, os, re

src_path = r'E:\AgentOS\frontend\src'

# Replace ALL slate-xxx dark mode references with the correct new palette
replacements_class = [
    # Dark mode backgrounds
    ('dark:bg-slate-950', 'dark:bg-[#080808]'),
    ('dark:bg-slate-900', 'dark:bg-[#080808]'),
    ('dark:bg-slate-800', 'dark:bg-[#18181B]'),
    ('dark:bg-slate-700', 'dark:bg-[#1F2228]'),
    ('dark:hover:bg-slate-800', 'dark:hover:bg-[#1F2228]'),
    ('dark:hover:bg-slate-700', 'dark:hover:bg-[#1F2228]'),
    # Dark mode borders
    ('dark:border-slate-800', 'dark:border-[#2A2D33]'),
    ('dark:border-slate-700', 'dark:border-[#2A2D33]'),
    ('dark:border-slate-600', 'dark:border-[#2A2D33]'),
    # Dark mode text
    ('dark:text-slate-100', 'dark:text-[#F5F5F5]'),
    ('dark:text-slate-200', 'dark:text-[#F5F5F5]'),
    ('dark:text-gray-100', 'dark:text-[#F5F5F5]'),
    ('dark:text-gray-200', 'dark:text-[#F5F5F5]'),
    ('dark:text-slate-300', 'dark:text-[#A1A1AA]'),
    ('dark:text-gray-300', 'dark:text-[#A1A1AA]'),
    ('dark:text-slate-400', 'dark:text-[#71717A]'),
    ('dark:text-gray-400', 'dark:text-[#71717A]'),
    ('dark:text-slate-500', 'dark:text-[#71717A]'),
    # Light mode bg
    ('bg-slate-50', 'bg-[#F4F7FB]'),
    ('bg-gray-50', 'bg-[#F4F7FB]'),
    # Light mode text
    ('text-slate-900', 'text-[#111827]'),
    ('text-gray-900', 'text-[#111827]'),
    ('text-slate-700', 'text-[#64748B]'),
    ('text-slate-600', 'text-[#64748B]'),
    ('text-gray-700', 'text-[#64748B]'),
    ('text-gray-600', 'text-[#64748B]'),
    ('text-slate-500', 'text-[#94A3B8]'),
    ('text-gray-500', 'text-[#94A3B8]'),
    ('text-slate-400', 'text-[#94A3B8]'),
    # Borders light
    ('border-slate-200', 'border-[#DCE3ED]'),
    ('border-gray-200', 'border-[#DCE3ED]'),
    ('border-slate-300', 'border-[#DCE3ED]'),
    # Input backgrounds light
    ('bg-slate-100', 'bg-[#EFF6FF]'),
    ('bg-gray-100', 'bg-[#EFF6FF]'),
]

files_changed = 0
for filepath in glob.glob(os.path.join(src_path, '**', '*.tsx'), recursive=True) + \
               glob.glob(os.path.join(src_path, '**', '*.ts'), recursive=True) + \
               glob.glob(os.path.join(src_path, '**', '*.css'), recursive=True):
    try:
        with open(filepath, encoding='utf-8') as f:
            content = f.read()
        original = content

        for old_c, new_c in replacements_class:
            content = content.replace(old_c, new_c)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            rel = os.path.relpath(filepath, src_path)
            print(f'Updated: {rel}')
            files_changed += 1
    except Exception as e:
        print(f'ERROR: {filepath}: {e}')

print(f'\nTotal files updated: {files_changed}')
