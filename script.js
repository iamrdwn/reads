// Main application logic
class ReadingListApp {
    constructor() {
        this.readingLists = [];
        this.init();
    }

    async init() {
        try {
            await this.loadReadingLists();
            this.renderReadingLists();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading reading lists:', error);
            this.showError();
        }
    }

    async loadReadingLists() {
        try {
            const response = await fetch('data/reading-lists.yaml');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const yamlText = await response.text();
            const data = jsyaml.load(yamlText);
            this.readingLists = data.weeks || [];
        } catch (error) {
            console.error('Failed to load YAML data:', error);
            throw error;
        }
    }

    renderReadingLists() {
        const container = document.getElementById('reading-lists');
        container.innerHTML = '';

        if (this.readingLists.length === 0) {
            container.innerHTML = '<p class="no-content">No reading lists available yet. Check back soon!</p>';
            return;
        }

        // Sort by date (newest first)
        const sortedLists = [...this.readingLists].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedLists.forEach((week, index) => {
            const weekElement = this.createWeekElement(week, index);
            container.appendChild(weekElement);
        });
    }

    createWeekElement(week, index) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week-item';
        weekDiv.setAttribute('data-week-index', index);

        const formattedDate = this.formatDate(week.date);
        
        weekDiv.innerHTML = `
            <div class="week-header">
                <h2 class="week-title">${week.title}</h2>
                <span class="week-date">${formattedDate}</span>
                <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
            </div>
            ${week.description ? `<p class="week-description">${week.description}</p>` : ''}
            <div class="articles-list">
                ${this.createArticlesList(week.articles)}
            </div>
        `;

        // Attach click event to the whole weekDiv
        weekDiv.addEventListener('click', (e) => {
            // Only toggle if click is inside .week-header and not on a link
            if (e.target.closest('.week-header') && !(e.target.tagName === 'A' || e.target.closest('a'))) {
                this.toggleWeek(weekDiv);
            }
        });

        return weekDiv;
    }

    createArticlesList(articles) {
        if (!articles || articles.length === 0) {
            return '<p class="no-articles">No articles available for this week.</p>';
        }

        return articles.map(article => {
            const domain = this.extractDomain(article.url);
            return `
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-item">
                    <div class="article-title">${article.title}</div>
                    ${article.description ? `<div class="article-description">${article.description}</div>` : ''}
                    <div class="article-url">${domain}</div>
                </a>
            `;
        }).join('');
    }

    toggleWeek(weekElement) {
        const isExpanded = weekElement.classList.contains('expanded');
        
        // Close all other weeks
        document.querySelectorAll('.week-item.expanded').forEach(item => {
            if (item !== weekElement) {
                item.classList.remove('expanded');
            }
        });

        // Toggle current week
        weekElement.classList.toggle('expanded', !isExpanded);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch (error) {
            return url;
        }
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('reading-lists').style.display = 'block';
    }

    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReadingListApp();
});

// Add some additional CSS for no-content states
const additionalStyles = `
.no-content, .no-articles {
    text-align: center;
    color: #787774;
    font-style: italic;
    padding: 40px 20px;
}

.no-articles {
    padding: 20px;
    font-size: 0.875rem;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
