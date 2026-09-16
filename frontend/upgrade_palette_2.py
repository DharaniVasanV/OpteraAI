import os
import re
import glob

workspace = r'E:\AgentOS\frontend\src'

replacements = {
    # 🔵 Primary Accent
    r'#[0]{2}66[fF]{2}': r'#2563FF',
    r'#[0]{2}52[cC]{2}': r'#1D4ED8',
    r'#[0]{2}4[bB][bB][dD]': r'#1D4ED8',
    
    # ☀️ Main Backgrounds
    r'bg-slate-50': r'bg-[#F4F7FB]',
    r'bg-slate-100': r'bg-[#EFF6FF]',
    r'bg-gray-50': r'bg-[#F4F7FB]',
    
    # 🌙 Dark Mode Backgrounds
    r'#[0][bB]1021': r'#080808',
    r'#[0][fF]172[aA]': r'#080808',
    r'dark:bg-slate-900/50': r'dark:bg-[#080808]/50',
    r'dark:bg-slate-900': r'dark:bg-[#080808]',
    r'dark:bg-slate-950': r'dark:bg-[#080808]',
    
    # 🌙 Dark Mode Cards and Hover
    r'dark:bg-slate-800': r'dark:bg-[#18181B]',
    r'dark:hover:bg-slate-700': r'dark:hover:bg-[#1F2228]',
    r'dark:hover:bg-slate-800': r'dark:hover:bg-[#1F2228]',
    
    # borders
    r'border-slate-200': r'border-[#DCE3ED]',
    r'dark:border-slate-700': r'dark:border-[#2A2D33]',
    r'dark:border-slate-800': r'dark:border-[#2A2D33]',
}

files_changed = 0
for filepath in glob.glob(os.path.join(workspace, '**', '*.tsx'), recursive=True) + \
                glob.glob(os.path.join(workspace, '**', '*.ts'), recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for old, new in replacements.items():
        # Using case insensitive for everything
        content = re.sub(old, new, content, flags=re.IGNORECASE)
    
    # CLEAN UP DOUBLE CLASSES like dark:bg-[#18181B] dark:bg-[#080808]
    content = re.sub(r'dark:bg-\[#18181B\]\s+dark:bg-\[#080808\]', r'dark:bg-[#18181B]', content)
    content = re.sub(r'dark:text-\[#F5F5F5\]\s+dark:text-\[#F5F5F5\]', r'dark:text-[#F5F5F5]', content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        files_changed += 1

print(f"Palette upgraded. Modified {files_changed} files.")
