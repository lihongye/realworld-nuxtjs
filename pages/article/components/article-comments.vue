<template>
  <div>
    <form 
      class="card comment-form"
      v-if="user"
    >
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>
    <p v-else>
      <nuxt-link
        :to="{
          name:'login'
        }"
      >
      Sign in
      </nuxt-link>
       or 
      <nuxt-link
        :to="{
          name:'register'
        }"
      >
      Sign up
      </nuxt-link>
        to add comments on this article.
    </p>
    <div 
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name:'profile',
            params:{
              username: comment.author.username
            }
          }"
          class="comment-author"
        >
          <img
            src="http://i.imgur.com/Qr71crq.jpg"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name:'profile',
            params:{
              username: comment.author.username
            }
          }"
          class="comment-author"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD,YYYY') }}</span>
      </div>
    </div>
  </div>
</template>

<script>

import { getComments } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name:'ArticleComments',
  props:{
    article:{
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      defaultImage:'https://static.productionready.io/images/smiley-cyrus.jpg'
    };
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  computed:{
      ...mapState(['user'])
    }
};
</script>
<style lang="scss" scoped></style>
