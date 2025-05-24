// frontend/src/utils/contract.js
// Example integration with the deployed SkillToken contract

import { ethers } from 'ethers';

// Contract ABI (you'll need to copy this from contracts/out/SkillToken.sol/SkillToken.json after compilation)
const SKILLTOKEN_ABI = [
    // Add the full ABI here after contract compilation
    "function registerCourse(string memory name) external returns (uint256)",
    "function issueCertificate(address student, uint256 courseId, string memory filecoinHash, string memory tokenURI) external returns (uint256)",
    "function validate(uint256 tokenId) external",
    "function delegateIssuer(address issuer) external",
    "function hasCompletedCourse(address student, uint256 courseId) external view returns (bool)",
    "function getStudentCertificates(address student) external view returns (uint256[] memory)",
    "function getTeacherCourses(address teacher) external view returns (uint256[] memory)",
    "function getCertificate(uint256 tokenId) external view returns (tuple(address student, uint256 courseId, string filecoinHash, address issuer, uint256 issuedAt, bool validated))",
    "function getCourse(uint256 courseId) external view returns (tuple(string name, address owner, bool active, uint256 createdAt))",
    "function totalCertificates() external view returns (uint256)",
    "function totalCourses() external view returns (uint256)",
    "function hasRole(bytes32 role, address account) external view returns (bool)",
    "function TEACHER_ROLE() external view returns (bytes32)",
    "function ISSUER_ROLE() external view returns (bytes32)",
    "event CourseRegistered(uint256 indexed courseId, string name, address indexed owner)",
    "event CertificateIssued(uint256 indexed tokenId, address indexed student, uint256 indexed courseId, address issuer, string filecoinHash)",
    "event CertificateValidated(uint256 indexed tokenId, address indexed validator, address indexed student, uint256 courseId)"
];

// Contract configuration
const CONTRACT_CONFIG = {
    address: process.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    chainId: parseInt(process.env.VITE_CHAIN_ID) || 31337,
    rpcUrl: process.env.VITE_RPC_URL || "http://127.0.0.1:8545"
};

class SkillTokenContract {
    constructor() {
        this.contract = null;
        this.provider = null;
        this.signer = null;
    }

    // Initialize the contract connection
    async init() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                this.signer = this.provider.getSigner();
                this.contract = new ethers.Contract(CONTRACT_CONFIG.address, SKILLTOKEN_ABI, this.signer);
                
