const profileManager = {
    // প্রোফাইল এডিট মোড ওপেন করা
    openEdit() {
        const user = authManager.getCurrentUser();
        if (!user) return;

        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-designation').value = user.designation;
        document.getElementById('edit-workplace').value = user.workplace;
        app.goView('v-profile-edit');
    },

    // তথ্য সেভ করা
    saveProfile() {
        const users = authManager.getUsers();
        const currentUser = authManager.getCurrentUser();
        
        const updatedUsers = users.map(u => {
            if (u.email === currentUser.email) {
                return {
                    ...u,
                    name: document.getElementById('edit-name').value,
                    designation: document.getElementById('edit-designation').value,
                    workplace: document.getElementById('edit-workplace').value
                };
            }
            return u;
        });

        authManager.saveUsers(updatedUsers);
        toast('প্রোফাইল আপডেট সফল হয়েছে', 'success');
        app.goView('v-profile');
    }
};