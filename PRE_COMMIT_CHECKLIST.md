# Pre-Commit Checklist

## 🔍 Before Making Any Changes

### **1. System Validation**
- [ ] Run: `powershell -File scripts/validate-setup.ps1`
- [ ] Ensure no critical errors are reported
- [ ] Check that all required files exist

### **2. Current State Check**
- [ ] Verify which servers are currently running
- [ ] Check if ports 3000 and 3001 are available
- [ ] Ensure you're in the correct directory

### **3. Backup (if making major changes)**
- [ ] Run: `powershell -File scripts/backup-project.ps1`
- [ ] Note the backup location for potential rollback

## 🚀 Before Starting Development

### **1. Choose Your Method**
- [ ] **Recommended**: Use `quick-start.bat` for first-time setup
- [ ] **Alternative**: Use individual batch files (`start-backend.bat`, `start-frontend.bat`)
- [ ] **Advanced**: Use PowerShell scripts or npm commands

### **2. Verify Setup**
- [ ] Backend responds at: `http://localhost:3001/health`
- [ ] Frontend loads at: `http://localhost:3000`
- [ ] No error messages in console

## 🔧 During Development

### **1. File Organization**
- [ ] Frontend changes go in `frontend/` directory
- [ ] Backend changes go in `backend/` directory
- [ ] Scripts go in `scripts/` directory
- [ ] Root files stay in root directory

### **2. Testing**
- [ ] Test changes immediately after making them
- [ ] Verify both servers still work together
- [ ] Check for any new error messages

## 🚨 If Issues Occur

### **1. Quick Fixes**
- [ ] Stop all servers (Ctrl+C in each window)
- [ ] Run validation script: `powershell -File scripts/validate-setup.ps1`
- [ ] Use batch files instead of npm commands
- [ ] Check file paths and JSON syntax

### **2. Recovery**
- [ ] Restore from backup if needed
- [ ] Recreate corrupted files
- [ ] Start with `quick-start.bat`

## 📝 After Development

### **1. Final Testing**
- [ ] Both servers start without errors
- [ ] Frontend and backend communicate properly
- [ ] All functionality works as expected

### **2. Documentation**
- [ ] Update any changed procedures
- [ ] Note any new issues encountered
- [ ] Document solutions for future reference