                console.log('Contract initialized successfully');
                return true;
            } else {
                throw new Error('MetaMask not found');
            }
        } catch (error) {
            console.error('Failed to initialize contract:', error);
            return false;
        }
    }

    // Connect to MetaMask
    async connectWallet() {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Switch to local network if needed
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(CONTRACT_CONFIG.chainId) }],
                });
            } catch (switchError) {
                // If the network doesn't exist, add it
                if (switchError.code === 4902) {
                    await this.addLocalNetwork();
                }
            }
            
            const address = await this.signer.getAddress();
            console.log('Connected wallet:', address);
            return address;
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    }

    // Add local Anvil network to MetaMask
    async addLocalNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: ethers.utils.hexValue(CONTRACT_CONFIG.chainId),
                    chainName: 'Anvil Local',
                    nativeCurrency: {
                        name: 'Ethereum',
                        symbol: 'ETH',
                        decimals: 18
                    },
                    rpcUrls: [CONTRACT_CONFIG.rpcUrl],
                    blockExplorerUrls: null
                }]
            });
        } catch (error) {
            console.error('Failed to add local network:', error);
            throw error;
        }
    }

    // Check user role
    async getUserRole(address) {
        try {
            const teacherRole = await this.contract.TEACHER_ROLE();
            const issuerRole = await this.contract.ISSUER_ROLE();
            
            const isTeacher = await this.contract.hasRole(teacherRole, address);
            const isIssuer = await this.contract.hasRole(issuerRole, address);
            
            return {
                isTeacher,
                isIssuer,
                isStudent: !isTeacher && !isIssuer
            };
        } catch (error) {
            console.error('Failed to get user role:', error);
            return { isTeacher: false, isIssuer: false, isStudent: true };
        }
    }

    // Teacher functions
    async registerCourse(courseName) {
        try {
            const tx = await this.contract.registerCourse(courseName);
            const receipt = await tx.wait();
            
            // Extract course ID from event
            const event = receipt.events.find(e => e.event === 'CourseRegistered');
            const courseId = event.args.courseId.toNumber();
            
            console.log('Course registered:', { courseId, courseName });
            return { courseId, txHash: tx.hash };
        } catch (error) {
            console.error('Failed to register course:', error);
            throw error;
        }
    }

    async getTeacherCourses(teacherAddress) {
        try {
            const courseIds = await this.contract.getTeacherCourses(teacherAddress);
            const courses = [];
            
            for (const courseId of courseIds) {
                const course = await this.contract.getCourse(courseId);
                courses.push({
                    id: courseId.toNumber(),
                    name: course.name,
                    owner: course.owner,
                    active: course.active,
                    createdAt: new Date(course.createdAt.toNumber() * 1000)
                });
            }
            
            return courses;
        } catch (error) {
            console.error('Failed to get teacher courses:', error);
            throw error;
        }
    }

    // Issuer functions
    async issueCertificate(studentAddress, courseId, filecoinHash, tokenURI) {
        try {
            const tx = await this.contract.issueCertificate(
                studentAddress,
                courseId,
                filecoinHash,
                tokenURI
            );
            const receipt = await tx.wait();
            
            // Extract token ID from event
            const event = receipt.events.find(e => e.event === 'CertificateIssued');
            const tokenId = event.args.tokenId.toNumber();
            
            console.log('Certificate issued:', { tokenId, studentAddress, courseId });
            return { tokenId, txHash: tx.hash };
        } catch (error) {
            console.error('Failed to issue certificate:', error);
            throw error;
        }
    }

    async validateCertificate(tokenId) {
        try {
            const tx = await this.contract.validate(tokenId);
            await tx.wait();
            
            console.log('Certificate validated:', tokenId);
            return tx.hash;
        } catch (error) {
            console.error('Failed to validate certificate:', error);
            throw error;
        }
    }

    // Student functions
    async getStudentCertificates(studentAddress) {
        try {
            const tokenIds = await this.contract.getStudentCertificates(studentAddress);
            const certificates = [];
            
            for (const tokenId of tokenIds) {
                const cert = await this.contract.getCertificate(tokenId);
                const course = await this.contract.getCourse(cert.courseId);
                
                certificates.push({
                    tokenId: tokenId.toNumber(),
                    student: cert.student,
                    courseId: cert.courseId.toNumber(),
                    courseName: course.name,
                    filecoinHash: cert.filecoinHash,
                    issuer: cert.issuer,
                    issuedAt: new Date(cert.issuedAt.toNumber() * 1000),
                    validated: cert.validated
                });
            }
            
            return certificates;
        } catch (error) {
            console.error('Failed to get student certificates:', error);
            throw error;
        }
    }

    // Public functions
    async getCertificateByTokenId(tokenId) {
        try {
            const cert = await this.contract.getCertificate(tokenId);
            const course = await this.contract.getCourse(cert.courseId);
            
            return {
                tokenId,
                student: cert.student,
                courseId: cert.courseId.toNumber(),
                courseName: course.name,
                filecoinHash: cert.filecoinHash,
                issuer: cert.issuer,
                issuedAt: new Date(cert.issuedAt.toNumber() * 1000),
                validated: cert.validated
            };
        } catch (error) {
            console.error('Failed to get certificate:', error);
            throw error;
        }
    }

    async getTotalStats() {
        try {
            const totalCertificates = await this.contract.totalCertificates();
            const totalCourses = await this.contract.totalCourses();
            
            return {
                totalCertificates: totalCertificates.toNumber(),
                totalCourses: totalCourses.toNumber()
            };
        } catch (error) {
            console.error('Failed to get total stats:', error);
            throw error;
        }
    }

    // Event listeners
    onCourseRegistered(callback) {
        this.contract.on('CourseRegistered', (courseId, name, owner, event) => {
            callback({
                courseId: courseId.toNumber(),
                name,
                owner,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash
            });
        });
    }

    onCertificateIssued(callback) {
        this.contract.on('CertificateIssued', (tokenId, student, courseId, issuer, filecoinHash, event) => {
            callback({
                tokenId: tokenId.toNumber(),
                student,
                courseId: courseId.toNumber(),
                issuer,
                filecoinHash,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash
            });
        });
    }

    onCertificateValidated(callback) {
        this.contract.on('CertificateValidated', (tokenId, validator, student, courseId, event) => {
            callback({
                tokenId: tokenId.toNumber(),
                validator,
                student,
                courseId: courseId.toNumber(),
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash
            });
        });
    }
}

// Export singleton instance
export const skillTokenContract = new SkillTokenContract();
export default skillTokenContract;