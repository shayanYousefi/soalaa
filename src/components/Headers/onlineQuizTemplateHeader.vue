<template>
  <div class="online-quiz-template-header">
    <div class="right-side">
      <q-btn
        class="toolbar-button"
        icon="isax:menu-1"
        color="white"
        text-color="accent"
        dense
        unelevated
        @click="toggleLeftDrawer"
      />
      <q-btn
        v-if="windowSize.x > 969"
        class="toolbar-button"
        icon="mdi-dots-grid"
        color="white"
        text-color="accent"
        dense
        unelevated
        @click="changeView"
      />
    </div>
    <div class="left-side">
      <q-btn-dropdown
        class="toolbar-button"
        content-class="profile-menu"
        icon="isax:user"
        dropdown-icon="false"
        color="white"
        text-color="accent"
        :label="user.full_name "
        dir="ltr"
        dense
        unelevated
      >
        <online-quiz-top-menu />
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script>
import onlineQuizTopMenu from 'components/Menu/topMenu/onlineQuizTopMenu'

export default {
  name: 'onlineQuizTemplateHeader',
  components: { onlineQuizTopMenu },
  data () {
    return {
      user: {}
    }
  },
  methods: {
    changeView () {
      const isPersonalExam = this.$route.name === 'onlineQuiz.alaaView.personal'
      const routeName = isPersonalExam ? 'onlineQuiz.konkoorView.personal' : 'onlineQuiz.konkoorView'
      this.$router.push({
        name: routeName,
        params: {
          quizId: this.$route.params.quizId
        }
      })
    },
    getUser () {
      this.user = this.$store.getters['Auth/user']
      return this.user
    },
    toggleLeftDrawer () {
      const visibility = this.$store.getters['AppLayout/layoutLeftDrawerVisible']
      return this.$store.commit('AppLayout/updateLayoutLeftDrawerVisible', !visibility)
    }
  },
  computed: {
    windowSize () {
      return this.$store.getters['AppLayout/windowSize']
    }
  }
}
</script>

<style lang="scss" scoped>
.online-quiz-template-header{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f1f1f1;
  height: 100px;
  align-items: center;
  padding: 0 50px;
  .right-side {
    .q-btn {
      margin-left: 25px;
    }
  }
  .left-side {
    :deep(.q-btn) {
      &.toolbar-button {
        .q-btn__content {
          .q-btn-dropdown__arrow {
            display: none !important;
          }
        }
      }
    }
  }
}
</style>
