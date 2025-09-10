# Srinagar Reads

Curated reading lists for Srinagar Reads

## Adding New Reading Lists

Edit the `data/reading-lists.yaml` file to add new weekly reading lists:

```yaml
weeks:
  - title: "Week of [Date]"
    date: "YYYY-MM-DD"
    description: "Brief description of this week's theme"
    articles:
      - title: "Article Title"
        url: "https://example.com/article"
        description: "Brief description of the article"
      
      - title: "Another Article"
        url: "https://example.com/another-article"
        description: "Description of another article"
```

### YAML Structure

- **weeks**: Array of weekly reading lists
- **title**: Display title for the week
- **date**: Date in YYYY-MM-DD format (used for sorting)
- **description**: Optional theme or description for the week
- **articles**: Array of articles for that week
  - **title**: Article title
  - **url**: Full URL to the article
  - **description**: Optional brief description

---

Built with ❤️ for Srinagar Reads
