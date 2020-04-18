<template>
  <div>
    <!--<img alt="Vue logo" src="../assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <Chat></Chat>
  </div>
</template>

<script>
// @ is an alias to /src
import Chat from '@/components/Chat.vue'

export default {
  name: 'Home',
  components: {
    Chat
  }
}
</script>
