import { createStore } from 'vuex';
import io from 'socket.io-client';

const store = createStore({
    state: {
      socket: null,
    },
    mutations: {
      setSocket(state, socket) {
        state.socket = io('http://localhost:3000');
      },
    },
  });
  
  export default store;