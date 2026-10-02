with open('src/components/InteractiveTownMap.tsx', 'r') as f:
    content = f.read()

bad = """      const ideaIcon = L.divIcon({
        className: 'custom-idea-marker',
      const htmlContent = isSelected"""

good = """      const htmlContent = isSelected"""
content = content.replace(bad, good)

with open('src/components/InteractiveTownMap.tsx', 'w') as f:
    f.write(content)
