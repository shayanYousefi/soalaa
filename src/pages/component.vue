<template>
  <h5 class="q-ml-lg">نمونه استایل دکمه ها:</h5>
  <div
    class="flex justify-center q-mb-xl q-mt-xl"
  >
    <div
      v-for="item in btnStyle"
      :key="item"
    >
      <q-btn
        v-if="item.class === 'second-type'"
        unelevated
        :color="item.color"
        class="q-mr-xl"
        :class="'btn-' + item.size"
      >
        {{ item.title }}
      </q-btn>
    </div>
  </div>
  <div
    class="flex justify-center"
  >
    <div
      v-for="item in btnStyle"
      :key="item"
      class="flex justify-center"
    >
      <q-btn
        v-if="item.class === 'first-type'"
        unelevated
        :color="item.color"
        class="q-mr-xl"
        :class="'btn-' + item.size"
      >
        {{ item.title }}
      </q-btn>
    </div>
  </div>
  <q-separator style="width: 60%; margin: 50px 20%"
               class="flex justify-center"
               color="primary" />
  <h5 class="q-ml-lg">نمونه استایل دکمه های آیکن دار:</h5>
  <div class="flex justify-center">
    <div
      v-for="item in btnStyle"
      :key="item"
      :class="item.margin"
    >
      <q-btn
        v-if="item.class === 'icon-type'"
        unelevated
        :outline="item.outline"
        :flat="item.flat"
        :color="item.color"
        :icon="'isax:'+item.icon"
      ></q-btn>
    </div>
  </div>
  <q-separator style="width: 60%; margin: 50px 20%"
               class="flex justify-center"
               color="primary" />
  <h5 class="q-ml-lg">نمونه استایل Radio Button:</h5>
  <div class="flex justify-center">
    <div class="radio">
      <q-radio
        v-for="item in radioBtnVals"
        :key="item"
        v-model="person"
        :checked-icon="item.icon"
        :val="item.val" />
    </div>
  </div>
  <q-separator style="width: 60%; margin: 50px 20%"
               class="flex justify-center"
               color="primary" />
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      person: 'neo',
      btnStyle: [
        {
          class: 'first-type',
          size: 'lg',
          color: 'primary',
          title: 'عنوان دکمه'
        },
        {
          class: 'first-type',
          size: 'md',
          color: 'primary',
          title: 'عنوان دکمه'
        },
        {
          class: 'first-type',
          size: 'sm',
          color: 'primary',
          title: 'عنوان دکمه'
        },
        {
          class: 'second-type',
          size: 'lg',
          color: 'secondary',
          title: 'عنوان دکمه'
        },
        {
          class: 'second-type',
          size: 'md',
          color: 'secondary',
          title: 'عنوان دکمه'
        },
        {
          class: 'second-type',
          size: 'sm',
          color: 'secondary',
          title: 'عنوان دکمه'
        },
        {
          class: 'icon-type',
          color: 'primary',
          outline: true,
          icon: 'add',
          margin: 'q-mr-sm'
        },
        {
          class: 'icon-type',
          color: 'primary',
          outline: false,
          icon: 'add',
          margin: 'q-mr-xl'
        },
        {
          class: 'icon-type',
          color: 'primary',
          outline: true,
          icon: 'minus',
          margin: 'q-mr-sm'
        },
        {
          class: 'icon-type',
          color: 'primary',
          outline: false,
          icon: 'minus',
          margin: 'q-mr-xl'
        },
        {
          class: 'icon-type',
          color: 'secondary',
          outline: true,
          icon: 'book-1',
          margin: 'q-mr-sm'
        },
        {
          class: 'icon-type',
          color: 'secondary',
          outline: false,
          icon: 'book-1',
          margin: 'q-mr-sm'
        },
        {
          class: 'icon-type',
          color: 'secondary',
          outline: false,
          flat: true,
          icon: 'book-1',
          margin: 'q-mr-sm'
        }
      ],
      radioBtnVals: [
        {
          icon: 'check',
          val: 'gooneh'
        },
        {
          icon: 'check',
          val: 'neo'
        },
        {
          icon: 'check',
          val: 'zolf'
        }
      ]
    }
  }
}
</script>

<style scoped>
.radio {
  display: flex;
  justify-content: center;
  background: var(--3a-EQ);
  border: 2px solid var(--3a-Primary);
  border-radius: 10px;
  width: 160px;
}
</style>
