with open('src/components/survey/SurveyApp.tsx', 'r') as f:
    content = f.read()

old_use_effect = """  // Initialize with authentic Yanai City sample survey data on first render
  useEffect(() => {
    const { headers: initialHeaders, rows: initialRows } = parseRawText(SAMPLE_TSV_DATA);
    setHeaders(initialHeaders);
    setRawRows(initialRows);
    setDataSourceName("柳井市まちなかアンケート実証データ (サンプル)");
    const detected = detectColumnMapping(initialHeaders);
    setMapping(detected);
  }, []);"""

new_use_effect = """  // Production mode: Start blank. Removed sample data.
  useEffect(() => {
    // Intentionally left blank for production so users import their own data
  }, []);"""

if old_use_effect in content:
    content = content.replace(old_use_effect, new_use_effect)
else:
    print("Could not find the useEffect block!")

with open('src/components/survey/SurveyApp.tsx', 'w') as f:
    f.write(content)
