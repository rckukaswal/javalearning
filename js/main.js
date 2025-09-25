// Enhanced Java File Loader
class JavaFileLoader {
    constructor() {
        this.programs = [];
        this.basePath = 'programs/';
    }

    async loadJavaFiles() {
        this.showLoading();
        
        try {
            // Try to get file list automatically
            const fileList = await this.getFileList();
            if (fileList.length > 0) {
                await this.loadFileContents(fileList);
            } else {
                // Fallback to manual list
                this.loadManualFileList();
            }
        } catch (error) {
            console.log('Using manual file list...');
            this.loadManualFileList();
        }
        
        this.displayPrograms();
        this.hideLoading();
        this.updateFileCount();
    }

    async getFileList() {
        try {
            const response = await fetch(this.basePath);
            if (!response.ok) throw new Error('Directory listing not available');
            
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = Array.from(doc.querySelectorAll('a[href$=".java"]'));
            
            return links.map(link => {
                const href = link.getAttribute('href');
                return href.startsWith('http') ? new URL(href).pathname.split('/').pop() : href;
            }).filter(Boolean);
        } catch (error) {
            return [];
        }
    }

    loadManualFileList() {
        // यहां अपनी सभी Java files के नाम add करें
        const manualFiles = [
            'HelloWorld.java',
            'ArrayPrograms.java',
            'Loops.java',
            'OOP/Inheritance.java',
            'OOP/Polymorphism.java',
            'DataStructures/LinkedList.java',
            'DataStructures/BinaryTree.java'
            // अपनी नई files यहां add करें
        ];

        manualFiles.forEach(filename => {
            this.loadSingleFile(filename);
        });
    }

    async loadFileContents(fileList) {
        for (const filename of fileList) {
            await this.loadSingleFile(filename);
        }
    }

    async loadSingleFile(filename) {
        try {
            const response = await fetch(`${this.basePath}${filename}`);
            if (!response.ok) return;
            
            const code = await response.text();
            this.addProgram(filename, code);
        } catch (error) {
            console.warn(`Could not load ${filename}:`, error);
        }
    }

    addProgram(filename, code) {
        const program = {
            id: this.programs.length + 1,
            title: this.formatTitle(filename),
            category: this.getCategory(filename),
            description: this.generateDescription(code),
            filename: filename,
            code: code
        };
        
        this.programs.push(program);
    }

    formatTitle(filename) {
        return filename
            .replace('.java', '')
            .split('/').pop()
            .replace(/([A-Z])/g, ' $1')
            .replace(/([A-Za-z])([A-Z][a-z])/g, '$1 $2')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
    }

    getCategory(filename) {
        const path = filename.toLowerCase();
        if (path.includes('oop/')) return 'oop';
        if (path.includes('datastructures/')) return 'datastructures';
        if (path.includes('array')) return 'arrays';
        if (path.includes('loop')) return 'loops';
        if (path.includes('hello')) return 'basic';
        return 'basic';
    }

    generateDescription(code) {
        const lines = code.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('//') && line.trim().length > 5) {
                return line.replace('//', '').trim();
            }
        }
        return 'Java program demonstrating important concepts';
    }

    displayPrograms() {
        const grid = document.getElementById('programsGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.programs.forEach(program => {
            const card = this.createProgramCard(program);
            grid.appendChild(card);
        });

        this.updateFileCount();
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
        const fileName = document.getElementById('fileName');
        const code = document.getElementById('modalCode');
        
        if (!modal) return;
        
        title.textContent = program.title;
        fileName.textContent = program.filename;
        code.textContent = program.code;
        
        this.highlightSyntax(code);
        modal.style.display = 'block';
        
        // Setup modal buttons
        const copyBtn = document.getElementById('copyCode');
        const downloadBtn = document.getElementById('downloadCode');
        
        if (copyBtn) {
            copyBtn.onclick = () => this.copyToClipboard(program.code);
        }
        if (downloadBtn) {
            downloadBtn.onclick = () => this.downloadFile(program.filename, program.code);
        }
    }

    highlightSyntax(element) {
        const code = element.textContent;
        const highlighted = code
            .replace(/\b(public|class|static|void|main|String|int|boolean|char|double|float|long|short|byte)\b/g, '<span class="code-keyword">$1</span>')
            .replace(/\b(if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|throws)\b/g, '<span class="code-keyword">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="code-string">"$1"</span>')
            .replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>')
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="code-comment">$&</span>')
            .replace(/\b([0-9]+)\b/g, '<span class="code-number">$1</span>');
        
        element.innerHTML = highlighted;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification
