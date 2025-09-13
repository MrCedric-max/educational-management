# Educational Management System - Production Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- PostgreSQL 12+
- Redis 6+ (optional)
- Docker & Docker Compose (optional)

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy
```bash
# Development
npm run deploy:dev

# Staging
npm run deploy:staging

# Production
npm run deploy:prod
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Copy environment file
cp env.production .env

# Edit environment variables
nano .env

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Using Docker
```bash
# Build image
docker build -t educational-management .

# Run container
docker run -d \
  --name educational-management \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_PASSWORD=your-password \
  educational-management
```

## ☸️ Kubernetes Deployment

### 1. Create namespace and secrets
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
```

### 2. Deploy application
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 3. Check deployment
```bash
kubectl get pods -n educational-management
kubectl get services -n educational-management
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | `development` | Yes |
| `PORT` | Server port | `3001` | No |
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | No |
| `DB_NAME` | Database name | `educational_management` | Yes |
| `DB_USER` | Database user | `postgres` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - | Yes |
| `FRONTEND_URL` | Frontend URL | `http://localhost:3000` | No |
| `ALLOWED_ORIGINS` | CORS origins | `http://localhost:3000` | No |
| `REDIS_HOST` | Redis host | `localhost` | No |
| `REDIS_PORT` | Redis port | `6379` | No |
| `REDIS_PASSWORD` | Redis password | - | No |
| `LOG_LEVEL` | Log level | `info` | No |
| `LOG_FILE` | Log file path | `./logs/app.log` | No |

### Security Configuration

#### JWT Secrets
Generate strong secrets:
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate refresh secret
openssl rand -base64 32
```

#### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access
- Regular backups

#### CORS Configuration
```bash
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📊 Monitoring

### Health Checks
- **Basic**: `GET /health`
- **Detailed**: `GET /health/detailed`
- **Readiness**: `GET /health/ready`
- **Liveness**: `GET /health/live`
- **Metrics**: `GET /health/metrics`

### Logs
```bash
# View logs
npm run logs

# Docker logs
docker-compose logs -f app

# Kubernetes logs
kubectl logs -f deployment/educational-management-app -n educational-management
```

### Metrics
The application provides built-in metrics:
- Request count and error rate
- Response time statistics
- Memory and CPU usage
- Database connection status

## 🔄 Maintenance

### Database Migrations
```bash
# Run migrations
npm run migrate

# Docker
docker-compose exec app npm run migrate
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
npm run build
npm run deploy:prod

# Docker
docker-compose pull
docker-compose up -d
```

### Backups
```bash
# Database backup
pg_dump -h localhost -U postgres educational_management > backup.sql

# Restore
psql -h localhost -U postgres educational_management < backup.sql
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d educational_management
```

#### 2. Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### 3. Permission Denied
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/educational-management
sudo chmod -R 755 /var/www/educational-management
```

#### 4. Memory Issues
```bash
# Check memory usage
free -h
top -p $(pgrep node)

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=2048"
```

### Log Analysis
```bash
# Error logs
grep "ERROR" logs/app.log

# Slow requests
grep "slow" logs/app.log

# Authentication failures
grep "auth" logs/app.log
```

## 📈 Performance Tuning

### Node.js Optimization
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=2048"

# Enable clustering
export NODE_CLUSTER=true
```

### Database Optimization
- Enable connection pooling
- Add database indexes
- Regular VACUUM and ANALYZE
- Monitor slow queries

### Nginx Optimization
- Enable gzip compression
- Configure caching
- Set up rate limiting
- Use HTTP/2

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Use HTTPS in production
- [ ] Configure firewall rules
- [ ] Enable database SSL
- [ ] Set up log monitoring
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Access control
- [ ] Input validation
- [ ] Rate limiting

## 📞 Support

For production support:
- Check logs: `npm run logs`
- Health check: `curl http://localhost:3001/health`
- Metrics: `curl http://localhost:3001/health/metrics`

## 📚 Additional Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Kubernetes Production Patterns](https://kubernetes.io/docs/concepts/workloads/)




