import re

with open('src/components/survey/SurveyApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change card flex alignment and add height for grid matching
content = content.replace(
    'className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between"',
    'className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-start justify-between h-full"'
)

# Remove truncate and make text wrap nicely
content = content.replace(
    'className="text-base sm:text-lg font-bold text-slate-900 truncate"',
    'className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words"'
)

# Make the card icons stick to the top slightly and match the new items-start layout
content = content.replace(
    'flex items-center justify-center shrink-0"',
    'flex items-center justify-center shrink-0 mt-0.5"'
)

with open('src/components/survey/SurveyApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
