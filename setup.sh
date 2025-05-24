#!/bin/bash

# SkillToken Development Environment Setup Script

set -e  # Exit on any error

echo "🚀 Setting up SkillToken Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed. Please install Node.js v18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is required but not installed."
        exit 1
    fi
    
    # Check for Foundry
    if ! command -v forge &> /dev/null; then
        print_error "Foundry is required but not installed."
        print_status "Install Foundry by running: curl -L https://foundry.paradigm.xyz | bash"
        print_status "Then run: foundryup"
        exit 1
    fi
    
    # Check for git
    if ! command -v git &> /dev/null; then
        print_error "Git is required but not installed."
        exit 1
    fi
    
    print_success "All dependencies are installed!"
}

# Create directory structure
create_structure() {
    print_status "Creating project structure..."
    
    # Create contracts directory if it doesn't exist
    if [ ! -d "contracts" ]; then
        mkdir -p contracts
        print_success "Created contracts directory structure"
    fi
    
    # Create frontend directory if it doesn't exist (assuming it exists)
    if [ ! -d "frontend" ]; then
        print_warning "Frontend directory not found. Please ensure your frontend code is in the 'frontend' directory."
    fi
}

# Initialize Foundry project
init_foundry() {
    print_status "Initializing Foundry project..."
    
    cd contracts
    
    # Initialize forge if not already done
    if [ ! -f "foundry.toml" ]; then
        forge init --no-git .
        print_success "Initialized Foundry project"
    fi
    
    # Install OpenZeppelin contracts
    if [ ! -d "lib/openzeppelin-contracts" ]; then
        forge install OpenZeppelin/openzeppelin-contracts --no-git
        print_success "Installed OpenZeppelin contracts"
    fi
    
    # Install forge-std
    if [ ! -d "lib/forge-std" ]; then
        forge install foundry-rs/forge-std --no-git
        print_success "Installed Forge standard library"
    fi
    
    cd ..
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
            print_warning "Please edit .env file with your configuration"
        else
            print_warning ".env.example not found. Please create .env file manually"
        fi
    else
        print_warning ".env file already exists. Skipping creation."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        npm install
        print_success "Installed root dependencies"
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        cd frontend
        npm install
        cd ..
        print_success "Installed frontend dependencies"
    fi
}

# Build contracts
build_contracts() {
    print_status "Building contracts..."
    
    cd contracts
    forge build
    
    if [ $? -eq 0 ]; then
        print_success "Contracts built successfully"
    else
        print_error "Failed to build contracts"
        exit 1
    fi
    
    cd ..
}

# Run tests
run_tests() {
    print_status "Running contract tests..."
    
    cd contracts
    forge test
    
    if [ $? -eq 0 ]; then
        print_success "All tests passed!"
    else
        print_warning "Some tests failed. Please check the output above."
    fi
    
    cd ..
}

# Main setup process
main() {
    echo "========================================="
    echo "🎓 SkillToken Development Setup"
    echo "========================================="
    
    check_dependencies
    create_structure
    init_foundry
    setup_env
    install_dependencies
    build_contracts
    run_tests
    
    echo ""
    echo "========================================="
    print_success "Setup completed successfully! 🎉"
    echo "========================================="
    echo ""
    echo "📋 Next steps:"
    echo "   1. Edit .env file with your configuration"
    echo "   2. Start local blockchain: npm run anvil"
    echo "   3. Deploy contracts: npm run deploy:local"
    echo "   4. Start frontend: npm run frontend"
    echo ""
    echo "🔧 Available commands:"
    echo "   npm run anvil          - Start local blockchain"
    echo "   npm run deploy:local   - Deploy to local network"
    echo "   npm run test          - Run contract tests"
    echo "   npm run frontend      - Start frontend dev server"
    echo "   npm run dev           - Start everything (anvil + deploy + frontend)"
    echo ""
    echo "📚 Documentation:"
    echo "   - Foundry: https://book.getfoundry.sh/"
    echo "   - Web3.Storage: https://web3.storage/docs/"
    echo ""
}

# Run the main function
main "$@"