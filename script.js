// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const preloader = document.querySelector('.preloader');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('themeToggle');
    const uploadModal = document.getElementById('uploadModal');
    const uploadTrigger = document.getElementById('uploadTrigger');
    const closeModal = document.getElementById('closeModal');
    const cancelUpload = document.getElementById('cancelUpload');
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const generateBtn = document.getElementById('generateAvatar');
    const comparisonSlider = document.querySelector('.comparison-slider');
    const styleOptions = document.querySelector('.style-options');
    const stylesGrid = document.querySelector('.styles-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Initialize
    initPreloader();
    initNavigation();
    initTheme();
    initModal();
    initFileUpload();
    initImageComparison();
    initAnimeStyles();
    initFiltering();
    initAnimations();
    
    // Preloader
    function initPreloader() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    // Navigation
    function initNavigation() {
        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        // Close mobile menu if open
                        navLinks.classList.remove('active');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            });
        });
    }
    
    // Theme Toggle
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
    
    // Modal Controls
    function initModal() {
        uploadTrigger.addEventListener('click', () => {
            uploadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        [closeModal, cancelUpload].forEach(btn => {
            btn.addEventListener('click', () => {
                uploadModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close modal on outside click
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                uploadModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && uploadModal.classList.contains('active')) {
                uploadModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // File Upload
    function initFileUpload() {
        // Click to upload
        dropArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
            dropArea.style.borderColor = '#764ba2';
        }
        
        function unhighlight() {
            dropArea.style.backgroundColor = '';
            dropArea.style.borderColor = 'var(--primary)';
        }
        
        // Handle dropped files
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // Handle file input
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    // Preview image
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        dropArea.innerHTML = `
                            <img src="${e.target.result}" class="upload-preview" alt="Preview">
                            <p>${file.name}</p>
                            <button class="btn btn-sm btn-outline" id="changeImage">
                                <i class="fas fa-sync"></i> Change Image
                            </button>
                        `;
                        
                        document.getElementById('changeImage').addEventListener('click', (e) => {
                            e.stopPropagation();
                            dropArea.innerHTML = `
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <h4>Drag & Drop Your Photo</h4>
                                <p>or click to browse files</p>
                                <p class="upload-note">Supports JPG, PNG up to 10MB</p>
                            `;
                            fileInput.value = '';
                            initFileUpload(); // Reinitialize listeners
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select an image file (JPG, PNG)');
                }
            }
        }
        
        // Generate button
        generateBtn.addEventListener('click', () => {
            // Here you would integrate with your AI API
            // For now, show a success message
            const selectedStyle = document.querySelector('.style-option.selected');
            if (!selectedStyle) {
                alert('Please select an anime style first!');
                return;
            }
            
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            generateBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                generateBtn.innerHTML = '<i class="fas fa-check"></i> Avatar Generated!';
                generateBtn.classList.remove('btn-primary');
                generateBtn.classList.add('btn-success');
                
                setTimeout(() => {
                    alert('Avatar generated successfully! Check your downloads.');
                    uploadModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    generateBtn.innerHTML = '<i class="fas fa-wand-sparkles"></i> Generate Avatar';
                    generateBtn.disabled = false;
                    generateBtn.classList.remove('btn-success');
                    generateBtn.classList.add('btn-primary');
                }, 1000);
            }, 2000);
        });
    }
    
    // Image Comparison Slider
    function initImageComparison() {
        if (!comparisonSlider) return;
        
        let isDragging = false;
        const handle = comparisonSlider.querySelector('.slider-handle');
        const animeImg = comparisonSlider.querySelector('.anime-img');
        
        function updateSlider(x) {
            const rect = comparisonSlider.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            
            animeImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            handle.style.left = `${percentage}%`;
        }
        
        comparisonSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSlider(e.clientX);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Touch support
        comparisonSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSlider(e.touches[0].clientX);
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
    
    // Anime Styles
    function initAnimeStyles() {
        const styles = [
            {
                id: 'shonen',
                name: 'Shonen Style',
                category: 'shonen',
                description: 'Action-packed style with bold colors and dynamic poses',
                image: 'https://via.placeholder.com/400x200/FF6B6B/ffffff?text=Shonen+Style'
            },
            {
                id: 'shojo',
                name: 'Shojo Style',
                category: 'shojo',
                description: 'Romantic and elegant style with beautiful details',
                image: 'https://via.placeholder.com/400x200/4ECDC4/ffffff?text=Shojo+Style'
            },
            {
                id: 'seinen',
                name: 'Seinen Style',
                category: 'seinen',
                description: 'Mature and realistic art style for adult audiences',
                image: 'https://via.placeholder.com/400x200/45B7D1/ffffff?text=Seinen+Style'
            },
            {
                id: 'isekai',
                name: 'Isekai Fantasy',
                category: 'isekai',
                description: 'Fantasy world style with magical elements',
                image: 'https://via.placeholder.com/400x200/96CEB4/ffffff?text=Isekai+Fantasy'
            },
            {
                id: 'chibi',
                name: 'Chibi Style',
                category: 'chibi',
                description: 'Super-deformed cute style with exaggerated features',
                image: 'https://via.placeholder.com/400x200/FECA57/ffffff?text=Chibi+Style'
            },
            {
                id: 'mecha',
                name: 'Mecha Style',
                category: 'seinen',
                description: 'Sci-fi style with robotic and futuristic elements',
                image: 'https://via.placeholder.com/400x200/54A0FF/ffffff?text=Mecha+Style'
            },
            {
                id: 'vintage',
                name: 'Vintage Anime',
                category: 'classic',
                description: 'Classic 90s anime style with retro colors',
                image: 'https://via.placeholder.com/400x200/5F27CD/ffffff?text=Vintage+Anime'
            },
            {
                id: 'modern',
                name: 'Modern Anime',
                category: 'modern',
                description: 'Contemporary anime style with clean lines',
                image: 'https://via.placeholder.com/400x200/00D2D3/ffffff?text=Modern+Anime'
            }
        ];
        
        // Populate styles grid
        styles.forEach(style => {
            const styleCard = document.createElement('div');
            styleCard.className = 'style-card';
            styleCard.dataset.category = style.category;
            
            styleCard.innerHTML = `
                <img src="${style.image}" alt="${style.name}" class="style-image">
                <div class="style-content">
                    <span class="style-badge">${style.category.toUpperCase()}</span>
                    <h3>${style.name}</h3>
                    <p>${style.description}</p>
                </div>
            `;
            
            styleCard.addEventListener('click', () => {
                alert(`Selected: ${style.name}`);
                // Here you would trigger style selection
            });
            
            stylesGrid.appendChild(styleCard);
        });
        
        // Populate modal style options
        styles.forEach(style => {
            const option = document.createElement('div');
            option.className = 'style-option';
            option.dataset.style = style.id;
            option.innerHTML = `
                <i class="fas fa-palette"></i>
                <p>${style.name}</p>
            `;
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.style-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
            });
            
            styleOptions.appendChild(option);
        });
    }
    
    // Filtering
    function initFiltering() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter styles
                const filter = button.dataset.filter;
                const styleCards = document.querySelectorAll('.style-card');
                
                styleCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Animations
    function initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.feature-card, .style-card').forEach(el => {
            observer.observe(el);
        });
        
        // Floating elements animation
        const floatElements = document.querySelectorAll('.float-icon');
        floatElements.forEach((el, index) => {
            el.style.left = `${Math.random() * 90}%`;
            el.style.top = `${Math.random() * 90}%`;
            el.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    // Start creating button
    document.getElementById('startCreating').addEventListener('click', () => {
        window.scrollTo({
            top: document.querySelector('.hero').offsetTop,
            behavior: 'smooth'
        });
        setTimeout(() => {
            uploadTrigger.click();
        }, 500);
    });
});

// Avatar Generator Logic
class AvatarGenerator {
    constructor() {
        this.selectedStyle = null;
        this.uploadedImage = null;
        this.apiEndpoint = 'YOUR_API_ENDPOINT'; // Replace with your actual API endpoint
    }
    
    async generateAvatar(imageData, styleId) {
        try {
            // Here you would make the actual API call
            // Example using fetch:
            /*
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData,
                    style: styleId
                })
            });
            
            const result = await response.json();
            return result.avatarUrl;
            */
            
            // For demo purposes, return a placeholder
            return 'https://via.placeholder.com/400x450/764ba2/ffffff?text=Generated+Anime+Avatar';
            
        } catch (error) {
            console.error('Error generating avatar:', error);
            throw error;
        }
    }
    
    downloadAvatar(avatarUrl, filename = 'anime-avatar.png') {
        const link = document.createElement('a');
        link.href = avatarUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize avatar generator
window.avatarGenerator = new AvatarGenerator();
