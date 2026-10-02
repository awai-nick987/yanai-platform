with open('src/App.tsx', 'r') as f:
    content = f.read()

bad = "addSubmissionToDb"
good = "saveSubmission"
content = content.replace(bad, good)

with open('src/App.tsx', 'w') as f:
    f.write(content)
