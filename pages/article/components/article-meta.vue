<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{
        article.author.createdAt | date('MMM DD,YYYY')
      }}</span>
    </div>
    <!-- 显示编辑 -->
    <template v-if="isUser">
        <span ng-show="$ctrl.canModify" class="ng-scope">
          <a
            class="btn btn-outline-secondary btn-sm"
            ui-sref="app.editor({ slug: $ctrl.article.slug })"
            href="#/editor/q-iirube"
          >
            <i class="ion-edit"></i> Edit Article
          </a>

          <button
            class="btn btn-outline-danger btn-sm"
            @click="deleteArt"
          >
            <i class="ion-trash-a"></i> Delete Article
          </button>
        </span>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        @click="onFollow(article.author)"
        :disabled="article.author.followDisabled"
      >
        <i class="ion-plus-round"></i>
        <template v-if="article.author.following">
          &nbsp; Unfollow {{ article.author.username }}
        </template>
        <template v-else>
          &nbsp; Follow {{ article.author.username }}
        </template>
        <span class="counter">(0)</span>
      </button>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        @click="onFavorite(article)"
        :disabled="article.favoriteDisabled"
      >
        <i class="ion-heart"></i>&nbsp;
        <template v-if="article.favorited">
          Unfavorite Article
        </template>
        <template v-else>
          Favorite Article
        </template>
        <span class="counter">({{ article.favoritesCount }})</span>
      </button></template
    >
  </div>
</template>

<script>
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article';
import { followProfiles, unFollowProfiles } from '@/api/user';
import { mapState } from 'vuex';
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$set(this.article, 'favoriteDisabled', false);
    this.$set(this.article.author, 'followDisabled', false);
    // this.article.favoriteDisabled = false;
    console.log(this.article);
  },
  computed: {
    ...mapState(['user']),
    isUser() {
      return this.article.author.username == this.user.username;
    }
  },
  methods: {
    async deleteArt(article){
     await deleteArticle(article.slug)
     this.$router.replace({name:'home'})
    },
    async onFavorite(article) {
      if (!this.user) {
        this.$router.push('/login');
      } else {
        article.favoriteDisabled = true;
        if (article.favorited) {
          await deleteFavorite(article.slug);
          article.favorited = false;
          article.favoritesCount += -1;
        } else {
          await addFavorite(article.slug);
          article.favorited = true;
          article.favoritesCount += 1;
        }
        article.favoriteDisabled = false;
      }
    },
    // 关注作者
    async onFollow(author) {
      author.followDisabled = true;
      if (author.following) {
        await unFollowProfiles(author.username);
        author.following = false;
      } else {
        await followProfiles(author.username);
        author.following = true;
      }
      author.followDisabled = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
