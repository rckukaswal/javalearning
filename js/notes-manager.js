// Notes management functionality
class NotesManager {
    constructor() {
        this.notes = [];
        this.currentNote = null;
        this.init();
    }

    init() {
        this.loadNotes();
        this.setupEventListeners();
        this.setupSearch();
    }

    loadNotes() {
        // In a real application, this would fetch from an API
        this.notes = [
            {
                id: 1,
                title: "Java Basics",
                category: "basics",
                content: this.getBasicNotes(),
                lastUpdated: new Date('2024-01-15')
            },
            {
                id: 2,
                title: "OOP Concepts",
                category: "oop",
                content: this.getOOPNotes(),
                lastUpdated: new Date('2024-01-20')
            },
            {
                id: 3,
                title: "Collections Framework",
                category: "collections",
                content: this.getCollectionsNotes(),
                lastUpdated: new Date('2024-01-25')
            },
            {
                id: 4,
                title: "Exception Handling",
                category: "exceptions",
                content: this.getExceptionNotes(),
                lastUpdated: new Date('2024-02-01')
            },
            {
                id: 5,
                title: "Multithreading",
                category: "multithreading",
                content: this.getThreadingNotes(),
                lastUpdated: new Date('2024-02-10')
            }
        ];

        this.renderNotes();
    }

