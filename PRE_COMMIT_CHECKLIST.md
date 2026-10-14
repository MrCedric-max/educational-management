# Pre-Commit & Launch Checklist

## 🔍 Pre-Launch Validation

### **1. Automated Test Suites**
- [ ] Frontend Unit Tests: `npm test` (all 4 suites, 12 tests must pass)
- [ ] API & Security Tests: `npm run test:api` (all 20 endpoint & RBAC tests must pass)
- [ ] Production Build: `npm run build` (builds `frontend/build` cleanly without errors)
- [ ] Database Migrations: `npm run db:migrate` (14 tables verified)

### **2. Current State Check**
- [ ] Backend is running and responds at: `http://localhost:3001/health`
- [ ] Frontend loads and proxies via: `http://localhost:3000`
- [ ] Git working tree is clean: `git status`

## 🚀 Before Starting Development

### **1. Universal NPM Scripts**
- [ ] Run both servers concurrently: `npm run start` (or `npm run start:dev`)
- [ ] Run backend only: `npm run start:backend`
- [ ] Run frontend only: `npm run start:frontend`
- [ ] Run all test suites: `npm test` and `npm run test:api`

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



