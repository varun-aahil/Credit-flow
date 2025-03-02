Querying Perplexity AI using sonar-pro for: What is the new cursor rules directory format? How does it differ from the old format? What are the benefits? Save to local-docs/cursorrules-folder.md
The new Cursor rules directory format is `.cursor/rules/`. It replaces the old single `.cursorrules` file format[1][2].

Key differences:
- Multiple rule files can be created in the `.cursor/rules/` directory instead of a single file[1][2]
- Rules can have descriptions and glob patterns to specify when they apply[5]
- Rules are automatically chosen by the Agent based on context[1]

Benefits:
- More granular control over AI behavior in different parts of a project[2]
- Folder-specific configurations[2] 
- Automatic attachment of relevant rules when matching files are referenced[2]
- Better organization for complex projects like monorepos[3]

Example structure:
```
.cursor/
  rules/
    rule_a.txt
    rule_b.txt
    rule_c.txt
```

Rules can be created via the command palette: `Cmd + Shift + P` > `New Cursor Rule`[2].

This new format provides more flexibility and control compared to the old single file approach, especially for larger projects with varying requirements across different sections.