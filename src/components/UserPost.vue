<template>
    <div class="ma-2">
      <v-card style="background-color: #fafafa;">
        <v-card-title class="text-center">{{ post.title }}</v-card-title>
        <v-card-text class="text-center">{{ post.body }}</v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserPost',
    props: {
      post: Object
    }
  };
  </script>
  
  