<template>
  <v-container fluid>
    <v-card max-width="450px" class="mx-auto" color="#f4fdff" elevation="2">
      <v-img height="100px" :src="bgImg"
        gradient="180deg, rgb(250 250 250 / 58%) 0%, rgb(227 250 255 / 52%) 35%, rgb(174 229 241 / 74%) 180%"
        cover></v-img>
      <v-row justify="center">
        <v-col align-self="start" class="d-flex justify-center align-center pa-0" cols="12">
          <v-avatar class="profile avatar-center-height avatar-shadow" size="164">
            <v-img :src="defaultImg"></v-img>
          </v-avatar>
        </v-col>
      </v-row>
      <v-list-item class="profile-text-name ma-4 pt-8">
        <v-list-item-content>
          <v-list-item-title class="text-h6">{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>
            <v-row no-gutters>
              <v-col cols="12" class="d-flex align-center">
                <v-chip class="text-subtitle-2 font-weight-bold" :href="'mailto:' + user.email"
                  prepend-icon="mdi-email-outline" variant="text">
                  {{ user.email }}
                </v-chip>
              </v-col>
              <v-col cols="12" class="d-flex align-center">
                <v-chip class="text-subtitle-2 font-weight-bold" @click="openInNewTab(user.website)" prepend-icon="mdi-web"
                  variant="text">
                  {{ user.website }}
                </v-chip>
              </v-col>
            </v-row>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-row>
        <v-col cols="12">
          <v-card-actions class="justify-center">
            <v-btn @click="togglePostsVisibility" elevation="2"
              :prepend-icon="`${showPosts ? `mdi-eye-off-outline` : `mdi-eye-outline`}`" variant="tonal">
              {{ showPosts ? 'Hide Posts' : 'Show Posts' }}
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-if="showPosts">
              <user-post v-for="post in posts" :key="post.id" :post="post"></user-post>
              <v-card-actions class="justify-center">
                <v-btn @click="togglePostsVisibility" elevation="2" prepend-icon="mdi-eye-off-outline" variant="tonal">
                  Hide Posts
                </v-btn>
              </v-card-actions>
            </div>
          </v-expand-transition>
        </v-col>
      </v-row>
      <div v-if="loading" class="overlay">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <span>Data loading...</span>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import UserPost from './UserPost.vue'
import defaultImg from '../assets/default-profile-pic.jpg'
import bgImg from '../assets/bg-img.jpg'

export default {
  name: 'UserProfileCard',
  props: {
    userId: Number,
    loading: Boolean
  },
  components: {
    UserPost
  },
  emits: ['toggle-posts', 'update-loading'],
  setup(props, { emit }) {
    const store = useStore()
    const user = computed(() => store.getters['users/getUserDetails'])
    const posts = computed(() => store.getters['users/getUserPosts'])
    const showPosts = ref(false)

    watch(() => props.userId, async (newUserId) => {
      if (newUserId) {
        await store.dispatch('users/fetchUserDetails', newUserId)
        await store.dispatch('users/fetchUserPosts', newUserId)
        emit('update-loading', false)
      }
    });

    const togglePostsVisibility = () => {
      showPosts.value = !showPosts.value
      emit('toggle-posts', showPosts.value)
    };

    const openInNewTab = (url) => {
      const newWindow = window.open(`https://${url}`, '_blank')
      if (newWindow) newWindow.focus()
    };

    return {
      user,
      posts,
      showPosts,
      defaultImg,
      bgImg,
      togglePostsVisibility,
      openInNewTab
    };
  }
};
</script>

<style scoped>
.avatar-shadow {
  box-shadow: 0 0 10px rgba(50, 12, 112, 0.75);
}

.profile-text-name {
  justify-content: space-between;
}

.profile-text-name .v-list-item-subtitle {
  display: flex;
  align-items: center;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.overlay span {
  margin-left: 10px;
}

</style>