<template>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h1>Manager User</h1>
          <div class="header-actions">
            <button class="btn btn-primary" @click="showForm('add')">Add New User</button>
            <br>
            <input type="text" v-model="search" placeholder="Search by name or email" class="search-input" />
          </div>
        </div>
  
        <div class="pagination-controls">
          <label for="items-per-page">Items per page:</label>
          <select v-model="itemsPerPage" id="items-per-page">
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
  
        <table class="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.stt">
              <td>{{ user.stt }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.gender }}</td>
              <td>{{ user.dob }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button class="btn btn-primary" @click="showForm('edit', user)">Edit</button>
                <button class="btn btn-danger" @click="deleteUser(user)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
        </div>
  
        <UserForm v-if="formVisible" :mode="formMode" :user="selectedUser" @save="handleSave" @close="formVisible = false" />
  
        <div v-if="deleteDialog" class="modal">
          <div class="modal-content">
            <h4>Xác nhận</h4>
            <p>Bạn có muốn xóa người dùng này không</p>
            <hr>
            <div class="modal-actions">
              <button class="btn" @click="deleteDialog = false">Cancel</button>
              <button class="btn btn-danger" @click="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import UserForm from './UserForm.vue';
  
  const users = ref(JSON.parse(localStorage.getItem('users')) || []);
  const search = ref('');
  const formVisible = ref(false);
  const formMode = ref('add');
  const selectedUser = ref(null);
  const deleteDialog = ref(false);
  const userToDelete = ref(null);
  const currentPage = ref(1);
  const itemsPerPage = ref(5);
  const itemsPerPageOptions = [5, 10, 15, 20];
  
  const filteredUsers = computed(() =>
    users.value.filter(user =>
      user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase())
    )
  );
  
  const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
  });
  
  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredUsers.value.slice(start, start + itemsPerPage.value);
  });
  
  function showForm(mode, user = null) {
    formMode.value = mode;
    selectedUser.value = user ? { ...user } : null;
    formVisible.value = true;
  }
  
  function handleSave(newUser) {
    if (formMode.value === 'add') {
      newUser.stt = users.value.length + 1;
      users.value.push(newUser);
    } else if (formMode.value === 'edit') {
      const index = users.value.findIndex(user => user.stt === newUser.stt);
      if (index !== -1) {
        users.value[index] = newUser;
      }
    }
    localStorage.setItem('users', JSON.stringify(users.value));
    formVisible.value = false;
  }
  
  function deleteUser(user) {
    userToDelete.value = user;
    deleteDialog.value = true;
  }
  
  function confirmDelete() {
    users.value = users.value.filter(user => user.stt !== userToDelete.value.stt);
    localStorage.setItem('users', JSON.stringify(users.value));
    deleteDialog.value = false;
  }
  </script>
  
  <style scoped>
  .container {
    padding: 16px;
  }
  
  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #f5f5f5;
  }
  
  .header-actions {
    display: flex;
    flex-direction: column;
  }
  
  .btn {
    margin-left: 10px;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-danger {
    background-color: #dc3545;
    color: white;
  }
  
  .search-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  }
  
  .data-table th, .data-table td {
    padding: 12px;
    border: 1px solid #ddd;
  }
  
  .pagination-controls {
    margin: 16px 0;
    display: flex;
    align-items: center;
  }
  
  .pagination-controls label {
    margin-right: 10px;
  }
  
  .pagination-controls select {
    margin-left: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
  }
  
  .pagination button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f5f5f5;
    margin: 0 5px;
  }
  
  .pagination button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  .pagination button:not(:disabled):hover {
    background-color: #007bff;
    color: white;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
  </style>
  