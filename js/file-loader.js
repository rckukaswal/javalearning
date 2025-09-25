// Dynamic Java File Loader
class JavaFileLoader {
    constructor() {
        this.programs = [];
        this.basePath = 'programs/';
    }

    async loadJavaFiles() {
        try {
            // Try to get file list from server (requires server-side support)
            const fileList = await this.getFileList();
            this.programs = await this.loadFileContents(fileList);
            this.displayPrograms();
        } catch (error) {
            console.log('Server file listing not available, using manual list...');
            this.loadManualFileList();
        }
    }

    async getFileList() {
        // This works if server provides directory listing
        const response = await fetch(this.basePath);
        const text = await response.text();
        
        // Parse HTML response to get file list
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = doc.querySelectorAll('a[href$=".java"]');
        
        return Array.from(links).map(link => link.href.split('/').pop());
    }

    async loadFileContents(fileList) {
        const programs = [];
        
        for (const filename of fileList) {
            try {
                const response = await fetch(`${this.basePath}${filename}`);
                const code = await response.text();
                
                programs.push({
                    id: programs.length + 1,
                    title: this.formatTitle(filename),
                    category: this.getCategory(filename),
                    description: this.generateDescription(code),
                    filename: filename,
                    code: code
                });
            } catch (error) {
                console.error(`Error loading ${filename}:`, error);
            }
        }
        
        return programs;
    }

    loadManualFileList() {
        // Manual file list - यहां आप अपनी सभी Java files के नाम add करें
        const manualFiles = [
            'HelloWorld.java',
            'ArrayPrograms.java', 
            'Loops.java',
            'OOP/Inheritance.java',
            'OOP/Polymorphism.java',
            'DataStructures/LinkedList.java',
            'DataStructures/BinaryTree.java'
            // यहां अपनी नई files add करें
        ];

        // Load each file
        manualFiles.forEach(filename => {
            this.loadSingleFile(filename);
        });
    }

    async loadSingleFile(filename) {
        try {
            const response = await fetch(`${this.basePath}${filename}`);
            if (!response.ok) return;
            
            const code = await response.text();
            
            const program = {
                id: this.programs.length + 1,
                title: this.formatTitle(filename),
                category: this.getCategory(filename),
                description: this.generateDescription(code),
                filename: filename,
                code: code
            };
            
            this.programs.push(program);
            this.displayProgram(program);
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
        }
    }

    formatTitle(filename) {
        // Remove .java extension and convert to title case
        return filename
            .replace('.java', '')
            .replace(/([A-Z])/g, ' $1')
            .replace(/([A-Za-z])([A-Z][a-z])/g, '$1 $2')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
    }

    getCategory(filename) {
        if (filename.includes('OOP/')) return 'oop';
        if (filename.includes('DataStructures/')) return 'datastructures';
        if (filename.includes('Array')) return 'arrays';
        if (filename.includes('Loop')) return 'loops';
        if (filename.includes('Hello')) return 'basic';
        return 'basic';
    }

    generateDescription(code) {
        // Extract first comment or first few lines for description
        const lines = code.split('\n');
        for (const line of lines) {
            if (line.includes('//') && line.length > 10) {
                return line.replace('//', '').trim();
            }
        }
        return 'Java program demonstrating important concepts';
    }

    displayPrograms() {
        const grid = document.getElementById('programsGrid') || 
                    document.getElementById('recentPrograms');
        if (!grid) return;

        grid.innerHTML = '';
        this.programs.forEach(program => {
            this.displayProgram(program, grid);
        });
    }

    displayProgram(program, grid = null) {
        if (!grid) {
            grid = document.getElementById('programsGrid') || 
                   document.getElementById('recentPrograms');
        }
        if (!grid) return;

        const programCard = this.createProgramCard(program);
        grid.appendChild(programCard);
    }

    createProgramCard(program) {
        const card = document.createElement('div');
        card.className = 'program-card';
        card.setAttribute('data-category', program.category);
        
        card.innerHTML = `
            <span class="category">${program.category.toUpperCase()}</span>
            <h3>${program.title}</h3>
            <p>${program.description}</p>
            <div class="program-actions">
                <button class="btn-view" data-id="${program.id}">View Code</button>
                <button class="btn-download" data-filename="${program.filename}">Download</button>
            </div>
            <div class="file-info">
                <small>File: ${program.filename}</small>
            </div>
        `;
        
        card.querySelector('.btn-view').addEventListener('click', () => {
            this.viewProgramCode(program);
        });
        
        card.querySelector('.btn-download').addEventListener('click', () => {
            this.downloadFile(program.filename, program.code);
        });
        
        return card;
    }

    viewProgramCode(program) {
        const modal = document.getElementById('fileModal');
        const title = document.getElementById('modalTitle');
        const code = document.getElementById('modalCode');
        
        if (!modal || !title || !code) {
            alert('Modal elements not found');
            return;
        }
        
        title.textContent = program.title;
        code.textContent = program.code;
        
        this.highlightSyntax(code);
        modal.style.display = 'block';
        
        this.setupModalEvents(program);
    }

    highlightSyntax(element) {
        const code = element.textContent;
        let highlighted = code
            .replace(/\b(public|class|static|void|main|String|int|boolean|char|double|float|long|short|byte)\b/g, '<span class="code-keyword">$1</span>')
            .replace(/\b(if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|throws)\b/g, '<span class="code-keyword">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="code-string">"$1"</span>')
            .replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>')
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="code-comment">$&</span>')
            .replace(/\b([0-9]+)\b/g, '<span class="code-number">$1</span>');
        
        element.innerHTML = highlighted;
    }

    setupModalEvents(program) {
        const copyBtn = document.getElementById('copyCode');
        const downloadBtn = document.getElementById('downloadCode');
        
        if (copyBtn) {
            copyBtn.onclick = () => this.copyToClipboard(program.code);
        }
        
        if (downloadBtn) {
            downloadBtn.onclick = () => this.downloadFile(program.filename, program.code);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
        }).catch(err => {
            this.showNotification('Failed to copy code!', 'error');
        });
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('File downloaded successfully!', 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.javaFileLoader = new JavaFileLoader();
    window.javaFileLoader.loadJavaFiles();
});
