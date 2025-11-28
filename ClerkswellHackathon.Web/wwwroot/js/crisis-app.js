// Crisis Assessment Engine
class CrisisEngine {
    constructor() {
        this.state = {
            isLoading: false,
            assessment: null
        };
    }

    async analyzeCrisis(text) {
        // Simulate API call - replace with actual API endpoint
        await this.delay(1500);

        // Mock crisis analysis logic
        const severity = this.assessSeverity(text);
        const actions = this.generateActions(text, severity);

        return {
            severity: severity,
            summary: this.generateSummary(text, severity),
            actions: actions,
            resources: this.getResources(severity)
        };
    }

    assessSeverity(text) {
        const lowerText = text.toLowerCase();
        
        // High severity keywords
        if (lowerText.includes('suicide') || lowerText.includes('harm') || 
            lowerText.includes('emergency') || lowerText.includes('urgent')) {
            return 'high';
        }
        
        // Medium severity keywords
        if (lowerText.includes('homeless') || lowerText.includes('evict') || 
            lowerText.includes('food') || lowerText.includes('hungry')) {
            return 'medium';
        }
        
        return 'low';
    }

    generateSummary(text, severity) {
        if (severity === 'high') {
            return 'We recognize this is an urgent situation. Immediate support is available.';
        } else if (severity === 'medium') {
            return 'We understand your situation is difficult. Help is available.';
        }
        return 'We are here to support you. Let us connect you with the right resources.';
    }

    generateActions(text, severity) {
        const actions = [];
        
        if (severity === 'high') {
            actions.push({
                title: 'Immediate Crisis Support',
                description: 'Contact emergency services or a crisis hotline immediately. Call 988 (Suicide & Crisis Lifeline) or 911 for emergencies.',
                priority: 1
            });
        }
        
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('homeless') || lowerText.includes('housing')) {
            actions.push({
                title: 'Emergency Housing Assistance',
                description: 'Connect with local shelters and housing assistance programs. We can help you find temporary accommodation tonight.',
                priority: severity === 'high' ? 2 : 1
            });
        }
        
        if (lowerText.includes('food') || lowerText.includes('hungry')) {
            actions.push({
                title: 'Food Resources',
                description: 'Access local food banks, meal programs, and SNAP benefits. Immediate food assistance is available.',
                priority: severity === 'high' ? 3 : 1
            });
        }
        
        if (lowerText.includes('job') || lowerText.includes('income') || lowerText.includes('money')) {
            actions.push({
                title: 'Income Support',
                description: 'Explore emergency financial assistance, job placement services, and government benefit programs.',
                priority: 2
            });
        }
        
        // Default action if no specific matches
        if (actions.length === 0) {
            actions.push({
                title: 'General Support Services',
                description: 'Connect with a support coordinator who can assess your needs and guide you to appropriate resources.',
                priority: 1
            });
        }
        
        return actions.sort((a, b) => a.priority - b.priority);
    }

    getResources(severity) {
        return [
            {
                name: '988 Suicide & Crisis Lifeline',
                phone: '988',
                available: '24/7'
            },
            {
                name: 'Local Support Services',
                phone: '211',
                available: '24/7'
            }
        ];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Main Application
class CrisisApp {
    constructor() {
        this.engine = new CrisisEngine();
        this.elements = {
            inputView: document.getElementById('inputView'),
            planView: document.getElementById('planView'),
            textarea: document.getElementById('crisisInput'),
            submitButton: document.getElementById('submitButton'),
            resetButton: document.getElementById('resetButton'),
            planContent: document.getElementById('planContent')
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.elements.submitButton.addEventListener('click', () => this.handleSubmit());
        this.elements.resetButton.addEventListener('click', () => this.handleReset());
        
        // Allow Enter + Ctrl/Cmd to submit
        this.elements.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.handleSubmit();
            }
        });
    }

    async handleSubmit() {
        const text = this.elements.textarea.value.trim();
        
        if (!text) {
            alert('Please describe your situation');
            return;
        }

        this.setLoading(true);
        
        try {
            const assessment = await this.engine.analyzeCrisis(text);
            this.showActionPlan(assessment);
        } catch (error) {
            console.error('Error analyzing crisis:', error);
            alert('An error occurred. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    handleReset() {
        this.elements.textarea.value = '';
        this.elements.inputView.classList.remove('hidden');
        this.elements.planView.classList.add('hidden');
    }

    setLoading(isLoading) {
        this.elements.submitButton.disabled = isLoading;
        this.elements.submitButton.textContent = isLoading ? 'Analyzing...' : 'Get Help';
        
        if (isLoading) {
            this.elements.submitButton.classList.add('loading');
        } else {
            this.elements.submitButton.classList.remove('loading');
        }
    }

    showActionPlan(assessment) {
        // Hide input view
        this.elements.inputView.classList.add('hidden');
        
        // Build action plan HTML
        const html = this.buildActionPlanHTML(assessment);
        this.elements.planContent.innerHTML = html;
        
        // Show plan view
        this.elements.planView.classList.remove('hidden');
        this.elements.planView.classList.add('fade-in');
    }

    buildActionPlanHTML(assessment) {
        const severityClass = `severity-${assessment.severity}`;
        const severityText = assessment.severity.charAt(0).toUpperCase() + assessment.severity.slice(1);
        
        let html = `
            <div class="assessment-header">
                <div class="severity-badge ${severityClass}">
                    ${severityText} Priority
                </div>
                <h2 class="main-heading" style="font-size: 2.5rem; margin-bottom: 1rem;">
                    Your Action Plan
                </h2>
                <p class="subtitle" style="margin-bottom: 0;">
                    ${assessment.summary}
                </p>
            </div>
            
            <div class="actions-section">
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: var(--color-primary);">
                    Recommended Steps:
                </h3>
                <ul class="action-list">
        `;
        
        assessment.actions.forEach((action, index) => {
            html += `
                <li class="action-item">
                    <div class="action-title">${index + 1}. ${action.title}</div>
                    <div class="action-description">${action.description}</div>
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
            
            <div class="resources-section" style="margin-top: 2rem; padding: 1.5rem; background: #eff6ff; border-radius: 0.5rem;">
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--color-primary);">
                    Emergency Resources:
                </h3>
        `;
        
        assessment.resources.forEach(resource => {
            html += `
                <div style="margin-bottom: 0.75rem;">
                    <strong>${resource.name}:</strong> ${resource.phone} (${resource.available})
                </div>
            `;
        });
        
        html += `
            </div>
        `;
        
        return html;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CrisisApp();
});
