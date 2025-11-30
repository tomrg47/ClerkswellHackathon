import { LitElement, css, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class FamiliesManagementDashboard extends UmbElementMixin(LitElement) {
    static properties = {
        families: { type: Array },
        events: { type: Array },
        loading: { type: Boolean },
        searchText: { type: String },
        filter: { type: String },
        activeTab: { type: String },
        sortField: { type: String },
        sortReverse: { type: Boolean },
        showEventModal: { type: Boolean },
        editingEvent: { type: Object },
        eventFilter: { type: String },
        selectedFamily: { type: Object }
    };

    constructor() {
        super();
        this.families = [];
        this.events = [];
        this.loading = true;
        this.searchText = '';
        this.filter = 'all';
        this.activeTab = 'families';
        this.sortField = 'registeredDate';
        this.sortReverse = true;
        this.showEventModal = false;
        this.editingEvent = null;
        this.eventFilter = 'all';
        this.selectedFamily = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadFamilies();
        this.loadEvents();
    }

    async loadFamilies() {
        try {
            this.loading = true;
            const response = await fetch('/umbraco/backoffice/api/families/getall');
            this.families = await response.json();
        } catch (error) {
            console.error('Error loading families:', error);
        } finally {
            this.loading = false;
        }
    }

    async loadEvents() {
        try {
            const response = await fetch('/umbraco/backoffice/api/events/getall');
            this.events = await response.json();
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    async saveEvent(eventData) {
        try {
            const url = eventData.id 
                ? `/umbraco/backoffice/api/events/update/${eventData.id}`
                : '/umbraco/backoffice/api/events/create';
            
            const method = eventData.id ? 'PUT' : 'POST';
            
            console.log('Saving event:', eventData);
            console.log('URL:', url);
            console.log('Method:', method);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            console.log('Response status:', response.status);
            
            if (response.ok) {
                await this.loadEvents();
                this.closeEventModal();
                alert(eventData.id ? 'Event updated successfully!' : 'Event created successfully!');
            } else {
                // Try to parse error message from response
                let errorMessage = 'Error saving event';
                try {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    const errorText = await response.text();
                    console.error('Error text:', errorText);
                    errorMessage = errorText || errorMessage;
                }
                alert(`${errorMessage}\n\nPlease check:\n1. Events Listing page exists in Content section\n2. Event document type is created with alias 'event'\n3. All required properties exist`);
            }
        } catch (error) {
            console.error('Error saving event:', error);
            alert(`Error saving event: ${error.message}\n\nPlease check the browser console for details.`);
        }
    }

    async deleteEvent(eventId) {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const response = await fetch(`/umbraco/backoffice/api/events/delete/${eventId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await this.loadEvents();
                alert('Event deleted successfully!');
            } else {
                alert('Error deleting event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        }
    }

    openEventModal(event = null) {
        this.editingEvent = event ? { ...event } : {
            title: '',
            description: '',
            startDate: new Date().toISOString().slice(0, 16),
            endDate: new Date().toISOString().slice(0, 16),
            location: '',
            eventType: 'Community Event',
            status: 'Draft',
            maxAttendees: 50,
            currentAttendees: 0,
            requiresRegistration: true,
            contactEmail: '',
            contactPhone: '',
            tags: [],
            imageUrl: '',
            isFeatured: false
        };
        this.showEventModal = true;
    }

    closeEventModal() {
        this.showEventModal = false;
        this.editingEvent = null;
    }

    handleEventFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const eventData = {
            id: this.editingEvent.id || 0,
            title: formData.get('title'),
            description: formData.get('description'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            location: formData.get('location'),
            eventType: formData.get('eventType'),
            status: formData.get('status'),
            maxAttendees: parseInt(formData.get('maxAttendees')) || 0,
            currentAttendees: parseInt(formData.get('currentAttendees') || '0') || 0,
            requiresRegistration: formData.get('requiresRegistration') === 'on',
            contactEmail: formData.get('contactEmail'),
            contactPhone: formData.get('contactPhone'),
            tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t),
            imageUrl: formData.get('imageUrl'),
            isFeatured: formData.get('isFeatured') === 'on'
        };

        this.saveEvent(eventData);
    }

    viewFamily(family) {
        this.selectedFamily = family;
    }

    closeFamily() {
        this.selectedFamily = null;
    }

    get filteredFamilies() {
        let filtered = [...this.families];

        if (this.searchText) {
            const searchLower = this.searchText.toLowerCase();
            filtered = filtered.filter(family =>
                family.name.toLowerCase().includes(searchLower) ||
                family.referenceCode.toLowerCase().includes(searchLower) ||
                family.category.toLowerCase().includes(searchLower)
            );
        }

        if (this.filter === 'highPriority') {
            filtered = filtered.filter(family =>
                family.priority === 'Critical' || family.priority === 'High'
            );
        } else if (this.filter === 'medium') {
            filtered = filtered.filter(family =>
                family.priority === 'Medium'
            );
        }

        filtered.sort((a, b) => {
            const aVal = a[this.sortField];
            const bVal = b[this.sortField];
            
            if (this.sortField === 'registeredDate') {
                const aDate = new Date(aVal);
                const bDate = new Date(bVal);
                return this.sortReverse ? bDate - aDate : aDate - bDate;
            }
            
            const result = String(aVal).localeCompare(String(bVal));
            return this.sortReverse ? -result : result;
        });

        return filtered;
    }

    get filteredEvents() {
        let filtered = [...this.events];

        if (this.searchText) {
            const searchLower = this.searchText.toLowerCase();
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower) ||
                event.eventType.toLowerCase().includes(searchLower)
            );
        }

        if (this.eventFilter === 'published') {
            filtered = filtered.filter(event => event.status === 'Published');
        } else if (this.eventFilter === 'draft') {
            filtered = filtered.filter(event => event.status === 'Draft');
        } else if (this.eventFilter === 'upcoming') {
            const now = new Date();
            filtered = filtered.filter(event => new Date(event.startDate) >= now);
        } else if (this.eventFilter === 'featured') {
            filtered = filtered.filter(event => event.isFeatured);
        }

        return filtered;
    }

    sortBy(field) {
        if (this.sortField === field) {
            this.sortReverse = !this.sortReverse;
        } else {
            this.sortField = field;
            this.sortReverse = false;
        }
    }

    setFilter(filter) {
        this.filter = filter;
    }

    setEventFilter(filter) {
        this.eventFilter = filter;
    }

    lookupFamily() {
        const code = prompt('Enter family reference code:');
        if (code) {
            const family = this.families.find(f => 
                f.referenceCode.toLowerCase() === code.toLowerCase()
            );
            if (family) {
                this.viewFamily(family);
            } else {
                alert('Family not found');
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    }

    render() {
        return html`
            <div class="dashboard">
                <div class="header">
                    <div>
                        <h1>Staff Portal</h1>
                        <p>Manage active cases and events.</p>
                    </div>
                    <button @click=${this.lookupFamily}>Lookup Family</button>
                </div>

                <div class="tabs">
                    <button 
                        class=${this.activeTab === 'families' ? 'active' : ''}
                        @click=${() => this.activeTab = 'families'}>
                        Families
                    </button>
                    <button 
                        class=${this.activeTab === 'events' ? 'active' : ''}
                        @click=${() => this.activeTab = 'events'}>
                        Events
                    </button>
                </div>

                ${this.activeTab === 'families' ? this.renderFamilies() : this.renderEvents()}
                ${this.showEventModal ? this.renderEventModal() : ''}
                ${this.selectedFamily ? this.renderFamilyDetail() : ''}
            </div>
        `;
    }

    renderFamilies() {
        return html`
            <div class="toolbar">
                <input 
                    type="search"
                    placeholder="Search families..."
                    .value=${this.searchText}
                    @input=${(e) => this.searchText = e.target.value}>
                
                <div class="filters">
                    <button 
                        class=${this.filter === 'all' ? 'active' : ''}
                        @click=${() => this.setFilter('all')}>
                        All
                    </button>
                    <button 
                        class=${this.filter === 'highPriority' ? 'active' : ''}
                        @click=${() => this.setFilter('highPriority')}>
                        High Priority
                    </button>
                    <button 
                        class=${this.filter === 'medium' ? 'active' : ''}
                        @click=${() => this.setFilter('medium')}>
                        Medium
                    </button>
                </div>
            </div>

            ${this.loading ? html`<div class="loading">Loading...</div>` : this.renderFamiliesTable()}
        `;
    }

    renderFamiliesTable() {
        const families = this.filteredFamilies;

        if (families.length === 0) {
            return html`<div class="no-results">No families found</div>`;
        }

        return html`
            <table>
                <thead>
                    <tr>
                        <th @click=${() => this.sortBy('name')}>FAMILY ${this.sortField === 'name' ? (this.sortReverse ? '?' : '?') : ''}</th>
                        <th @click=${() => this.sortBy('category')}>CATEGORY ${this.sortField === 'category' ? (this.sortReverse ? '?' : '?') : ''}</th>
                        <th @click=${() => this.sortBy('priority')}>PRIORITY ${this.sortField === 'priority' ? (this.sortReverse ? '?' : '?') : ''}</th>
                        <th @click=${() => this.sortBy('status')}>STATUS ${this.sortField === 'status' ? (this.sortReverse ? '?' : '?') : ''}</th>
                        <th @click=${() => this.sortBy('household')}>HOUSEHOLD ${this.sortField === 'household' ? (this.sortReverse ? '?' : '?') : ''}</th>
                        <th @click=${() => this.sortBy('registeredDate')}>REGISTERED ${this.sortField === 'registeredDate' ? (this.sortReverse ? '?' : '?') : ''}</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    ${families.map(family => html`
                        <tr @click=${() => this.viewFamily(family)}>
                            <td>
                                <div class="family-info">
                                    <div class="avatar">${family.name.charAt(0)}</div>
                                    <div>
                                        <div class="name">${family.name}</div>
                                        <div class="code">${family.referenceCode}</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="badge category">${family.category}</span></td>
                            <td><span class="badge priority-${family.priority.toLowerCase()}">${family.priority}</span></td>
                            <td><span class="badge status-${family.status.toLowerCase()}">${family.status}</span></td>
                            <td>${family.household}</td>
                            <td>${this.formatDate(family.registeredDate)}</td>
                            <td><button class="view-btn">View ?</button></td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }

    renderEvents() {
        return html`
            <div class="toolbar">
                <input 
                    type="search"
                    placeholder="Search events..."
                    .value=${this.searchText}
                    @input=${(e) => this.searchText = e.target.value}>
                
                <div class="filters">
                    <button 
                        class=${this.eventFilter === 'all' ? 'active' : ''}
                        @click=${() => this.setEventFilter('all')}>
                        All
                    </button>
                    <button 
                        class=${this.eventFilter === 'upcoming' ? 'active' : ''}
                        @click=${() => this.setEventFilter('upcoming')}>
                        Upcoming
                    </button>
                    <button 
                        class=${this.eventFilter === 'published' ? 'active' : ''}
                        @click=${() => this.setEventFilter('published')}>
                        Published
                    </button>
                    <button 
                        class=${this.eventFilter === 'draft' ? 'active' : ''}
                        @click=${() => this.setEventFilter('draft')}>
                        Draft
                    </button>
                    <button 
                        class=${this.eventFilter === 'featured' ? 'active' : ''}
                        @click=${() => this.setEventFilter('featured')}>
                        Featured
                    </button>
                </div>

                <button class="create-btn" @click=${() => this.openEventModal()}>
                    + Create Event
                </button>
            </div>

            ${this.renderEventsGrid()}
        `;
    }

    renderEventsGrid() {
        const events = this.filteredEvents;

        if (events.length === 0) {
            return html`
                <div class="no-results">
                    <p>No events found</p>
                    <button @click=${() => this.openEventModal()}>Create your first event</button>
                </div>
            `;
        }

        return html`
            <div class="events-grid">
                ${events.map(event => html`
                    <div class="event-card">
                        ${event.imageUrl ? html`
                            <div class="event-image" style="background-image: url(${event.imageUrl})"></div>
                        ` : html`
                            <div class="event-image-placeholder">
                                <span>??</span>
                            </div>
                        `}
                        
                        <div class="event-content">
                            <div class="event-header">
                                <h3>${event.title}</h3>
                                <div class="event-badges">
                                    ${event.isFeatured ? html`<span class="badge featured">? Featured</span>` : ''}

                                    <span class="badge status-${event.status.toLowerCase()}">${event.status}</span>
                                </div>
                            </div>

                            <p class="event-description">${event.description}</p>

                            <div class="event-meta">
                                <div class="meta-item">
                                    <strong>??</strong> ${this.formatDateTime(event.startDate)}
                                </div>
                                <div class="meta-item">
                                    <strong>??</strong> ${event.location}
                                </div>
                                <div class="meta-item">
                                    <strong>??</strong> ${event.eventType}
                                </div>
                                <div class="meta-item">
                                    <strong>??</strong> ${event.currentAttendees} / ${event.maxAttendees} attendees
                                </div>
                            </div>

                            ${event.tags.length > 0 ? html`
                                <div class="event-tags">
                                    ${event.tags.map(tag => html`<span class="tag">${tag}</span>`)}

                                </div>
                            ` : ''}

                            <div class="event-actions">
                                <button class="edit-btn" @click=${() => this.openEventModal(event)}>
                                    ?? Edit
                                </button>
                                <button class="delete-btn" @click=${() => this.deleteEvent(event.id)}>
                                    ??? Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    renderEventModal() {
        return html`
            <div class="modal-overlay" @click=${this.closeEventModal}>
                <div class="modal" @click=${(e) => e.stopPropagation()}>
                    <div class="modal-header">
                        <h2>${this.editingEvent?.id ? 'Edit Event' : 'Create New Event'}</h2>
                        <button class="close-btn" @click=${this.closeEventModal}>?</button>
                    </div>

                    <form @submit=${this.handleEventFormSubmit}>
                        <div class="form-grid">
                            <div class="form-group full-width">
                                <label>Event Title *</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    .value=${this.editingEvent?.title || ''}
                                    required>
                            </div>

                            <div class="form-group full-width">
                                <label>Description *</label>
                                <textarea 
                                    name="description" 
                                    rows="4"
                                    .value=${this.editingEvent?.description || ''}
                                    required></textarea>
                            </div>

                            <div class="form-group">
                                <label>Start Date & Time *</label>
                                <input 
                                    type="datetime-local" 
                                    name="startDate"
                                    .value=${this.formatDateForInput(this.editingEvent?.startDate)}
                                    required>
                            </div>

                            <div class="form-group">
                                <label>End Date & Time *</label>
                                <input 
                                    type="datetime-local" 
                                    name="endDate"
                                    .value=${this.formatDateForInput(this.editingEvent?.endDate)}
                                    required>
                            </div>

                            <div class="form-group full-width">
                                <label>Location *</label>
                                <input 
                                    type="text" 
                                    name="location"
                                    .value=${this.editingEvent?.location || ''}
                                    required>
                            </div>

                            <div class="form-group">
                                <label>Event Type *</label>
                                <select name="eventType" .value=${this.editingEvent?.eventType || 'Community Event'}>
                                    <option>Community Event</option>
                                    <option>Workshop</option>
                                    <option>Advice Session</option>
                                    <option>Social</option>
                                    <option>Job Fair</option>
                                    <option>Food Service</option>
                                    <option>Training</option>
                                    <option>Support Group</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Status *</label>
                                <select name="status" .value=${this.editingEvent?.status || 'Draft'}>
                                    <option>Draft</option>
                                    <option>Published</option>
                                    <option>Cancelled</option>
                                    <option>Completed</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Max Attendees</label>
                                <input 
                                    type="number" 
                                    name="maxAttendees"
                                    .value=${this.editingEvent?.maxAttendees || 50}
                                    min="1">
                            </div>

                            <div class="form-group">
                                <label>Current Attendees</label>
                                <input 
                                    type="number" 
                                    name="currentAttendees"
                                    .value=${this.editingEvent?.currentAttendees || 0}
                                    min="0">
                            </div>

                            <div class="form-group">
                                <label>Contact Email</label>
                                <input 
                                    type="email" 
                                    name="contactEmail"
                                    .value=${this.editingEvent?.contactEmail || ''}>
                            </div>

                            <div class="form-group">
                                <label>Contact Phone</label>
                                <input 
                                    type="tel" 
                                    name="contactPhone"
                                    .value=${this.editingEvent?.contactPhone || ''}>
                            </div>

                            <div class="form-group full-width">
                                <label>Image URL</label>
                                <input 
                                    type="text" 
                                    name="imageUrl"
                                    .value=${this.editingEvent?.imageUrl || ''}
                                    placeholder="/media/event-image.jpg">
                            </div>

                            <div class="form-group full-width">
                                <label>Tags (comma separated)</label>
                                <input 
                                    type="text" 
                                    name="tags"
                                    .value=${this.editingEvent?.tags?.join(', ') || ''}
                                    placeholder="Family, Food, Support">
                            </div>

                            <div class="form-group checkbox-group">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        name="requiresRegistration"
                                        .checked=${this.editingEvent?.requiresRegistration || false}>
                                    Requires Registration
                                </label>
                            </div>

                            <div class="form-group checkbox-group">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        name="isFeatured"
                                        .checked=${this.editingEvent?.isFeatured || false}>
                                    Featured Event
                                </label>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="cancel-btn" @click=${this.closeEventModal}>
                                Cancel
                            </button>
                            <button type="submit" class="save-btn">
                                ${this.editingEvent?.id ? 'Update Event' : 'Create Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderFamilyDetail() {
        const family = this.selectedFamily;
        
        return html`
            <div class="blade-overlay" @click=${this.closeFamily}>
                <div class="blade" @click=${(e) => e.stopPropagation()}>
                    <div class="blade-header">
                        <button class="back-btn" @click=${this.closeFamily}>
                            ? Back to Families
                        </button>
                        <h2>Family Details</h2>
                    </div>

                    <div class="blade-content">
                        <div class="detail-section">
                            <div class="family-avatar-large">
                                ${family.name.charAt(0)}
                            </div>
                            <h2 class="family-name">${family.name}</h2>
                            <p class="family-reference">Family ID: ${family.referenceCode}</p>
                        </div>

                        <div class="detail-section">
                            <h3>Status Information</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Status</span>
                                    <span class="badge status-${family.status.toLowerCase()}">${family.status}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Priority Level</span>
                                    <span class="badge priority-${family.priority.toLowerCase()}">${family.priority}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Category</span>
                                    <span class="badge category">${family.category}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Household</span>
                                    <span class="info-value">${family.household}</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3>Timeline</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Registered Date</span>
                                    <span class="info-value">${this.formatDate(family.registeredDate)}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Last Contact</span>
                                    <span class="info-value">${this.formatRelativeTime(family.lastContact)}</span>
                                </div>
                            </div>
                        </div>

                        ${family.flags && family.flags.length > 0 ? html`
                            <div class="detail-section">
                                <h3>Risk Flags</h3>
                                <div class="flags-list">
                                    ${family.flags.map(flag => html`
                                        <div class="flag-item">
                                            <span class="flag-icon">??</span>
                                            <span class="flag-text">${this.formatFlag(flag)}</span>
                                        </div>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        ${family.engagement && family.engagement.length > 0 ? html`
                            <div class="detail-section">
                                <h3>Active Engagement</h3>
                                <div class="engagement-list">
                                    ${family.engagement.map(engagement => html`
                                        <div class="engagement-item">
                                            <span class="engagement-icon">?</span>
                                            <span class="engagement-text">${engagement}</span>
                                        </div>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <div class="detail-section">
                            <h3>Activity Timeline</h3>
                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="timeline-icon check-in">??</div>
                                    <div class="timeline-content">
                                        <div class="timeline-title">CHECK-IN</div>
                                        <div class="timeline-description">
                                            Last contacted ${this.formatRelativeTime(family.lastContact)}
                                        </div>
                                        <div class="timeline-time">${this.formatDateTime(family.lastContact)}</div>
                                    </div>
                                </div>
                                
                                <div class="timeline-item">
                                    <div class="timeline-icon system">??</div>
                                    <div class="timeline-content">
                                        <div class="timeline-title">SYSTEM</div>
                                        <div class="timeline-description">
                                            ${family.priority === 'Critical' || family.priority === 'High' 
                                                ? `Flagged as ${family.priority} Priority` 
                                                : `Status updated to ${family.status}`}
                                        </div>
                                        <div class="timeline-time">${this.formatDate(family.registeredDate)}</div>
                                    </div>
                                </div>

                                ${family.engagement && family.engagement.length > 0 ? html`
                                    <div class="timeline-item">
                                        <div class="timeline-icon service">??</div>
                                        <div class="timeline-content">
                                            <div class="timeline-title">SERVICE</div>
                                            <div class="timeline-description">
                                                Engaged with ${family.engagement.join(', ')}
                                            </div>
                                            <div class="timeline-time">${this.formatDate(family.registeredDate)}</div>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <div class="detail-actions">
                            <button class="action-btn primary">
                                ?? Add Note
                            </button>
                            <button class="action-btn">
                                ?? Record Contact
                            </button>
                            <button class="action-btn">
                                ? Update Status
                            </button>
                            <button class="action-btn">
                                ?? Attach Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatFlag(flag) {
        return flag
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
        return this.formatDate(dateString);
    }

    static styles = css`
        :host {
            display: block;
            padding: 20px;
        }

        .dashboard {
            background: #f7f7f7;
            min-height: 100vh;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 20px;
            background: white;
            border-radius: 6px;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0 0 5px 0;
            color: #1b264f;
            font-size: 32px;
        }

        .header p {
            margin: 0;
            color: #666;
        }

        .header button {
            padding: 10px 20px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            background: white;
            padding: 10px;
            border-radius: 6px;
        }

        .tabs button {
            padding: 12px 20px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-weight: 600;
            border-radius: 4px;
        }

        .tabs button.active {
            background: #1b264f;
            color: white;
        }

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: white;
            border-radius: 6px;
            margin-bottom: 20px;
            gap: 15px;
        }

        .toolbar input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 300px;
        }

        .filters {
            display: flex;
            gap: 8px;
        }

        .filters button {
            padding: 8px 16px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
        }

        .filters button.active {
            background: #1b264f;
            color: white;
        }

        .create-btn {
            padding: 10px 20px;
            border: none;
            background: #1b264f;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            white-space: nowrap;
        }

        .create-btn:hover {
            background: #ffd100;
            color: #1b264f;
        }

        /* Events Grid */
        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }

        .event-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .event-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .event-image {
            height: 200px;
            background-size: cover;
            background-position: center;
            background-color: #f0f0f0;
        }

        .event-image-placeholder {
            height: 200px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 64px;
        }

        .event-content {
            padding: 20px;
        }

        .event-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }

        .event-header h3 {
            margin: 0;
            color: #1b264f;
            font-size: 20px;
            flex: 1;
        }

        .event-badges {
            display: flex;
            gap: 5px;
            flex-direction: column;
            align-items: flex-end;
        }

        .event-description {
            color: #666;
            margin: 10px 0;
            line-height: 1.5;
        }

        .event-meta {
            margin: 15px 0;
        }

        .meta-item {
            margin: 8px 0;
            color: #444;
            font-size: 14px;
        }

        .meta-item strong {
            margin-right: 5px;
        }

        .event-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin: 15px 0;
        }

        .tag {
            background: #f0f0f0;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            color: #666;
        }

        .event-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #f0f0f0;
        }

        .edit-btn, .delete-btn {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }

        .edit-btn {
            background: #e3f2fd;
            color: #1976d2;
        }

        .edit-btn:hover {
            background: #1976d2;
            color: white;
        }

        .delete-btn {
            background: #ffebee;
            color: #c62828;
        }

        .delete-btn:hover {
            background: #c62828;
            color: white;
        }

        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal {
            background: white;
            border-radius: 8px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
        }

        .modal-header h2 {
            margin: 0;
            color: #1b264f;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            width: 30px;
            height: 30px;
            padding: 0;
        }

        .close-btn:hover {
            color: #333;
        }

        form {
            padding: 20px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        .form-group label {
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: inherit;
            font-size: 14px;
        }

        .form-group textarea {
            resize: vertical;
        }

        .checkbox-group label {
            flex-direction: row;
            align-items: center;
            gap: 8px;
        }

        .checkbox-group input[type="checkbox"] {
            width: auto;
        }

        .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
        }

        .cancel-btn, .save-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }

        .cancel-btn {
            background: #f0f0f0;
            color: #333;
        }

        .cancel-btn:hover {
            background: #e0e0e0;
        }

        .save-btn {
            background: #1b264f;
            color: white;
        }

        .save-btn:hover {
            background: #ffd100;
            color: #1b264f;
        }

        /* Families Table */
        table {
            width: 100%;
            background: white;
            border-radius: 6px;
            border-collapse: collapse;
            overflow: hidden;
        }

        thead {
            background: #f7f7f7;
        }

        th {
            padding: 16px 20px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #666;
            cursor: pointer;
        }

        th:hover {
            background: #efefef;
        }

        tbody tr {
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
        }

        tbody tr:hover {
            background: #f9f9f9;
        }

        td {
            padding: 16px 20px;
        }

        .family-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #1b264f;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
        }

        .name {
            font-weight: 600;
            color: #1b264f;
        }

        .code {
            font-size: 12px;
            color: #999;
            font-family: monospace;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .category {
            background: #e8e8e8;
            color: #333;
        }

        .featured {
            background: #ffd100;
            color: #1b264f;
        }

        .priority-critical,
        .priority-high {
            background: #fee;
            color: #c33;
        }

        .priority-medium {
            background: #fff3e0;
            color: #e65100;
        }

        .priority-low {
            background: #e3f2fd;
            color: #1976d2;
        }

        .status-new {
            background: #e3f2fd;
            color: #1976d2;
        }

        .status-active {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-published {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-draft {
            background: #fff3e0;
            color: #e65100;
        }

        .status-cancelled {
            background: #ffebee;
            color: #c62828;
        }

        .status-completed {
            background: #e0e0e0;
            color: #666;
        }

        .status-escalated {
            background: #fee;
            color: #c33;
        }

        .view-btn {
            padding: 6px 12px;
            border: none;
            background: transparent;
            color: #1b264f;
            font-weight: 600;
            cursor: pointer;
        }

        .view-btn:hover {
            color: #ffd100;
        }

        .loading,
        .no-results,
        .placeholder {
            padding: 60px;
            text-align: center;
            background: white;
            border-radius: 6px;
        }

        .no-results button {
            margin-top: 15px;
            padding: 10px 20px;
            border: none;
            background: #1b264f;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }

        /* Blade Styles */
        .blade-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: stretch;
            justify-content: flex-end;
            z-index: 2000;
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }

        .blade {
            background: white;
            width: 600px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        }

        .blade-header {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            background: #f7f7f7;
        }

        .back-btn {
            background: none;
            border: none;
            color: #1b264f;
            font-weight: 600;
            cursor: pointer;
            padding: 8px 0;
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .back-btn:hover {
            color: #ffd100;
        }

        .blade-header h2 {
            margin: 0;
            color: #1b264f;
            font-size: 24px;
        }

        .blade-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .detail-section {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-section:last-of-type {
            border-bottom: none;
        }

        .detail-section h3 {
            margin: 0 0 15px 0;
            color: #1b264f;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .family-avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #1b264f;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 36px;
            margin: 0 auto 15px;
        }

        .family-name {
            text-align: center;
            margin: 0 0 5px 0;
            color: #1b264f;
            font-size: 28px;
        }

        .family-reference {
            text-align: center;
            margin: 0;
            color: #999;
            font-family: monospace;
            font-size: 14px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .info-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }

        .flags-list,
        .engagement-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .flag-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #fff3e0;
            border-left: 4px solid #f57c00;
            border-radius: 4px;
        }

        .flag-icon {
            font-size: 20px;
        }

        .flag-text {
            color: #e65100;
            font-weight: 600;
        }

        .engagement-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            border-radius: 4px;
        }

        .engagement-icon {
            color: #2e7d32;
            font-weight: bold;
            font-size: 18px;
        }

        .engagement-text {
            color: #1b5e20;
            font-weight: 500;
        }

        .timeline {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .timeline-item {
            display: flex;
            gap: 15px;
            position: relative;
        }

        .timeline-item:not(:last-child)::before {
            content: '';
            position: absolute;
            left: 19px;
            top: 40px;
            bottom: -20px;
            width: 2px;
            background: #e0e0e0;
        }

        .timeline-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
        }

        .timeline-icon.check-in {
            background: #e3f2fd;
        }

        .timeline-icon.system {
            background: #f3e5f5;
        }

        .timeline-icon.service {
            background: #e8f5e9;
        }

        .timeline-content {
            flex: 1;
        }

        .timeline-title {
            font-size: 11px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .timeline-description {
            color: #333;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .timeline-time {
            color: #999;
            font-size: 12px;
        }

        .detail-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
        }

        .action-btn {
            padding: 12px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }

        .action-btn:hover {
            background: #f7f7f7;
            border-color: #1b264f;
        }

        .action-btn.primary {
            background: #1b264f;
            color: white;
            border-color: #1b264f;
        }

        .action-btn.primary:hover {
            background: #ffd100;
            color: #1b264f;
            border-color: #ffd100;
        }

        /* Families Table */
        table {
            width: 100%;
            background: white;
            border-radius: 6px;
            border-collapse: collapse;
            overflow: hidden;
        }

        thead {
            background: #f7f7f7;
        }

        th {
            padding: 16px 20px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #666;
            cursor: pointer;
        }

        th:hover {
            background: #efefef;
        }

        tbody tr {
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
        }

        tbody tr:hover {
            background: #f9f9f9;
        }

        td {
            padding: 16px 20px;
        }

        .family-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #1b264f;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
        }

        .name {
            font-weight: 600;
            color: #1b264f;
        }

        .code {
            font-size: 12px;
            color: #999;
            font-family: monospace;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .category {
            background: #e8e8e8;
            color: #333;
        }

        .featured {
            background: #ffd100;
            color: #1b264f;
        }

        .priority-critical,
        .priority-high {
            background: #fee;
            color: #c33;
        }

        .priority-medium {
            background: #fff3e0;
            color: #e65100;
        }

        .priority-low {
            background: #e3f2fd;
            color: #1976d2;
        }

        .status-new {
            background: #e3f2fd;
            color: #1976d2;
        }

        .status-active {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-published {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-draft {
            background: #fff3e0;
            color: #e65100;
        }

        .status-cancelled {
            background: #ffebee;
            color: #c62828;
        }

        .status-completed {
            background: #e0e0e0;
            color: #666;
        }

        .status-escalated {
            background: #fee;
            color: #c33;
        }

        .view-btn {
            padding: 6px 12px;
            border: none;
            background: transparent;
            color: #1b264f;
            font-weight: 600;
            cursor: pointer;
        }

        .view-btn:hover {
            color: #ffd100;
        }

        .loading,
        .no-results,
        .placeholder {
            padding: 60px;
            text-align: center;
            background: white;
            border-radius: 6px;
        }

        .no-results button {
            margin-top: 15px;
            padding: 10px 20px;
            border: none;
            background: #1b264f;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }

        /* Blade Styles */
        .blade-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: stretch;
            justify-content: flex-end;
            z-index: 2000;
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }

        .blade {
            background: white;
            width: 600px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        }

        .blade-header {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            background: #f7f7f7;
        }

        .back-btn {
            background: none;
            border: none;
            color: #1b264f;
            font-weight: 600;
            cursor: pointer;
            padding: 8px 0;
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .back-btn:hover {
            color: #ffd100;
        }

        .blade-header h2 {
            margin: 0;
            color: #1b264f;
            font-size: 24px;
        }

        .blade-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .detail-section {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-section:last-of-type {
            border-bottom: none;
        }

        .detail-section h3 {
            margin: 0 0 15px 0;
            color: #1b264f;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .family-avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #1b264f;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 36px;
            margin: 0 auto 15px;
        }

        .family-name {
            text-align: center;
            margin: 0 0 5px 0;
            color: #1b264f;
            font-size: 28px;
        }

        .family-reference {
            text-align: center;
            margin: 0;
            color: #999;
            font-family: monospace;
            font-size: 14px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .info-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }

        .flags-list,
        .engagement-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .flag-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #fff3e0;
            border-left: 4px solid #f57c00;
            border-radius: 4px;
        }

        .flag-icon {
            font-size: 20px;
        }

        .flag-text {
            color: #e65100;
            font-weight: 600;
        }

        .engagement-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            border-radius: 4px;
        }

        .engagement-icon {
            color: #2e7d32;
            font-weight: bold;
            font-size: 18px;
        }

        .engagement-text {
            color: #1b5e20;
            font-weight: 500;
        }

        .timeline {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .timeline-item {
            display: flex;
            gap: 15px;
            position: relative;
        }

        .timeline-item:not(:last-child)::before {
            content: '';
            position: absolute;
            left: 19px;
            top: 40px;
            bottom: -20px;
            width: 2px;
            background: #e0e0e0;
        }

        .timeline-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
        }

        .timeline-icon.check-in {
            background: #e3f2fd;
        }

        .timeline-icon.system {
            background: #f3e5f5;
        }

        .timeline-icon.service {
            background: #e8f5e9;
        }

        .timeline-content {
            flex: 1;
        }

        .timeline-title {
            font-size: 11px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .timeline-description {
            color: #333;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .timeline-time {
            color: #999;
            font-size: 12px;
        }

        .detail-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
        }

        .action-btn {
            padding: 12px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }

        .action-btn:hover {
            background: #f7f7f7;
            border-color: #1b264f;
        }

        .action-btn.primary {
            background: #1b264f;
            color: white;
            border-color: #1b264f;
        }

        .action-btn.primary:hover {
            background: #ffd100;
            color: #1b264f;
            border-color: #ffd100;
        }

        /* Families Table */
        table {
            width: 100%;
            background: white;
            border-radius: 6px;
            border-collapse: collapse;
            overflow: hidden;
        }

        thead {
            background: #f7f7f7;
        }

        th {
            padding: 16px 20px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #666;
            cursor: pointer;
        }

        th:hover {
            background: #efefef;
        }

        tbody tr {
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
        }

        tbody tr:hover {
            background: #f9f9f9;
        }

        td {
            padding: 16px 20px;
        }

        .family-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #1b264f;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
        }

        .name {
            font-weight: 600;
            color: #1b264f;
        }

        .code {
            font-size: 12px;
            color: #999;
            font-family: monospace;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .category {
            background: #e8e8e8;
            color: #333;
        }

        .featured {
            background: #ffd100;
            color: #1b264f;
        }

        .priority-critical,
        .priority-high {
            background: #fee;
            color: #c33;
        }

        .priority-medium {
            background: #fff3e0;
            color: #e65100;
        }

        .priority-low {
            background: #e3f2fd;
            color: #1976d2;
        }

        .status-new {
            background: #e3f2fd;
            color: #1976d2;
        }

        .status-active {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-published {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-draft {
            background: #fff3e0;
            color: #e65100;
        }

        .status-cancelled {
            background: #ffebee;
            color: #c62828;
        }

        .status-completed {
            background: #e0e0e0;
            color: #666;
        }

        .status-escalated {
            background: #fee;
            color: #c33;
        }

        .view-btn {
            padding: 6px 12px;
            border: none;
            background: transparent;
            color: #1b264f;
            font-weight: 600;
            cursor: pointer;
        }

        .view-btn:hover {
            color: #ffd100;
        }

        .loading,
        .no-results,
        .placeholder {
            padding: 60px;
            text-align: center;
            background: white;
            border-radius: 6px;
        }

        .no-results button {
            margin-top: 15px;
            padding: 10px 20px;
            border: none;
            background: #1b264f;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }

        /* Blade Styles */
        .blade-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: stretch;
            justify-content: flex-end;
            z-index: 2000;
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }

        .blade {
            background: white;
            width: 600px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        }

        .blade-header {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            background: #f7f7f7;
        }

        .back-btn {
            background: none;
            border: none;
            color: #1b264f;
            font-weight: 600;
            cursor: pointer;
            padding: 8px 0;
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .back-btn:hover {
            color: #ffd100;
        }

        .blade-header h2 {
            margin: 0;
            color: #1b264f;
            font-size: 24px;
        }

        .blade-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .detail-section {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-section:last-of-type {
            border-bottom: none;
        }

        .detail-section h3 {
            margin: 0 0 15px 0;
            color: #1b264f;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .family-avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #1b264f;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 36px;
            margin: 0 auto 15px;
        }

        .family-name {
            text-align: center;
            margin: 0 0 5px 0;
            color: #1b264f;
            font-size: 28px;
        }

        .family-reference {
            text-align: center;
            margin: 0;
            color: #999;
            font-family: monospace;
            font-size: 14px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .info-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }

        .flags-list,
        .engagement-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .flag-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #fff3e0;
            border-left: 4px solid #f57c00;
            border-radius: 4px;
        }

        .flag-icon {
            font-size: 20px;
        }

        .flag-text {
            color: #e65100;
            font-weight: 600;
        }

        .engagement-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            border-radius: 4px;
        }

        .engagement-icon {
            color: #2e7d32;
            font-weight: bold;
            font-size: 18px;
        }

        .engagement-text {
            color: #1b5e20;
            font-weight: 500;
        }

        .timeline {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .timeline-item {
            display: flex;
            gap: 15px;
            position: relative;
        }

        .timeline-item:not(:last-child)::before {
            content: '';
            position: absolute;
            left: 19px;
            top: 40px;
            bottom: -20px;
            width: 2px;
            background: #e0e0e0;
        }

        .timeline-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
        }

        .timeline-icon.check-in {
            background: #e3f2fd;
        }

        .timeline-icon.system {
            background: #f3e5f5;
        }

        .timeline-icon.service {
            background: #e8f5e9;
        }

        .timeline-content {
            flex: 1;
        }

        .timeline-title {
            font-size: 11px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .timeline-description {
            color: #333;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .timeline-time {
            color: #999;
            font-size: 12px;
        }

        .detail-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
        }

        .action-btn {
            padding: 12px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }

        .action-btn:hover {
            background: #f7f7f7;
            border-color: #1b264f;
        }

        .action-btn.primary {
            background: #1b264f;
            color: white;
            border-color: #1b264f;
        }

        .action-btn.primary:hover {
            background: #ffd100;
            color: #1b264f;
            border-color: #ffd100;
        }
    `;
}

customElements.define('families-management-dashboard', FamiliesManagementDashboard);
