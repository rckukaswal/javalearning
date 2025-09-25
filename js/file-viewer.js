// Enhanced file viewer functionality
class FileViewer {
    constructor() {
        this.currentFile = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSearch();
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k':
                        e.preventDefault();
                        document.getElementById('searchInput').focus();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.searchFiles, 300));
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    searchFiles(event) {
        const searchTerm = event.target.value.toLowerCase();
        const fileCards = document.querySelectorAll('.program-card');
        
        fileCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('search-highlight');
            } else {
                card.style.display = 'none';
                card.classList.remove('search-highlight');
            }
        });
    }

    viewFile(file) {
        this.currentFile = file;
        this.showModal(file);
    }

    showModal(file) {
        const modal = document.getElementById('fileModal');
        const title = document.getElementById('modalTitle');
        const code = document.getElementById('modalCode');
        
        title.textContent = file.title;
        code.textContent = file.code;
        
        this.highlightSyntax(code);
        modal.style.display = 'block';
        
        this.setupModalEvents(file);
    }

    highlightSyntax(element) {
        // Enhanced syntax highlighting
        const code = element.textContent;
        
        // Define syntax patterns
        const patterns = {
            keyword: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g,
            string: /"([^"\\]|\\.)*"/g,
            comment: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
            number: /\b\d+\b/g,
            method: /\b\w+(?=\()/g,
            annotation: /@\w+/g
        };
        
        let highlighted = code;
        
        // Apply highlighting in specific order
        highlighted = highlighted.replace(patterns.comment, '<span class="code-comment">$&</span>');
        highlighted = highlighted.replace(patterns.string, '<span class="code-string">$&</span>');
        highlighted = highlighted.replace(patterns.keyword, '<span class="code-keyword">$&</span>');
        highlighted = highlighted.replace(patterns.annotation, '<span class="code-annotation">$&</span>');
        highlighted = highlighted.replace(patterns.method, '<span class="code-method">$&</span>');
        highlighted = highlighted.replace(patterns.number, '<span class="code-number">$&</span>');
        
        element.innerHTML = highlighted;
    }

    setupModalEvents(file) {
        // Copy button
        document.getElementById('copyCode').onclick = () => {
            this.copyToClipboard(file.code);
            this.showNotification('Code copied to clipboard!', 'success');
        };

        // Download button
        document.getElementById('downloadCode').onclick = () => {
            this.downloadFile(file.filename, file.code);
            this.showNotification('File downloaded successfully!', 'success');
        };

        // Line numbers
        this.addLineNumbers();
    }

    addLineNumbers() {
        const codeElement = document.getElementById('modalCode');
        const lines = codeElement.textContent.split('\n');
        
        if (lines.length > 1) {
            let lineNumbers = '<div class="line-numbers">';
            for (let i = 1; i <= lines.length; i++) {
                lineNumbers += `<div class="line-number">${i}</div>`;
            }
            lineNumbers += '</div>';
            
            codeElement.parentElement.style.display = 'flex';
            codeElement.parentElement.innerHTML = lineNumbers + codeElement.outerHTML;
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy: ', err);
            this.showNotification('Failed to copy code!', 'error');
        });
    }

    downloadFile(filename, content) {
        try {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Download failed!', 'error');
        }
    }

    showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    toggleFullscreen() {
        const modal = document.getElementById('fileModal');
        if (!document.fullscreenElement) {
            modal.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize file viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fileViewer = new FileViewer();
});
