# How to View Architecture Diagrams

This guide explains how to view the Mermaid architecture diagrams for the API Integration Training Platform.

## Method 1: In the App (Recommended) ⭐

The easiest way to view the architecture diagrams is through the interactive page in the app.

### Steps:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the architecture page:**
   - Open your browser to: `http://localhost:4000/docs/architecture`
   - Or click "Architecture" in the navigation menu (under "Advanced Topics")

3. **View the diagrams:**
   - All diagrams are rendered with dark theme styling
   - Diagrams are interactive and scrollable
   - Click the link at the bottom to view the full markdown documentation

### Features:
- ✅ Rendered Mermaid diagrams with dark theme
- ✅ Responsive design
- ✅ All diagrams in one page
- ✅ Links to full documentation

---

## Method 2: In VS Code/Cursor

View the diagrams directly in your code editor.

### Steps:

1. **Open the markdown file:**
   ```
   docs/ARCHITECTURE.md
   ```

2. **Install Mermaid Preview Extension:**
   - **VS Code**: Install "Markdown Preview Mermaid Support" extension
   - **Cursor**: Same extension works

3. **Preview the markdown:**
   - Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux)
   - Or right-click → "Open Preview"

### Features:
- ✅ View diagrams while editing
- ✅ Syntax highlighting
- ✅ Easy to navigate

---

## Method 3: On GitHub

If you push the code to GitHub, the diagrams render automatically.

### Steps:

1. **Push to GitHub:**
   ```bash
   git add docs/ARCHITECTURE.md
   git commit -m "Add architecture documentation"
   git push
   ```

2. **View on GitHub:**
   - Navigate to `docs/ARCHITECTURE.md` in your repository
   - GitHub automatically renders Mermaid diagrams

### Features:
- ✅ Automatic rendering
- ✅ No setup required
- ✅ Shareable links

---

## Method 4: Online Mermaid Editor

Use the official Mermaid Live Editor for interactive editing.

### Steps:

1. **Copy diagram code:**
   - Open `docs/ARCHITECTURE.md`
   - Find a diagram (between ` ```mermaid ` and ` ``` `)
   - Copy the diagram code

2. **Paste in Mermaid Live Editor:**
   - Go to: https://mermaid.live/
   - Paste the code
   - View and edit the diagram

### Features:
- ✅ Interactive editing
- ✅ Export as PNG/SVG
   - ✅ Shareable links

---

## Method 5: Command Line (Mermaid CLI)

Generate static images from the diagrams.

### Steps:

1. **Install Mermaid CLI:**
   ```bash
   npm install -g @mermaid-js/mermaid-cli
   ```

2. **Generate images:**
   ```bash
   # Generate PNG from markdown
   mmdc -i docs/ARCHITECTURE.md -o docs/architecture-diagrams.png
   
   # Generate SVG
   mmdc -i docs/ARCHITECTURE.md -o docs/architecture-diagrams.svg
   ```

### Features:
- ✅ Static images
- ✅ Can be embedded in documents
- ✅ High quality output

---

## Available Diagrams

The architecture documentation includes:

1. **System Architecture** - Overall system structure
2. **Request Flow** - How requests flow through the system
3. **Authentication Flow** - Sign up and sign in processes
4. **Database Schema** - Entity relationships
5. **Component Structure** - React component hierarchy
6. **Subscription System Flow** - Freemium model flow
7. **Deployment Architecture** - Dev and production setup
8. **Technology Stack** - Tech stack visualization
9. **File Structure** - Project organization
10. **Security Architecture** - Security layers

---

## Troubleshooting

### Diagrams not rendering in the app?

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

### Diagrams not showing in VS Code?

1. **Install the extension:**
   - Search for "Markdown Preview Mermaid Support"
   - Install and reload VS Code

2. **Check markdown preview:**
   - Make sure you're using the markdown preview, not just viewing the file

### Need help?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more help.
