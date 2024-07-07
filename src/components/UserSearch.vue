<template>
  <div class="search-container">
    <v-row dense>
      <v-col cols="3"></v-col>
      <v-col cols="6" class="search-column">
        <v-text-field v-model="searchKeyword" label="Search users" placeholder="Search by Name / Username / Email"
          outlined dense variant="solo" @input="debouncedSearch" class="search-input"></v-text-field>
        <v-list bg-color="#fafafa" v-if="searchResults.length > 0 && isSearching" class="search-results">
          <v-list-item v-for="user in searchResults" :key="user.id" @click="selectUser(user)">
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-alert v-if="isSearching && searchKeyword.length > 0 && searchResults.length === 0" type="info" outlined>
          No results found.
        </v-alert>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash'

export default {
  name: 'UserSearch',
  emits: ['select'],
  setup(props, { emit }) {
    const searchKeyword = ref('')
    const searchResults = ref([])
    const isSearching = ref(false)

    const fetchUsers = async (query) => {
      try {
        if (query.length === 0) {
          searchResults.value = []
          isSearching.value = false
        } else {
          isSearching.value = true
          const response = await axios.get(`https://jsonplaceholder.typicode.com/users`)
          const users = response.data

          searchResults.value = users.filter(user =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
          )
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        isSearching.value = false
      }
    };

    const debouncedSearch = debounce(() => {
      fetchUsers(searchKeyword.value)
    }, 500);

    const selectUser = (user) => {
      emit('select', user)
      searchKeyword.value = ''
      searchResults.value = []
      isSearching.value = false
    };

    return {
      searchKeyword,
      searchResults,
      isSearching,
      debouncedSearch,
      selectUser
    };
  }
};
</script>

<style scoped>
.search-input {
  width: 100%;
  margin-bottom: 10px;
}

.search-results {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.v-list-item {
  cursor: pointer;
}
</style>
