<template>
  <div
    v-if="windowSize.x < 600"
    class="bottom-nav"
  >
    <q-btn
      unelevated
      class="btn-style"
      :to="{ name: 'User.Dashboard'}"
    >
      <svg width="24"
           height="24"
           viewBox="0 0 24 24"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1596 11.62C12.1296 11.62 12.1096 11.62 12.0796 11.62C12.0296 11.61 11.9596 11.61 11.8996 11.62C8.99957 11.53 6.80957 9.25 6.80957 6.44C6.80957 3.58 9.13957 1.25 11.9996 1.25C14.8596 1.25 17.1896 3.58 17.1896 6.44C17.1796 9.25 14.9796 11.53 12.1896 11.62C12.1796 11.62 12.1696 11.62 12.1596 11.62ZM11.9996 2.75C9.96957 2.75 8.30957 4.41 8.30957 6.44C8.30957 8.44 9.86957 10.05 11.8596 10.12C11.9096 10.11 12.0496 10.11 12.1796 10.12C14.1396 10.03 15.6796 8.42 15.6896 6.44C15.6896 4.41 14.0296 2.75 11.9996 2.75Z"
              fill="#8A8CA6" />
        <path d="M12.1696 22.55C10.2096 22.55 8.23961 22.05 6.74961 21.05C5.35961 20.13 4.59961 18.87 4.59961 17.5C4.59961 16.13 5.35961 14.86 6.74961 13.93C9.74961 11.94 14.6096 11.94 17.5896 13.93C18.9696 14.85 19.7396 16.11 19.7396 17.48C19.7396 18.85 18.9796 20.12 17.5896 21.05C16.0896 22.05 14.1296 22.55 12.1696 22.55ZM7.57961 15.19C6.61961 15.83 6.09961 16.65 6.09961 17.51C6.09961 18.36 6.62961 19.18 7.57961 19.81C10.0696 21.48 14.2696 21.48 16.7596 19.81C17.7196 19.17 18.2396 18.35 18.2396 17.49C18.2396 16.64 17.7096 15.82 16.7596 15.19C14.2696 13.53 10.0696 13.53 7.57961 15.19Z"
              fill="#8A8CA6" />
      </svg>
    </q-btn>
    <q-btn
      unelevated
      class="btn-style"
      :to="{ name: 'cart'}"
    >
      <svg width="24"
           height="24"
           viewBox="0 0 24 24"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M16.4899 22.75H7.49993C5.77993 22.75 4.48994 22.29 3.68994 21.38C2.88994 20.47 2.57993 19.15 2.78993 17.44L3.68994 9.94C3.94994 7.73 4.50994 5.75 8.40994 5.75H15.6099C19.4999 5.75 20.0599 7.73 20.3299 9.94L21.2299 17.44C21.4299 19.15 21.1299 20.48 20.3299 21.38C19.4999 22.29 18.2199 22.75 16.4899 22.75ZM8.39993 7.25C5.51993 7.25 5.37993 8.38999 5.16993 10.11L4.26994 17.61C4.11994 18.88 4.29993 19.81 4.80993 20.38C5.31993 20.95 6.21993 21.24 7.49993 21.24H16.4899C17.7699 21.24 18.6699 20.95 19.1799 20.38C19.6899 19.81 19.8699 18.88 19.7199 17.61L18.8199 10.11C18.6099 8.37999 18.4799 7.25 15.5899 7.25H8.39993Z"
              fill="#8A8CA6" />
        <path d="M16 8.75C15.59 8.75 15.25 8.41 15.25 8V4.5C15.25 3.42 14.58 2.75 13.5 2.75H10.5C9.42 2.75 8.75 3.42 8.75 4.5V8C8.75 8.41 8.41 8.75 8 8.75C7.59 8.75 7.25 8.41 7.25 8V4.5C7.25 2.59 8.59 1.25 10.5 1.25H13.5C15.41 1.25 16.75 2.59 16.75 4.5V8C16.75 8.41 16.41 8.75 16 8.75Z"
              fill="#8A8CA6" />
        <path d="M20.41 17.78H8C7.59 17.78 7.25 17.44 7.25 17.03C7.25 16.62 7.59 16.28 8 16.28H20.41C20.82 16.28 21.16 16.62 21.16 17.03C21.16 17.44 20.82 17.78 20.41 17.78Z"
              fill="#8A8CA6" />
      </svg>
    </q-btn>
    <q-btn
      unelevated
      class="btn-style"
      :to="{ name: 'User.Create.Exam'}"
    ><svg width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
            fill="#8A8CA6" />
      <path d="M10.5 16.75C8.71 16.75 7.25 15.29 7.25 13.5C7.25 10.05 10.05 7.25 13.5 7.25C15.29 7.25 16.75 8.71 16.75 10.5C16.75 13.95 13.95 16.75 10.5 16.75ZM13.5 8.75C10.88 8.75 8.75 10.88 8.75 13.5C8.75 14.46 9.54 15.25 10.5 15.25C13.12 15.25 15.25 13.12 15.25 10.5C15.25 9.54 14.46 8.75 13.5 8.75Z"
            fill="#8A8CA6" />
    </svg>
    </q-btn>
    <q-btn
      unelevated
      class="btn-style home"
    >
      <svg width="24"
           height="24"
           viewBox="0 0 24 24"
           fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M20.0402 6.81994L14.2802 2.78994C12.7102 1.68994 10.3002 1.74994 8.79023 2.91994L3.78023 6.82994C2.78023 7.60994 1.99023 9.20994 1.99023 10.4699V17.3699C1.99023 19.9199 4.06023 21.9999 6.61023 21.9999H17.3902C19.9402 21.9999 22.0102 19.9299 22.0102 17.3799V10.5999C22.0102 9.24994 21.1402 7.58994 20.0402 6.81994ZM12.7502 17.9999C12.7502 18.4099 12.4102 18.7499 12.0002 18.7499C11.5902 18.7499 11.2502 18.4099 11.2502 17.9999V14.9999C11.2502 14.5899 11.5902 14.2499 12.0002 14.2499C12.4102 14.2499 12.7502 14.5899 12.7502 14.9999V17.9999Z"
              fill="#9690E4" />
      </svg>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'BottomNavigation',
  computed: {
    windowSize() {
      return this.$store.getters['AppLayout/windowSize']
    }
  }
}
</script>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  height: 72px;
  background: #FFFFFF;
  box-shadow: 0px -6px 10px rgba(112, 108, 161, 0.07) #{"/* rtl:ignore */"};
  border-radius: 16px 16px 0px 0px #{"/* rtl:ignore */"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 42px;
  padding-left: 42px;
  bottom: 0;
  width: 100%;
  .btn-style {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    &.home {
      background: #F4F3FF;

    }
  }
}
</style>
