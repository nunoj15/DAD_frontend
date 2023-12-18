<template>
    <div>

        <div id="editModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeEditModal()">&times;</span>
                <label for="editedCategoryName">Name:</label>
                <input id="editedCategoryName" v-model="editedCategory.name">

                <label for="editedCategoryType">Type:</label>

                <select v-model="editedCategory.type" id="editedCategoryType" class="custom-input">
                    <option value="D">Debit</option>
                    <option value="C">Credit</option>
                </select>

                <button @click="saveEditedCategory">Save</button>
                <button @click="closeEditModal">Cancel</button>
            </div>
        </div>
        <label class="custom-label" for="categoryName">Category Name:</label>
        <input v-model="newCategoryName" type="text" id="categoryName" class="custom-input" />

        <label class="custom-label" for="categoryType">Category Type:</label>
        <select v-model="newCategoryType" id="categoryType" class="custom-input">

            <option value="D">Debit</option>
            <option value="C">Credit</option>
        </select>

        <button class="custom-button" @click="addCategory">Add Category</button>

        <table class="custom-table">
            <thead style="text-decoration: black;">
                <tr>
                    <th>Categoory</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in categories" :key="category.id">
                    <td>{{ category.name }}</td>
                    <td>{{ category.type }}</td>
                    <td>
                        <span @click="openEditModal(category)" class="action-icon">✏️</span>
                        <span @click="softDeleteCategory(category)" class="action-icon">🗑️</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<style>
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fefefe;
    padding: 20px;
    border-radius: 10px;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
}

button {
    padding: 8px 16px;
    margin-top: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.custom-input {
    border: 1px solid #ffffff;
    padding: 8px;
    margin-right: 10px;
    text-decoration: white;
}



.custom-button {
    border: 1px solid #ffffff;
    padding: 8px 15px;
    cursor: pointer;
}

.custom-table th {
    background-color: #333333;
    color: #ffffff;
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.custom-table th,
.custom-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    text-decoration: black;
}

.custom-table th {
    background-color: #333333;
    color: #ffffff;
}

.action-icon {
    cursor: pointer;
    margin-right: 5px;
}
</style>




<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
const toast = inject('toast');


const user = ref({});
const newCategoryName = ref('');
const newCategoryType = ref('');
const categories = ref([]);

const editedCategory = ref({
    id: null,
    name: '',
    type: '',
});


const addCategory = async () => {
    try {
        const response = await axios.post('/add-category', {
            name: newCategoryName.value,
            type: newCategoryType.value,
            vcard: {
                id: user.value.id,
                name: user.value.name,
            },
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const newCategory = response.data.category;

        categories.value.push(newCategory);

        newCategoryName.value = '';
        newCategoryType.value = '';
        toast.success("Category successfully addedd");


        fetchCategories();
    } catch (error) {
        toast.error("An error has occured adding the category");

        console.error('Failed to add category:', error);
    }
};

const fetchCategories = async () => {
    try {
        const userCategoriesResponse = await axios.get('/get-all-categories', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        categories.value = userCategoriesResponse.data.categories;
    } catch (error) {
        console.error('Failed to fetch user categories:', error);
    }
};

onMounted(async () => {
    try {
        const userResponse = await axios.get('/users/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        user.value = userResponse.data.usuario;

        await fetchCategories();
    } catch (error) {
        console.error('Failed to fetch user information:', error);
    }
});


const softDeleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`/soft-delete-category/${categoryId.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.data.message) {
            toast.success("Category successfully deleted");
        }

        fetchCategories();
    } catch (error) {
        if (error.response && error.response.status === 403) {
            toast.error("Can't delete default categories");
        } else {
            toast.error("An error has occured");
        }
    }
};

const openEditModal = (category) => {
    editedCategory.value.id = category.id;
    editedCategory.value.name = category.name;
    editedCategory.value.type = category.type;

    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
};

const saveEditedCategory = async () => {
    try {
        const response = await axios.put(`/update-category/${editedCategory.value.id}`, {
            name: editedCategory.value.name,
            type: editedCategory.value.type,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const updatedCategory = response.data.category;

        const index = categories.value.findIndex(category => category.id === updatedCategory.id);
        categories.value[index] = updatedCategory;
        toast.success("Category successfully updated");

        closeEditModal();
    } catch (error) {
        if (error.response && error.response.status === 403) {
            toast.error("Can't edit default categories");
        } else {
            toast.error("An error has occured");
            console.error('Failed to delete category:', error);
        }
    }
};

const closeEditModal = () => {
    editedCategory.value = {
        id: null,
        name: '',
        type: '',
    };

    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
};
</script>
