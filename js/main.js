// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Animate stats counting
    const animateStats = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    };

    // Sample programs data
    const programsData = [
        {
            id: 1,
            title: "Hello World Program",
            category: "basic",
            description: "Basic Java program to print Hello World",
            filename: "HelloWorld.java",
            code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
        },
        {
            id: 2,
            title: "Array Operations",
            category: "basic",
            description: "Various operations on arrays in Java",
            filename: "ArrayPrograms.java",
            code: `import java.util.Arrays;

public class ArrayPrograms {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        
        // Print array
        System.out.println("Array: " + Arrays.toString(numbers));
        
        // Sum of array elements
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
}`
        },
        {
            id: 3,
            title: "Inheritance Example",
            category: "oop",
            description: "Demonstrating inheritance in Java",
            filename: "Inheritance.java",
            code: `class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks.");
    }
}

public class Inheritance {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.eat();
        myDog.bark();
    }
}`
        },
        {
            id: 4,
            title: "LinkedList Implementation",
            category: "datastructures",
            description: "Basic LinkedList implementation in Java",
            filename: "LinkedList.java",
            code: `public class LinkedList {
    Node head;
    
    class Node {
        int data;
        Node next;
        
        Node(int d) {
            data = d;
            next = null;
        }
    }
    
    public void insert(int data) {
        Node newNode = new Node(data);
        
        if (head == null) {
            head = newNode;
        } else {
            Node last = head;
            while (last.next != null) {
                last = last.next;
            }
            last.next = newNode;
        }
    }
    
    public void display() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " ");
            current = current.next;
        }
    }
}`
        }
    ];

    // Sample notes data
    const notesData = [
        {
            id: 1,
            title: "Java Basics",
            category: "basics",
            content: `
                <h3>What is Java?</h3>
                <p>Java is a high-level, object-oriented programming language developed by Sun Microsystems.</p>
                
                <h3>Features of Java:</h3>
                <ul>
                    <li>Platform Independent</li>
                    <li>Object-Oriented</li>
                    <li>Simple</li>
                    <li>Secure</li>
                    <li>Multithreaded</li>
                </ul>
                
                <h3>Basic Syntax:</h3>
                <pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>
            `
        },
        {
            id: 2,
            title: "OOP Concepts",
            category: "oop",
            content: `
                <h3>Four Pillars of OOP:</h3>
                
                <h4>1. Encapsulation</h4>
                <p>Binding data and methods together in a single unit.</p>
                
                <h4>2. Inheritance</h4>
                <p>Creating new classes from existing ones.</p>
                
                <h4>3. Polymorphism</h4>
                <p>One interface, multiple implementations.</p>
                
                <h4>4. Abstraction</h4>
                <p>Hiding implementation details.</p>
            `
        },
        {
            id: 3,
            title: "Collections Framework",
            category: "collections",
            content: `
                <h3>Java Collections Framework</h3>
                <p>The Java Collections Framework provides architecture to store and manipulate groups of objects.</p>
                
                <h3>Main Interfaces:</h3>
                <ul>
                    <li>List - Ordered collection</li>
                    <li>Set - Unique elements</li>
                    <li>Map - Key-value pairs</li>
                    <li>Queue - FIFO principle</li>
                </ul>
            `
        }
    ];

    // Load programs on programs.html
    if (document.getElementById('programsGrid')) {
        loadPrograms();
    }

    // Load recent programs on index.html
    if (document.getElementById('recentPrograms')) {
        loadRecentPrograms();
    }

    // Load notes on notes.html
    if (document.getElementById('notesGrid')) {
        loadNotes();
    }

    function loadPrograms() {
        const grid = document.getElementById('programsGrid');
        grid.innerHTML = '';
        
        programsData.forEach(program => {
            const programCard = createProgramCard(program);
            grid.appendChild(programCard);
        });
        
        // Add search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', filterPrograms);
        }
        
        // Add filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterPrograms();
            });
        });
    }

    function loadRecentPrograms() {
        const grid = document.getElementById('recentPrograms');
        if (!grid) return;
        
        // Show only first 3 programs
        const recentPrograms = programsData.slice(0, 3);
        
        recentPrograms.forEach(program => {
            const programCard = createProgramCard(program);
            grid.appendChild(programCard);
        });
    }

    function createProgramCard(program) {
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
        `;
        
        // Add event listener for view button
        card.querySelector('.btn-view').addEventListener('click', () => {
            viewProgramCode(program);
        });
        
        return card;
    }

    function filterPrograms() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const programs = document.querySelectorAll('.program-card');
        
        programs.forEach(program => {
            const title = program.querySelector('h3').textContent.toLowerCase();
            const category = program.dataset.category;
            const matchesSearch = title.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            
            if (matchesSearch && matchesFilter) {
                program.style.display = 'block';
            } else {
                program.style.display = 'none';
            }
        });
    }

    function loadNotes() {
        const grid = document.getElementById('notesGrid');
        grid.innerHTML = '';
        
        notesData.forEach(note => {
            const noteCard = createNoteCard(note);
            grid.appendChild(noteCard);
        });
        
        // Add category filter functionality
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterNotes();
            });
        });
    }

    function createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.setAttribute('data-category', note.category);
        
        // Create excerpt from content (first 100 characters)
        const excerpt = note.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
        
        card.innerHTML = `
            <span class="note-category">${note.category.toUpperCase()}</span>
            <h3>${note.title}</h3>
            <p>${excerpt}</p>
            <button class="btn-view-note" data-id="${note.id}">Read More</button>
        `;
        
        card.querySelector('.btn-view-note').addEventListener('click', () => {
            viewNote(note);
        });
        
        return card;
    }

    function filterNotes() {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        const notes = document.querySelectorAll('.note-card');
        
        notes.forEach(note => {
            const category = note.dataset.category;
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            
            if (matchesCategory) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats')) {
                    animateStats();
                }
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.feature-card, .stat-item, .program-card, .note-card').forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to current page in navigation
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Global functions for modals
function viewProgramCode(program) {
    const modal = document.getElementById('fileModal');
    const title = document.getElementById('modalTitle');
    const code = document.getElementById('modalCode');
    
    title.textContent = program.title;
    code.textContent = program.code;
    
    // Syntax highlighting (basic)
    highlightSyntax(code);
    
    modal.style.display = 'block';
    
    // Add event listeners for modal buttons
    document.getElementById('copyCode').onclick = () => copyToClipboard(program.code);
    document.getElementById('downloadCode').onclick = () => downloadFile(program.filename, program.code);
}

function viewNote(note) {
    const modal = document.getElementById('noteModal');
    const title = document.getElementById('noteModalTitle');
    const content = document.getElementById('noteModalContent');
    
    title.textContent = note.title;
    content.innerHTML = note.content;
    
    modal.style.display = 'block';
}

function highlightSyntax(element) {
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

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Close modals when clicking outside or on close button
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});
