// Initialize Supabase client
const SUPABASE_URL = 'https://rnjfkywebysuruuruagse.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuamZreXdlYnlzdXJ1dXVhZ3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQyODMsImV4cCI6MjA3NTE3MDI4M30.Vu6X6rTWeWUfmGUwmU4IK2Elk_VhYIhan_lGxEJH6mw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class DislinkedInApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            this.currentUser = session.user;
            this.showApp();
            await this.loadDislikes();
        } else {
            this.showAuth();
        }

        this.setupEventListeners();
        this.setupAuthStateListener();
    }

    setupEventListeners() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAuthTab(e.target.dataset.tab);
            });
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            await this.handleLogout();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', async () => {
            await this.loadDislikes();
            this.showToast('Dislikes refreshed!', 'success');
        });
    }

    setupAuthStateListener() {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                this.showApp();
                this.loadDislikes();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.showAuth();
            }
        });
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        if (tab === 'login') {
            document.getElementById('loginForm').style.display = 'flex';
            document.getElementById('signupForm').style.display = 'none';
        } else {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'flex';
        }
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');

        errorEl.textContent = '';

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            errorEl.textContent = error.message;
        } else {
            this.showToast('Login successful!', 'success');
        }
    }

    async handleSignup() {
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
        const errorEl = document.getElementById('signupError');

        errorEl.textContent = '';

        if (password !== passwordConfirm) {
            errorEl.textContent = 'Passwords do not match';
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            errorEl.textContent = error.message;
        } else {
            this.showToast('Account created! Please check your email to verify.', 'success');
            // Switch to login tab
            this.switchAuthTab('login');
        }
    }

    async handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            this.showToast('Error logging out', 'error');
        } else {
            this.showToast('Logged out successfully', 'success');
        }
    }

    showAuth() {
        document.getElementById('authContainer').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }

    showApp() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';

        if (this.currentUser) {
            document.getElementById('userEmail').textContent = this.currentUser.email;
        }
    }

    async loadDislikes() {
        try {
            const { data, error } = await supabase
                .from('post_dislikes')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;

            this.displayDislikes(data || []);
        } catch (error) {
            console.error('Error loading dislikes:', error);
            this.showToast('Error loading dislikes', 'error');
        }
    }

    displayDislikes(dislikes) {
        const totalDislikes = dislikes.reduce((sum, item) => sum + item.dislike_count, 0);
        const postsDisliked = dislikes.length;

        document.getElementById('totalDislikes').textContent = totalDislikes;
        document.getElementById('postsDisliked').textContent = postsDisliked;

        const listContainer = document.getElementById('dislikesList');

        if (dislikes.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <p>No dislikes recorded yet</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = dislikes.map(item => `
            <div class="dislike-item">
                <div class="dislike-info">
                    <div class="dislike-urn">${this.escapeHtml(item.post_urn)}</div>
                </div>
                <div class="dislike-count">${item.dislike_count}</div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DislinkedInApp();
});
