const adminManager = {
    renderPendingRequests() {
        const users = authManager.getUsers().filter(u => u.status === 'pending');
        const container = document.getElementById('admin-req-list');

        if (users.length === 0) {
            container.innerHTML = '<p class="empty-msg">কোনো পেন্ডিং আবেদন নেই</p>';
            return;
        }

        container.innerHTML = users.map(u => `
            <div class="admin-card">
                <div>
                    <strong>${u.name}</strong><br>
                    <small>${u.designation}</small>
                </div>
                <div class="admin-actions">
                    <button onclick="adminManager.approve('${u.email}')" class="btn-app">Approve</button>
                    <button onclick="adminManager.reject('${u.email}')" class="btn-rej">Reject</button>
                </div>
            </div>
        `).join('');
    },

    approve(email) {
        let users = authManager.getUsers();
        users = users.map(u => u.email === email ? { ...u, status: 'approved' } : u);
        authManager.saveUsers(users);
        toast('ইউজার অনুমোদিত', 'success');
        this.renderPendingRequests();
    }
};