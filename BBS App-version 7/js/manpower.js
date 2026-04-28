const manpowerManager = {
    renderList(searchTerm = '') {
        const users = authManager.getUsers().filter(u => u.status === 'approved');
        const listEl = document.getElementById('employee-list');
        
        const filtered = users.filter(u => 
            u.name.includes(searchTerm) || 
            u.designation.includes(searchTerm) || 
            u.workplace.includes(searchTerm)
        );

        listEl.innerHTML = filtered.map(u => `
            <div class="emp-card">
                <div class="emp-info">
                    <div class="emp-name">${u.name}</div>
                    <div class="emp-sub">${u.designation} | ${u.workplace}</div>
                </div>
                <a href="tel:${u.phone || ''}" class="call-btn">📞</a>
            </div>
        `).join('');
    }
};