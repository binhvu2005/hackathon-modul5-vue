<template>
    <v-dialog v-model="visible" max-width="600px" persistent>
      <v-card>
        <v-card-title>{{ mode === 'add' ? 'Add User' : 'Edit User' }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field 
              v-model="formData.name" 
              label="Name" 
              :rules="[rules.required]" 
              @input="clearErrors('name')"
              autofocus
            ></v-text-field>
    
            <div class="gender-container">
              <label>Gender:</label>
              <label>
                <input type="radio" value="Male" v-model="formData.gender" /> Male
              </label>
              <label>
                <input type="radio" value="Female" v-model="formData.gender" /> Female
              </label>
              <label>
                <input type="radio" value="Other" v-model="formData.gender" /> Other
              </label>
            </div>
    
            <v-text-field 
              v-model="formData.dob" 
              label="Date of Birth" 
              :rules="[rules.required, rules.validDate]" 
              type="date"
              @input="clearErrors('dob')"
            ></v-text-field>
    
            <v-text-field 
              v-model="formData.email" 
              label="Email" 
              :rules="[rules.required, rules.validEmail]" 
              type="email"
              @input="clearErrors('email')"
            ></v-text-field>
    
            <v-alert v-if="errorMessages.length" type="error" dismissible>
              <ul>
                <li v-for="(error, index) in errorMessages" :key="index">{{ error }}</li>
              </ul>
            </v-alert>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeForm">Close</v-btn>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const emit = defineEmits(['save', 'close']);
  const visible = ref(true);
  const formData = ref({
    name: '',
    gender: 'Male',
    dob: '',
    email: '',
  });
  const users = ref(JSON.parse(localStorage.getItem('users')) || []);
  const errorMessages = ref([]);
  
  const rules = {
    required: v => !!v || 'Field is required',
    validEmail: v => /.+@.+\..+/.test(v) || 'Must be a valid email',
    validDate: v => {
      const today = new Date().toISOString().split('T')[0];
      return v <= today || 'Date cannot be in the future';
    },
  };
  
  const props = defineProps(['mode', 'user']);
  
  watch(() => props.user, (newUser) => {
    console.log('New User:', newUser); 
    if (newUser) {
      formData.value = { ...newUser }; 
      
    } else {
      resetFormData(); 
    }
  });
  
  function resetFormData() {
    formData.value = {
      name: '',
      gender: 'Male',
      dob: '',
      email: '',
    };
  }
  
  function clearErrors(field) {
    errorMessages.value = errorMessages.value.filter(error => !error.includes(field));
  }
  
  function emailExists(email) {
    return users.value.some(user => user.email === email && (!props.user || user.stt !== props.user.stt));
  }
  
  async function save() {
    errorMessages.value = [];
    
    if (!formData.value.name) {
      errorMessages.value.push('Name is required');
    }
  
    if (!formData.value.email) {
      errorMessages.value.push('Email is required');
    } else if (!rules.validEmail(formData.value.email)) {
      errorMessages.value.push('Must be a valid email');
    } else if (emailExists(formData.value.email)) {
      errorMessages.value.push('Email already exists');
    }
  
    if (!formData.value.dob) {
      errorMessages.value.push('Date of Birth is required'); 
    } else if (!rules.validDate(formData.value.dob)) {
      errorMessages.value.push('Date cannot be in the future');
    }
  
    if (errorMessages.value.length === 0) {
      emit('save', formData.value);
    }
  }
  
  function closeForm() {
    resetFormData(); 
    emit('close');
  }
  </script>
  
  <style scoped>
  .gender-container {
    margin: 10px 0;
  }
  </style>
  