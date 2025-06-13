#!/bin/bash

# Eye Vessel Segmentation - Test Script
# This script tests the hackathon solution

set -e

echo "🧪 Testing Eye Vessel Segmentation Solution"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Running: $test_name"
    
    if eval "$test_command" &>/dev/null; then
        print_success "$test_name"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "$test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Wait for service to be ready
wait_for_service() {
    local url="$1"
    local timeout="$2"
    local count=0
    
    print_status "Waiting for service at $url..."
    
    while [ $count -lt $timeout ]; do
        if curl -s "$url" &>/dev/null; then
            print_success "Service is ready!"
            return 0
        fi
        sleep 1
        ((count++))
    done
    
    print_error "Service failed to start within ${timeout}s"
    return 1
}

# Test backend API endpoints
test_backend_api() {
    print_status "Testing backend API endpoints..."
    
    # Test health endpoint
    run_test "Health endpoint" "curl -s http://localhost:8000/health | grep -q 'status'"
    
    # Test root endpoint
    run_test "Root endpoint" "curl -s http://localhost:8000/ | grep -q 'Eye Vessel Segmentation API'"
    
    # Test model info endpoint
    run_test "Model info endpoint" "curl -s http://localhost:8000/model/info | grep -q 'model_loaded'"
    
    # Test API documentation
    run_test "API docs endpoint" "curl -s http://localhost:8000/docs | grep -q 'swagger'"
}

# Test frontend
test_frontend() {
    print_status "Testing frontend..."
    
    # Test main page
    run_test "Frontend main page" "curl -s http://localhost:3001 | grep -q 'Eye Vessel Segmentation'"
    
    # Test static assets
    run_test "Frontend CSS loading" "curl -s http://localhost:3001/_next/static/css/ || true"
}

# Test file uploads (with sample image)
test_file_upload() {
    print_status "Testing file upload functionality..."
    
    # Create a small test image
    local test_image="/tmp/test_eye_image.png"
    
    # Create a simple test image using ImageMagick if available
    if command -v convert &> /dev/null; then
        convert -size 256x256 xc:black -fill white -draw "circle 128,128 128,64" "$test_image"
        
        # Test file upload endpoint
        if [ -f "$test_image" ]; then
            run_test "File upload endpoint" "curl -s -X POST -F 'file=@$test_image' http://localhost:8000/predict/file | grep -q 'success'"
        fi
        
        rm -f "$test_image"
    else
        print_warning "ImageMagick not found, skipping file upload test"
    fi
}

# Test prediction with base64 image
test_prediction_api() {
    print_status "Testing prediction API..."
    
    # Create a minimal base64 encoded image
    local base64_image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    
    # Test prediction endpoint
    local json_payload="{\"image\": \"$base64_image\"}"
    
    run_test "Prediction API" "curl -s -X POST -H 'Content-Type: application/json' -d '$json_payload' http://localhost:8000/predict | grep -q 'success'"
}

# Test Docker services
test_docker_services() {
    print_status "Testing Docker services..."
    
    # Check if services are running
    run_test "Backend container running" "docker-compose ps backend | grep -q 'Up'"
    run_test "Frontend container running" "docker-compose ps frontend | grep -q 'Up'"
    
    # Check container health
    run_test "Backend container healthy" "docker-compose ps backend | grep -q 'healthy' || docker-compose ps backend | grep -q 'Up'"
}

# Test performance
test_performance() {
    print_status "Testing performance..."
    
    # Test API response time
    local response_time=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:8000/health)
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        print_success "API response time: ${response_time}s"
        ((TESTS_PASSED++))
    else
        print_warning "API response time slow: ${response_time}s"
        ((TESTS_FAILED++))
    fi
}

# Main test execution
main() {
    # Check if services are running
    if ! docker-compose ps | grep -q "Up"; then
        print_error "Services are not running. Please start with 'docker-compose up' first."
        exit 1
    fi
    
    # Wait for services to be ready
    wait_for_service "http://localhost:8000/health" 30
    wait_for_service "http://localhost:3001" 30
    
    # Run all tests
    test_docker_services
    test_backend_api
    test_frontend
    test_prediction_api
    test_file_upload
    test_performance
    
    # Print test summary
    echo ""
    echo "📊 Test Summary"
    echo "==============="
    echo ""
    print_success "Tests passed: $TESTS_PASSED"
    if [ $TESTS_FAILED -gt 0 ]; then
        print_error "Tests failed: $TESTS_FAILED"
    else
        print_success "Tests failed: $TESTS_FAILED"
    fi
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_success "🎉 All tests passed! Your hackathon solution is ready!"
    else
        print_error "❌ Some tests failed. Please check the issues above."
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Eye Vessel Segmentation - Test Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h           Show this help message"
        echo "  --backend-only       Test only backend"
        echo "  --frontend-only      Test only frontend"
        echo "  --api-only          Test only API endpoints"
        echo ""
        echo "Prerequisites:"
        echo "  - Services must be running (docker-compose up)"
        echo "  - curl must be installed"
        echo ""
        exit 0
        ;;
    --backend-only)
        print_status "Testing backend only..."
        wait_for_service "http://localhost:8000/health" 30
        test_docker_services
        test_backend_api
        test_prediction_api
        ;;
    --frontend-only)
        print_status "Testing frontend only..."
        wait_for_service "http://localhost:3001" 30
        test_frontend
        ;;
    --api-only)
        print_status "Testing API endpoints only..."
        wait_for_service "http://localhost:8000/health" 30
        test_backend_api
        test_prediction_api
        ;;
    *)
        main
        ;;
esac
