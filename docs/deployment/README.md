# 🚀 Deployment Guide

Complete guide for deploying the Eye Vessel Segmentation API to production environments.

## 📋 Deployment Options

| Option | Complexity | Best For | Cost | Setup Time |
|--------|------------|----------|------|------------|
| **Docker Compose** | Low | Small deployments | Low | 15 min |
| **Kubernetes** | Medium | Scalable systems | Medium | 1-2 hours |
| **Cloud Services** | Low-Medium | Managed hosting | Variable | 30-60 min |
| **Serverless** | Medium | Event-driven | Pay-per-use | 1-2 hours |

## 🐳 Docker Compose Deployment (Recommended)

### Production Docker Setup

#### 1. Production Configuration

```bash
# Clone repository
git clone <repository-url>
cd LXthon

# Copy production environment
cp .env.example .env.production

# Edit production settings
nano .env.production
```

**Production Environment Variables:**

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
API_HOST=0.0.0.0
API_PORT=8001
MODEL_PATH=/app/models/unet_eye_segmentation.keras
LOG_LEVEL=INFO
CORS_ORIGINS=["https://your-frontend-domain.com"]
REDIS_URL=redis://redis:6379
DATABASE_URL=postgresql://user:pass@db:5432/eyevessel
```

#### 2. Production Deployment

```bash
# Build and start production containers
docker-compose -f deployment/docker/docker-compose.prod.yml up -d --build

# Check status
docker-compose -f deployment/docker/docker-compose.prod.yml ps

# View logs
docker-compose -f deployment/docker/docker-compose.prod.yml logs -f
```

#### 3. Health Check

```bash
# Test backend health
curl https://your-api-domain.com/health

# Test frontend
curl https://your-frontend-domain.com

# Test prediction endpoint
curl -X POST "https://your-api-domain.com/predict/file" \
  -F "image=@test_image.jpg"
```

### Docker Compose Configuration

**deployment/docker/docker-compose.prod.yml:**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ../../src/backend
      dockerfile: Dockerfile.prod
    ports:
      - "8001:8001"
    environment:
      - NODE_ENV=production
      - MODEL_PATH=/app/models/unet_eye_segmentation.keras
    volumes:
      - ../../data/models:/app/models:ro
      - backend_logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
        reservations:
          memory: 2G
          cpus: '1.0'

  frontend:
    build:
      context: ../../src/frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:8001
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  backend_logs:
  redis_data:
```

## ☸️ Kubernetes Deployment

### 1. Kubernetes Manifests

#### Backend Deployment

```yaml
# deployment/kubernetes/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eyevessel-backend
  labels:
    app: eyevessel-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eyevessel-backend
  template:
    metadata:
      labels:
        app: eyevessel-backend
    spec:
      containers:
      - name: backend
        image: eyevessel/backend:latest
        ports:
        - containerPort: 8001
        env:
        - name: MODEL_PATH
          value: "/app/models/unet_eye_segmentation.keras"
        - name: LOG_LEVEL
          value: "INFO"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: model-storage
          mountPath: /app/models
          readOnly: true
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-pvc
```

#### Frontend Deployment

```yaml
# deployment/kubernetes/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eyevessel-frontend
  labels:
    app: eyevessel-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: eyevessel-frontend
  template:
    metadata:
      labels:
        app: eyevessel-frontend
    spec:
      containers:
      - name: frontend
        image: eyevessel/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://eyevessel-backend-service:8001"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### 2. Services and Ingress

```yaml
# deployment/kubernetes/services.yaml
apiVersion: v1
kind: Service
metadata:
  name: eyevessel-backend-service
spec:
  selector:
    app: eyevessel-backend
  ports:
  - port: 8001
    targetPort: 8001
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: eyevessel-frontend-service
spec:
  selector:
    app: eyevessel-frontend
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: eyevessel-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: eyevessel-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: eyevessel-backend-service
            port:
              number: 8001
      - path: /
        pathType: Prefix
        backend:
          service:
            name: eyevessel-frontend-service
            port:
              number: 3000
```

### 3. Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f deployment/kubernetes/

# Check deployment status
kubectl get deployments
kubectl get services
kubectl get ingress

# View logs
kubectl logs -l app=eyevessel-backend
kubectl logs -l app=eyevessel-frontend

# Scale deployment
kubectl scale deployment eyevessel-backend --replicas=5
```

## ☁️ Cloud Platform Deployment

### AWS ECS Deployment

#### 1. Task Definition

```json
{
  "family": "eyevessel-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-ecr-repo/eyevessel-backend:latest",
      "portMappings": [
        {
          "containerPort": 8001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "MODEL_PATH",
          "value": "/app/models/unet_eye_segmentation.keras"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/eyevessel-backend",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### 2. ECS Service

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name eyevessel-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster eyevessel-cluster \
  --service-name eyevessel-backend \
  --task-definition eyevessel-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678],securityGroups=[sg-12345678],assignPublicIp=ENABLED}"
```

### Google Cloud Run

```bash
# Build and push to Google Container Registry
docker build -t gcr.io/your-project/eyevessel-backend src/backend/
docker push gcr.io/your-project/eyevessel-backend

# Deploy to Cloud Run
gcloud run deploy eyevessel-backend \
  --image gcr.io/your-project/eyevessel-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10
```

### Azure Container Instances

