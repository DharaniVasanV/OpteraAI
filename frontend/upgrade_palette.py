import os
import re
import glob

workspace = r'E:\AgentOS\frontend\src'

# Specific hex and tailwind class swaps based on user's exact instructions
replacements = {
    # 🔵 Primary Accent
    r'#0066FF': r'#2563FF',
    r'#0052cc': r'#1D4ED8',
    r'#004bbd': r'#1D4ED8',
    
    # ☀️ Main Backgrounds
    r'bg-slate-50': r'bg-[#F4F7FB]',
    r'bg-slate-100': r'bg-[#EFF6FF]', # surface matching
    r'bg-gray-50': r'bg-[#F4F7FB]',
    
    # 🌙 Dark Mode Backgrounds
    r'#0b1021': r'#080808', # exact replacements for hex page bgs
    r'dark:bg-slate-900/50': r'dark:bg-[#080808]/50',
    r'dark:bg-slate-900': r'dark:bg-[#080808]',
    r'dark:bg-slate-950': r'dark:bg-[#080808]',
    
    # 🌙 Dark Mode Cards and Hover
    r'dark:bg-slate-800': r'dark:bg-[#18181B]',
    r'dark:hover:bg-slate-700': r'dark:hover:bg-[#1F2228]',
    r'dark:hover:bg-slate-800': r'dark:hover:bg-[#1F2228]',
    
    # ☀️/🌙 Borders
    r'border-slate-200': r'border-[#DCE3ED]',
    r'border-gray-200': r'border-[#DCE3ED]',
    r'dark:border-slate-700': r'dark:border-[#2A2D33]',
    r'dark:border-slate-800': r'dark:border-[#2A2D33]',
    r'dark:border-gray-700': r'dark:border-[#2A2D33]',
    r'border-white/10': r'border-white/5',
    
    # ☀️/🌙 Typography: Primary
    r'text-gray-900': r'text-[#111827]',
    r'text-slate-900': r'text-[#111827]',
    r'dark:text-gray-100': r'dark:text-[#F5F5F5]',
    r'dark:text-slate-100': r'dark:text-[#F5F5F5]',
    r'dark:text-white': r'dark:text-[#F5F5F5]',
    
    # ☀️/🌙 Typography: Secondary
    r'text-gray-600': r'text-[#64748B]',
    r'text-slate-600': r'text-[#64748B]',
    r'dark:text-gray-300': r'dark:text-[#A1A1AA]',
    r'dark:text-slate-300': r'dark:text-[#A1A1AA]',
    
    # ☀️/🌙 Typography: Muted
    r'text-slate-500': r'text-[#94A3B8]',
    r'text-gray-500': r'text-[#94A3B8]',
    r'dark:text-slate-400': r'dark:text-[#71717A]',
    r'dark:text-gray-400': r'dark:text-[#71717A]',
}

files_changed = 0
for filepath in glob.glob(os.path.join(workspace, '**', '*.tsx'), recursive=True) + \
                glob.glob(os.path.join(workspace, '**', '*.ts'), recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for old, new in replacements.items():
        content = re.sub(old, new, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        files_changed += 1

print(f"Palette upgraded. Modified {files_changed} files.")
