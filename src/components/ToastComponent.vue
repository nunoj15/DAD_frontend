<script setup>
const toast = inject('toast');
const socket = inject("socket")
import { ref, onMounted, inject, computed } from 'vue';
defineProps({
  msg: {
    type: String,
    required: true
  }
})

onMounted(() => {
  socket.on('ReceivedTransactionNotification', (data) => {
      console.log('Mensagem recebida do servidor:', data);
      toast.success('User ' + data.from + ' transfered ' + data.value + ' $ to your vCard');
// Faça algo com a mensagem, como exibir uma notificação
  });
});


</script>
<template>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
