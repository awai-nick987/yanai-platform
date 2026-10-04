import re

with open('src/components/UserRoleManagement.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

show_notif_func = """
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };
"""
content = content.replace("  const [notification, setNotification] = useState<string | null>(null);", "  const [notification, setNotification] = useState<string | null>(null);\n" + show_notif_func)

with open('src/components/UserRoleManagement.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
