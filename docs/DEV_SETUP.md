# Developer Setup Guide

## Quick Start for Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:4000`

### 3. View Architecture Diagrams Locally

#### Option A: In the Browser (Easiest)

Navigate to:
```
http://localhost:4000/docs/architecture
```

All Mermaid diagrams are rendered automatically with dark theme.

#### Option B: In VS Code/Cursor

1. Open `docs/ARCHITECTURE.md` in your editor
2. Install "Markdown Preview Mermaid Support" extension
3. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows) to open preview
4. Diagrams render automatically in the preview pane

#### Option C: Command Line Preview

Use a markdown viewer with Mermaid support:

```bash
# Install markdown viewer (choose one)
npm install -g markdown-preview-enhanced

# Or use VS Code CLI
code docs/ARCHITECTURE.md
# Then use Cmd+Shift+V to preview
```

### 4. Edit Architecture Diagrams

To modify diagrams:

1. **Edit in markdown file:**
   - Open `docs/ARCHITECTURE.md`
   - Edit the Mermaid code blocks (between ` ```mermaid ` and ` ``` `)
   - Save the file

2. **Preview changes:**
   - In browser: Refresh `/docs/architecture` page
   - In VS Code: The preview updates automatically
   - Or use https://mermaid.live/ for interactive editing

3. **Test diagram syntax:**
   ```bash
   # If you have mermaid-cli installed
   npx @mermaid-js/mermaid-cli docs/ARCHITECTURE.md -o test.png
   ```

## Local Development Workflow

### Viewing Diagrams While Developing

1. **Start dev server in one terminal:**
   ```bash
   npm run dev
   ```

2. **Open architecture page in browser:**
   ```
   http://localhost:4000/docs/architecture
   ```

3. **Edit diagrams:**
   - Edit `docs/ARCHITECTURE.md`
   - Save file
   - Refresh browser to see changes

### Hot Reload

The architecture page supports hot reload:
- Edit `app/docs/architecture/page.tsx` → Hot reloads
- Edit `docs/ARCHITECTURE.md` → Refresh page to see updates

### Generate Static Images (Optional)

To generate static diagram images for documentation:

```bash
# Install mermaid CLI globally
npm install -g @mermaid-js/mermaid-cli

# Generate images from markdown
mmdc -i docs/ARCHITECTURE.md -o docs/architecture-diagrams.png

# Generate individual diagrams
# (extract specific mermaid code blocks first)
```

## File Locations

```
apisandbox/
├── docs/
│   ├── ARCHITECTURE.md          # Source of truth (Mermaid code)
│   ├── VIEWING_ARCHITECTURE.md  # This guide
│   └── DEV_SETUP.md            # You are here
├── app/
│   └── docs/
│       └── architecture/
│           └── page.tsx        # Web viewer page
```

## Troubleshooting Local Viewing

### Diagrams not rendering in browser?

1. **Check if mermaid is installed:**
   ```bash
   npm list mermaid
   ```

2. **Reinstall if needed:**
   ```bash
   npm install mermaid
   ```

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

### VS Code preview not working?

1. **Install extension:**
   - Search: "Markdown Preview Mermaid Support"
   - Install: `bierner.markdown-mermaid` by Matt Bierner

2. **Check markdown preview:**
   - Make sure you're in preview mode (not just viewing raw markdown)
   - Use `Cmd+Shift+V` or `Ctrl+Shift+V`

### Need to edit diagrams?

The best workflow for editing:

1. **Copy diagram code** from `docs/ARCHITECTURE.md`
2. **Paste into https://mermaid.live/**
3. **Edit and test** in the live editor
4. **Copy back** to `docs/ARCHITECTURE.md`
5. **Save and refresh** browser or VS Code preview

## Common Commands

```bash
# Start dev server
npm run dev

# View in browser
open http://localhost:4000/docs/architecture

# Type check
npx tsc --noEmit

# Build (to test production)
npm run build

# Run tests
npm test
```

## Development Tips

1. **Keep browser open** to `/docs/architecture` while editing
2. **Use VS Code split view** - markdown on left, preview on right
3. **Test diagrams** in mermaid.live before committing
4. **Check console** for any rendering errors in browser DevTools
