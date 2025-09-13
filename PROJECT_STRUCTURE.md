# Educational Management System - Project Structure

## 📁 Directory Layout
```
ppje/
├── frontend/                 # React TypeScript application
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── postcss.config.js    # PostCSS configuration
├── backend/                 # Express.js API server
│   ├── simple-server.js     # Main server file
│   ├── package.json         # Backend dependencies
│   └── config/              # Configuration files
├── scripts/                 # Development scripts
│   ├── start-backend.ps1    # PowerShell backend script
│   ├── start-frontend.ps1   # PowerShell frontend script
│   ├── start-both.ps1       # PowerShell both servers
│   └── install-all.ps1      # PowerShell install script
├── start-backend.bat        # Windows batch file - backend
├── start-frontend.bat       # Windows batch file - frontend
├── start-both.bat           # Windows batch file - both
├── package.json             # Root workspace configuration
└── README.md                # Project documentation
```

## 🚫 CRITICAL RULES

### **NEVER:**
1. ❌ Mix frontend and backend files in the same directory
2. ❌ Use Unix syntax (`&&`, `rm -rf`) in Windows environments
3. ❌ Create files with special characters or encoding issues
4. ❌ Use workspace configuration that conflicts with React
5. ❌ Run commands from wrong directories

### **ALWAYS:**
1. ✅ Use batch files for Windows compatibility
2. ✅ Keep frontend and backend completely separate
3. ✅ Test each component independently before integration
4. ✅ Use absolute paths in PowerShell scripts
5. ✅ Validate JSON files before committing



