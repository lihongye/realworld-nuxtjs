<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="author.image" class="user-img" />
            <h4>{{ author.username }}</h4>
            <p>{{ author.bio }}</p>

            <nuxt-link
              v-if="isUser"
              class="btn btn-sm btn-outline-secondary action-btn"
              :to="{
                name: 'settings',
              }"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="onFollow(author)"
              :disabled="author.followDisabled"
            >
              <i class="ion-plus-round"></i>
              <template v-if="author.following">
                &nbsp; Unfollow {{ author.username }}
              </template>
              <template v-else>
                &nbsp; Follow {{ author.username }}
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'myArticles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'myArticles',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favoritedArticles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favoritedArticles',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <template v-if="articlesCount == 0">
            无内容
          </template>
          <template v-else>
            <div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
            >
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  <img :src="article.author.image" />
                </nuxt-link>
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
                    article.createdAt | date("MMM DD,YYYY")
                  }}</span>
                </div>
                <button 
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                    active: article.favorited,
                  }"
                  @click="onFavorite(article)" 
                  :disabled="article.favoriteDisabled"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                class="preview-link"
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug,
                  },
                }"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, getProfiles, followProfiles, unFollowProfiles } from "@/api/user";
import { getArticles, addFavorite, deleteFavorite } from "@/api/article";
import { mapState } from "vuex";

export default {
  name: "UserProfile",
  middleware: ["authenticated"],
  data() {
    return {
      author: "",
      authorName: "",
      tab: "",
      articles: "",
      articlesCount: 0,
    };
  },
  mounted() {
    this.userMsg()
  },
  computed: {
    ...mapState(["user"]),
    isUser() {
      return this.authorName == this.user.username;
    },
  },
  methods: {
    // 获取用户
    async userMsg(){
      this.authorName = this.$route.params.username;
    if (this.isUser) {
      const { data } = await getUser();
      this.author = data.user;
    } else {
      const { data } = await getProfiles(this.authorName);
      this.author = data.profile;
      this.$set(this.author,'followDisabled',false)
    }
    this.tab = this.$route.query.tab || "myArticles";
    this.getTab(this.tab)
    },
    // 点赞文章
    async onFavorite(article) {
        article.favoriteDisabled = true
        if(article.favorited){
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount += -1
        }else{
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount += 1
        }
        article.favoriteDisabled = false
    },
    // 关注作者
    async onFollow(author) {
        author.followDisabled = true
        if(author.following){
          await unFollowProfiles(author.username)
          author.following = false
        }else{
          await followProfiles(author.username)
          author.following = true
        }
        author.followDisabled = false
    },
    // 获取文章列表
    async getArticlesList(params){
      const { data } = await getArticles(params);
      data.articles.forEach(article => {
        article.favoriteDisabled = false
      });
      this.articles = data.articles;
      this.articlesCount = data.articlesCount;
    },
    // 设置tab，用于区分是否本人
    getTab(tab){
      let params = "";
      if (tab == "myArticles") {
        params = {
          author: this.author.username,
        };
      } else {
        params = {
          favorited: this.author.username,
        };
      }
      this.getArticlesList(params)
    }
  },
  watch: {
     $route(newVal, oldVal) {
       if(newVal.path !== oldVal.path){
          this.userMsg()
       }else{
         this.tab = newVal.query.tab;
         this.getTab(newVal.query.tab)
       }
    },
  },
};
</script>

<style>
</style>