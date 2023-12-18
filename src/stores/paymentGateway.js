import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";
import { createStore } from 'vuex';

const paymentGateway = 'https://dad-202324-payments-api.vercel.app/'
export default createStore({


    state: {
      // O estado do seu paymentGateway, se necessário
    },
    mutations: {
      // Mutations, se necessário
    },
    actions: {
      async debitTransaction({ commit }, {paymentMethod,reference,value}) {
        try {
            const response = await axios.post(`api/debit`,{
                "type": paymentMethod,
                "reference": reference,
                "value": Number(value)
                }, {baseURL:paymentGateway})
            return response
        } catch (error) {
            throw error
        }
      },
      async creditTransaction({ commit }, {paymentMethod,reference,value}) {
        try {
      
            const response = await axios.post(`api/credit`,{
                "type": paymentMethod,
                "reference": reference,
                "value": Number(value)
            }, {baseURL:paymentGateway})
            return response
        } catch (error) {
            throw error
        }
      },
    },
  });