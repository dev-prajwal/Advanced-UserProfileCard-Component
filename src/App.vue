<template>
  <v-app>
    <v-container>
      <v-row justify="center" class="search-bar-row">
        <v-col cols="12" md="8">
          <user-search @select="handleUserSelect"></user-search>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <user-profile-card v-if="selectedUserId" :user-id="selectedUserId" :loading="loading"
            @toggle-posts="togglePosts" @update-loading="setLoadingState"></user-profile-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="2500" top>
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import UserSearch from './components/UserSearch.vue'
import UserProfileCard from './components/UserProfileCard.vue'

export default {
  name: 'App',
  components: {
    UserSearch,
    UserProfileCard
  },
  setup() {
    const store = useStore()
    const selectedUserId = ref(null)
    const showSnackbar = ref(false)
    const snackbarMessage = ref('')
    const snackbarColor = ref('success')
    const loading = ref(false)

    const userExists = computed(() => Object.keys(store.getters['users/getUserDetails']).length > 0)

    const handleUserSelect = (user) => {
      if (user && user.id !== selectedUserId.value) {
        loading.value = true
        selectedUserId.value = user.id
      }
    };

    const setLoadingState = (state) => {
      loading.value = state
    };

    const togglePosts = (isVisible) => {
      snackbarMessage.value = isVisible ? 'Posts are now visible.' : 'Posts are now hidden.'
      snackbarColor.value = isVisible ? 'success' : 'warning'
      showSnackbar.value = true
    };

    onMounted(() => {
      //check if user exists, if not set an default user with userId=1
      if (!userExists.value) {
        loading.value = true
        selectedUserId.value = 1
        store.dispatch('users/fetchUserDetails', 1)
        store.dispatch('users/fetchUserPosts', 1)
        loading.value = false
      }
    });

    return {
      selectedUserId,
      handleUserSelect,
      togglePosts,
      showSnackbar,
      snackbarMessage,
      snackbarColor,
      setLoadingState,
      loading
    };
  }
};
</script>

<style>
.search-bar-row {
  margin-top: 50px;
}
</style>
