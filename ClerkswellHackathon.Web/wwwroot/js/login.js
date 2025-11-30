// Login Form Handler
class LoginApp {
    constructor() {
        this.elements = {
            // Tabs
            usernameTab: document.getElementById('usernameTab'),
            phoneTab: document.getElementById('phoneTab'),
            
            // Username form
            usernameForm: document.getElementById('usernameLoginForm'),
            usernameInput: document.getElementById('username'),
            passwordInput: document.getElementById('password'),
            usernameSubmitButton: document.getElementById('usernameSubmitButton'),
            usernameButtonText: document.getElementById('usernameButtonText'),
            
            // Phone form
            phoneForm: document.getElementById('phoneLoginForm'),
            phoneNumberInput: document.getElementById('phoneNumber'),
            phoneSubmitButton: document.getElementById('phoneSubmitButton'),
            phoneButtonText: document.getElementById('phoneButtonText'),
            
            // Verification
            phoneStep: document.getElementById('phoneStep'),
            verifyStep: document.getElementById('verifyStep'),
            verificationCodeInput: document.getElementById('verificationCode'),
            verifyButton: document.getElementById('verifyButton'),
            verifyButtonText: document.getElementById('verifyButtonText'),
            resendCodeButton: document.getElementById('resendCodeButton'),
            
            // Messages
            errorMessage: document.getElementById('errorMessage'),
            successMessage: document.getElementById('successMessage')
        };

        this.currentPhoneNumber = '';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Tab switching
        this.elements.usernameTab.addEventListener('click', () => this.switchTab('username'));
        this.elements.phoneTab.addEventListener('click', () => this.switchTab('phone'));
        
        // Form submissions
        this.elements.usernameForm.addEventListener('submit', (e) => this.handleUsernameLogin(e));
        this.elements.phoneForm.addEventListener('submit', (e) => this.handlePhoneLogin(e));
        
        // Verification
        this.elements.verifyButton.addEventListener('click', () => this.handleVerifyCode());
        this.elements.resendCodeButton.addEventListener('click', () => this.handleResendCode());
    }

    switchTab(tab) {
        if (tab === 'username') {
            this.elements.usernameTab.classList.add('active');
            this.elements.phoneTab.classList.remove('active');
            this.elements.usernameForm.classList.remove('hidden');
            this.elements.phoneForm.classList.add('hidden');
        } else {
            this.elements.phoneTab.classList.add('active');
            this.elements.usernameTab.classList.remove('active');
            this.elements.phoneForm.classList.remove('hidden');
            this.elements.usernameForm.classList.add('hidden');
            
            // Reset phone form
            this.elements.phoneStep.classList.remove('hidden');
            this.elements.verifyStep.classList.add('hidden');
        }
        
        this.hideMessages();
    }

    async handleUsernameLogin(e) {
        e.preventDefault();

        const username = this.elements.usernameInput.value.trim();
        const password = this.elements.passwordInput.value;

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        this.setLoading('username', true);
        this.hideMessages();

        try {
            const response = await fetch('/api/member/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.showSuccess('Login successful! Redirecting...');
                
                if (data.data) {
                    sessionStorage.setItem('user', JSON.stringify(data.data));
                }

                setTimeout(() => {
                    window.location.href = '/journey';
                }, 1000);
            } else {
                this.showError(data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('An error occurred during login. Please try again.');
        } finally {
            this.setLoading('username', false);
        }
    }

    async handlePhoneLogin(e) {
        e.preventDefault();

        const phoneNumber = this.elements.phoneNumberInput.value.trim();

        if (!phoneNumber) {
            this.showError('Please enter a phone number');
            return;
        }

        this.setLoading('phone', true);
        this.hideMessages();

        try {
            const response = await fetch('/api/member/phone/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    phoneNumber: phoneNumber
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.currentPhoneNumber = phoneNumber;
                this.showSuccess('Verification code sent to your phone');
                
                // Show verification step
                this.elements.phoneStep.classList.add('hidden');
                this.elements.verifyStep.classList.remove('hidden');
                this.elements.verificationCodeInput.focus();
            } else {
                this.showError(data.message || 'Failed to send verification code');
            }
        } catch (error) {
            console.error('Phone login error:', error);
            this.showError('An error occurred. Please try again.');
        } finally {
            this.setLoading('phone', false);
        }
    }

    async handleVerifyCode() {
        const code = this.elements.verificationCodeInput.value.trim();

        if (!code || code.length !== 6) {
            this.showError('Please enter a valid 6-digit code');
            return;
        }

        this.setLoading('verify', true);
        this.hideMessages();

        try {
            const response = await fetch('/api/member/phone/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    phoneNumber: this.currentPhoneNumber,
                    code: code
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.showSuccess('Login successful! Redirecting...');
                
                if (data.data) {
                    sessionStorage.setItem('user', JSON.stringify(data.data));
                }

                setTimeout(() => {
                    window.location.href = '/journey';
                }, 1000);
            } else {
                this.showError(data.message || 'Invalid verification code');
            }
        } catch (error) {
            console.error('Verification error:', error);
            this.showError('An error occurred during verification. Please try again.');
        } finally {
            this.setLoading('verify', false);
        }
    }

    async handleResendCode() {
        this.hideMessages();
        
        try {
            const response = await fetch('/api/member/phone/send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    phoneNumber: this.currentPhoneNumber
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.showSuccess('New verification code sent');
            } else {
                this.showError(data.message || 'Failed to resend code');
            }
        } catch (error) {
            console.error('Resend error:', error);
            this.showError('An error occurred. Please try again.');
        }
    }

    setLoading(type, isLoading) {
        if (type === 'username') {
            this.elements.usernameSubmitButton.disabled = isLoading;
            this.elements.usernameButtonText.textContent = isLoading ? 'Logging in...' : 'Log In';
            
            if (isLoading) {
                this.elements.usernameSubmitButton.classList.add('loading');
            } else {
                this.elements.usernameSubmitButton.classList.remove('loading');
            }
        } else if (type === 'phone') {
            this.elements.phoneSubmitButton.disabled = isLoading;
            this.elements.phoneButtonText.textContent = isLoading ? 'Sending...' : 'Send Code';
            
            if (isLoading) {
                this.elements.phoneSubmitButton.classList.add('loading');
            } else {
                this.elements.phoneSubmitButton.classList.remove('loading');
            }
        } else if (type === 'verify') {
            this.elements.verifyButton.disabled = isLoading;
            this.elements.verifyButtonText.textContent = isLoading ? 'Verifying...' : 'Verify & Log In';
            
            if (isLoading) {
                this.elements.verifyButton.classList.add('loading');
            } else {
                this.elements.verifyButton.classList.remove('loading');
            }
        }
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.successMessage.classList.add('hidden');
    }

    showSuccess(message) {
        this.elements.successMessage.textContent = message;
        this.elements.successMessage.classList.remove('hidden');
        this.elements.errorMessage.classList.add('hidden');
    }

    hideMessages() {
        this.elements.errorMessage.classList.add('hidden');
        this.elements.successMessage.classList.add('hidden');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoginApp();
});
