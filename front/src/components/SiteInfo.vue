<template lang="pug">
  div
    h1 Информация о подключенных JS и CSS файлах на сайте {{selectedSite}}
    div
      select(v-model="selectedSite")
       option(v-for="el in sites" :key="el" placeholder="fj") {{el}}
    .list-wrapper
      .list(v-if="returnedFiles.css?.length > 0") Список CSS файлов
        ol(class="rounded")
         li(v-for="el in returnedFiles.css" :key="el")
          p {{el}}
      .list(v-if="returnedFiles.js?.length > 0") Список JS файлов
        ol(class="rounded")
         li(v-for="el in returnedFiles.js" :key="el")
          p {{el}}

</template>

<script>

import Vue from "vue";

export default {
  name: 'SiteInfo',
  data() {
    return {
      sites: [
        'https://learn.javascript.ru/',
        'https://yandex.ru/',
        'https://habr.com/',
        'https://4pda.ru/',
        'https://www.youtube.com/'
      ],
      selectedSite: null,
      returnedFiles: []
    }
  },
  watch: {
    selectedSite(e) {
      this.getInfo(e)
    }
  },
  methods: {
    async getInfo(url) {
      const res = await Vue.axios.post(process.env.VUE_APP_BASE_URL+ 'info', {url})
      this.returnedFiles = res && res.data ? res.data : [];
    }
  }
}
</script>

<style scoped>
select {
  width: 700px;
  height: 30px;
}

.list-wrapper {
  margin-top: 40px;
}

.list {
  width: 70%;
  margin: 0 auto;
  font-size: 25px;
  font-weight: bold;
}

.rounded {
  counter-reset: li;
  list-style: none;
  font: 14px "Trebuchet MS", "Lucida Sans";
  padding: 0;
  text-shadow: 0 1px 0 rgba(255,255,255,.5);
}
.rounded p {
  position: relative;
  display: block;
  padding: .4em .4em .4em 2em;
  margin: .5em 0;
  background: #DAD2CA;
  color: #444;
  text-decoration: none;
  border-radius: .3em;
  transition: .3s ease-out;
  text-align: left;
}
.rounded p:hover {background: #E9E4E0;}
.rounded p:hover:before {transform: rotate(360deg);}
.rounded p:before {
  content: counter(li);
  counter-increment: li;
  position: absolute;
  left: -1.3em;
  top: 50%;
  margin-top: -1.3em;
  background: #8FD4C1;
  height: 2em;
  width: 2em;
  line-height: 2em;
  border: .3em solid white;
  text-align: center;
  font-weight: bold;
  border-radius: 2em;
  transition: all .3s ease-out;
}
</style>