    setupEventListeners() {
        // Category filtering
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterNotesByCategory(e.target.dataset.category);
            });
        });

        // Print functionality
        document.getElementById('printNote')?.addEventListener('click', () => {
            this.printCurrentNote();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.printCurrentNote();
            }
        });
    }

    setupSearch() {
        // Search functionality can be added here
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search notes...';
        searchInput.className = 'notes-search';
        
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.appendChild(searchInput);
            
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchNotes(e.target.value);
            }, 300));
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

    renderNotes() {
        const grid = document.getElementById('notesGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.notes.forEach(note => {
            const noteElement = this.createNoteElement(note);
            grid.appendChild(noteElement);
        });
    }

    createNoteElement(note) {
        const div = document.createElement('div');
        div.className = 'note-card';
        div.setAttribute('data-category', note.category);
        
        const excerpt = this.createExcerpt(note.content);
        const date = note.lastUpdated.toLocaleDateString();
        
        div.innerHTML = `
            <div class="note-header">
                <span class="note-category">${note.category.toUpperCase()}</span>
                <span class="note-date">${date}</span>
            </div>
            <h3>${note.title}</h3>
            <div class="note-excerpt">${excerpt}</div>
            <div class="note-actions">
                <button class="btn-view-note" data-id="${note.id}">Read More</button>
                <button class="btn-bookmark" data-id="${note.id}">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        `;
        
        div.querySelector('.btn-view-note').addEventListener('click', () => {
            this.viewNote(note);
        });
        
        return div;
    }

    createExcerpt(content, length = 150) {
        // Remove HTML tags and create excerpt
        const text = content.replace(/<[^>]*>/g, '');
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    viewNote(note) {
        this.currentNote = note;
        
        const modal = document.getElementById('noteModal');
        const title = document.getElementById('noteModalTitle');
        const content = document.getElementById('noteModalContent');
        
        title.textContent = note.title;
        content.innerHTML = this.formatNoteContent(note.content);
        
        modal.style.display = 'block';
        
        // Add syntax highlighting to code blocks
        this.highlightCodeBlocks(content);
    }

    formatNoteContent(content) {
        // Enhanced content formatting
        return content
            .replace(/<h3>/g, '<h3 class="note-section-title">')
            .replace(/<h4>/g, '<h4 class="note-subtitle">')
            .replace(/<ul>/g, '<ul class="note-list">')
            .replace(/<ol>/g, '<ol class="note-list">')
            .replace(/<pre><code>/g, '<pre class="note-code"><code>');
    }

    highlightCodeBlocks(container) {
        const codeBlocks = container.querySelectorAll('code');
        codeBlocks.forEach(block => {
            this.highlightSyntax(block);
        });
    }

    highlightSyntax(element) {
        const code = element.textContent;
        
        const patterns = {
            keyword: /\b(public|private|protected|class|interface|abstract|extends|implements|static|final|void|return|new|this|super)\b/g,
            type: /\b(int|String|boolean|char|double|float|long|List|Map|Set|ArrayList|HashMap|HashSet)\b/g,
            annotation: /@\w+/g,
            string: /"([^"\\]|\\.)*"/g,
            comment: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g
        };
        
        let highlighted = code;
        
        highlighted = highlighted.replace(patterns.comment, '<span class="code-comment">$&</span>');
        highlighted = highlighted.replace(patterns.string, '<span class="code-string">$&</span>');
        highlighted = highlighted.replace(patterns.keyword, '<span class="code-keyword">$&</span>');
        highlighted = highlighted.replace(patterns.type, '<span class="code-type">$&</span>');
        highlighted = highlighted.replace(patterns.annotation, '<span class="code-annotation">$&</span>');
        
        element.innerHTML = highlighted;
    }

    filterNotesByCategory(category) {
        const notes = document.querySelectorAll('.note-card');
        
        notes.forEach(note => {
            if (category === 'all' || note.dataset.category === category) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    }

    searchNotes(query) {
        const notes = document.querySelectorAll('.note-card');
        const searchTerm = query.toLowerCase();
        
        notes.forEach(note => {
            const title = note.querySelector('h3').textContent.toLowerCase();
            const excerpt = note.querySelector('.note-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    }

    printCurrentNote() {
        if (!this.currentNote) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${this.currentNote.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                        h1 { color: #2563eb; }
                        .code-block { background: #f5f5f5; padding: 15px; border-radius: 5px; }
                        @media print { body { padding: 0; } }
                    </style>
                </head>
                <body>
                    <h1>${this.currentNote.title}</h1>
                    <div>${this.currentNote.content}</div>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    // Sample note content methods
    getBasicNotes() {
        return `
            <h3>Java Programming Basics</h3>
            <p>Java is a high-level, object-oriented programming language known for its portability and robustness.</p>
            
            <h4>Key Features:</h4>
            <ul>
                <li><strong>Platform Independent:</strong> Write once, run anywhere</li>
                <li><strong>Object-Oriented:</strong> Based on objects and classes</li>
                <li><strong>Simple:</strong> Easy to learn and use</li>
                <li><strong>Secure:</strong> Built-in security features</li>
            </ul>
            
            <h4>Basic Syntax Example:</h4>
            <pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>
        `;
    }

    getOOPNotes() {
        return `
            <h3>Object-Oriented Programming Concepts</h3>
            
            <h4>1. Encapsulation</h4>
            <p>Binding data and methods together in a single unit (class).</p>
            <pre><code>public class Student {
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}</code></pre>
            
            <h4>2. Inheritance</h4>
            <p>Creating new classes from existing ones.</p>
            
            <h4>3. Polymorphism</h4>
            <p>One interface, multiple implementations.</p>
            
            <h4>4. Abstraction</h4>
            <p>Hiding implementation details.</p>
        `;
    }

    getCollectionsNotes() {
        return `
            <h3>Java Collections Framework</h3>
            <p>A unified architecture for storing and manipulating groups of objects.</p>
            
            <h4>Main Interfaces:</h4>
            <ul>
                <li><strong>List:</strong> Ordered collection (ArrayList, LinkedList)</li>
                <li><strong>Set:</strong> Unique elements (HashSet, TreeSet)</li>
                <li><strong>Map:</strong> Key-value pairs (HashMap, TreeMap)</li>
                <li><strong>Queue:</strong> FIFO processing (LinkedList, PriorityQueue)</li>
            </ul>
            
            <h4>Example Usage:</h4>
            <pre><code>List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");

Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);</code></pre>
        `;
    }

    getExceptionNotes() {
        return `
            <h3>Exception Handling in Java</h3>
            <p>Exceptions are events that disrupt the normal flow of program execution.</p>
            
            <h4>Try-Catch Block:</h4>
            <pre><code>try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
} finally {
    System.out.println("This always executes");
}</code></pre>
            
            <h4>Common Exception Types:</h4>
            <ul>
                <li>NullPointerException</li>
                <li>ArrayIndexOutOfBoundsException</li>
                <li>IOException</li>
                <li>ClassNotFoundException</li>
            </ul>
        `;
    }

    getThreadingNotes() {
        return `
            <h3>Multithreading in Java</h3>
            <p>Java supports multithreading to perform multiple tasks simultaneously.</p>
            
            <h4>Creating Threads:</h4>
            <pre><code>// Extending Thread class
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread is running");
    }
}

// Implementing Runnable interface
class MyRunnable implements Runnable {
    public void run() {
        System.out.println("Runnable is running");
    }
}</code></pre>
            
            <h4>Synchronization:</h4>
            <p>Used to prevent thread interference and consistency problems.</p>
        `;
    }
}

// Initialize notes manager
document.addEventListener('DOMContentLoaded', () => {
    window.notesManager = new NotesManager();
});