```bash
# Create resource group
az group create --name eyevessel-rg --location eastus

# Deploy container
az container create \
  --resource-group eyevessel-rg \
  --name eyevessel-backend \
  --image your-registry/eyevessel-backend:latest \
  --cpu 2 \
  --memory 4 \
  --ports 8001 \
  --environment-variables MODEL_PATH=/app/models/unet_eye_segmentation.keras
```

## 🔧 Configuration Management

### Environment-Specific Configurations

#### Development
```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=DEBUG
API_RATE_LIMIT=100
CACHE_TTL=60
```

#### Staging
```bash
# .env.staging
NODE_ENV=staging
LOG_LEVEL=INFO
API_RATE_LIMIT=50
CACHE_TTL=300
```

#### Production
```bash
# .env.production
NODE_ENV=production
LOG_LEVEL=WARNING
API_RATE_LIMIT=20
CACHE_TTL=3600
```

### Secrets Management

#### Using Docker Secrets

```bash
# Create secrets
echo "your-secret-key" | docker secret create api_secret_key -
echo "db-password" | docker secret create db_password -

# Use in compose file
services:
  backend:
    secrets:
      - api_secret_key
      - db_password
    environment:
      - SECRET_KEY_FILE=/run/secrets/api_secret_key

secrets:
  api_secret_key:
    external: true
  db_password:
    external: true
```

#### Using Kubernetes Secrets

```bash
# Create secret
kubectl create secret generic eyevessel-secrets \
  --from-literal=api-key=your-secret-key \
  --from-literal=db-password=your-db-password

# Use in deployment
env:
- name: API_KEY
  valueFrom:
    secretKeyRef:
      name: eyevessel-secrets
      key: api-key
```

## 📊 Monitoring and Logging

### Application Monitoring

#### Prometheus + Grafana Setup

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'eyevessel-backend'
    static_configs:
      - targets: ['backend:8001']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'eyevessel-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
```

#### Health Check Endpoints

```python
# Add to FastAPI app
from prometheus_client import Counter, Histogram, generate_latest

request_count = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

### Logging Configuration

#### Structured Logging

```python
# logging_config.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        return json.dumps(log_entry)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
```

#### Log Aggregation

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:7.15.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.15.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

## 🔒 Security Configuration

### HTTPS/TLS Setup

#### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location /api {
        proxy_pass http://backend:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Let's Encrypt SSL

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### API Security

#### Rate Limiting

```python
from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/predict")
@limiter.limit("5/minute")
async def predict(request: Request, ...):
    # Prediction logic
    pass
```

#### CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## 🚀 Performance Optimization

### Database Optimization

#### PostgreSQL Configuration

```sql
-- Create optimized database
CREATE DATABASE eyevessel;

-- Create indexes for fast queries
CREATE INDEX idx_predictions_created_at ON predictions(created_at);
CREATE INDEX idx_predictions_user_id ON predictions(user_id);

-- Optimize for read-heavy workload
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET random_page_cost = 1.1;
```

#### Redis Caching

```python
import redis
from functools import wraps

redis_client = redis.Redis(host='redis', port=6379, db=0)

def cache_result(ttl=3600):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator

@cache_result(ttl=1800)
async def predict_vessel_segmentation(image_data):
    # Expensive ML prediction
    pass
```

### CDN Setup

#### CloudFlare Configuration

```bash
# Set up CloudFlare for static assets
# 1. Point DNS to CloudFlare
# 2. Configure caching rules
# 3. Enable minification
# 4. Set up page rules for API endpoints
```

#### AWS CloudFront

```json
{
  "DistributionConfig": {
    "CallerReference": "eyevessel-cdn",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "eyevessel-origin",
          "DomainName": "your-domain.com",
          "CustomOriginConfig": {
            "HTTPPort": 443,
            "HTTPSPort": 443,
            "OriginProtocolPolicy": "https-only"
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "eyevessel-origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      },
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      }
    },
    "Enabled": true
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run tests
      run: |
        make test
        make security-check

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker images
      run: |
        docker build -t ${{ secrets.REGISTRY }}/eyevessel-backend:${{ github.sha }} src/backend
        docker build -t ${{ secrets.REGISTRY }}/eyevessel-frontend:${{ github.sha }} src/frontend
    
    - name: Push to registry
      run: |
        echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin
        docker push ${{ secrets.REGISTRY }}/eyevessel-backend:${{ github.sha }}
        docker push ${{ secrets.REGISTRY }}/eyevessel-frontend:${{ github.sha }}
    
    - name: Deploy to production
      run: |
        # Deploy using your preferred method
        kubectl set image deployment/eyevessel-backend backend=${{ secrets.REGISTRY }}/eyevessel-backend:${{ github.sha }}
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] Tests passing
- [ ] Security scan completed
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations applied
- [ ] Monitoring configured
- [ ] Backup strategy in place

### Deployment

- [ ] Deploy to staging first
- [ ] Smoke tests passing
- [ ] Performance tests passing
- [ ] Security tests passing
- [ ] Deploy to production
- [ ] Health checks passing

### Post-deployment

- [ ] Monitor application logs
- [ ] Check error rates
- [ ] Verify performance metrics
- [ ] Test critical user paths
- [ ] Update documentation
- [ ] Notify stakeholders

## 📞 Support

For deployment issues:
- **📚 Documentation**: [docs/deployment/](./README.md)
- **🐛 Issues**: GitHub Issues
- **💬 Discussions**: GitHub Discussions
- **📧 Emergency**: team@prometheus.dev

---

<div align="center">
  <b>🚀 Ready for Production! 🚀</b>
</div>
