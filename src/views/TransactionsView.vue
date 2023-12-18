<template>
  <div class="breadCrumb">
    <div>
      <v-btn
          block
          class="mb-8"
          color="green"
          size="small"
          variant="tonal"
          v-bind="props"
          @click="openDialog()"
        >
          New Transaction
        </v-btn>
    </div>
  </div>

  <v-dialog  v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="bg-green" >
      New transaction
    </v-card-title>

      <v-card class="newTransaction">
        <v-form @submit.prevent="submitForm">
          <v-row>
            <v-col>
              <v-text-field
                v-model="transactionValue"
                label="Valor da Transação"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-select
                v-if="transactionTypes.length > 0"
                v-model="transactionType"
                :items="transactionTypes"
                label="Tipo de Transação"
                :reduce="option => option.value"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-select
                v-if="paymentMethods.length > 0"
                v-model="paymentMethod"
                :items="paymentMethods"
                label="Método de pagamento"
                :reduce="option => option.value"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-row v-if="paymentMethod === 'VCARD' && transactionType === 'C'">
            <v-col>
              <v-text-field
                v-model="vcardDebit"
                label="Vcard de débito"
                required
                :rules=[validarVCARD]
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="transactionType === 'C' || (transactionType === 'D' && paymentMethod === 'VCARD')">
            <v-col>
              <v-text-field
                v-model="vcardCredit"
                label="Vcard de crédito"
                required
                :rules=[validarVCARD]
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="transactionType === 'D'">
            <v-col>
              <v-text-field
                v-model="vcardDebit"
                label="Vcard de debito"
                required
                :rules=[validarVCARD]
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="paymentMethod !== 'VCARD'">
            <v-col>
              <v-text-field
                v-model="paymentReference"
                :label= "transactionType === 'C' ? 'Referência de Pagamento' : 'Referência a pagar' "
                :rules=[obterRegrasDeValidacao]
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="user.user_type === 'V'">
            <v-col>
              <v-select
                v-if="categories.length > 0"
                v-model="transactionCategory"
                :items="categories"
                label="Categoria da transacçao"
                :reduce="option => option.value"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-row v-if="user.user_type === 'V'">
            <v-col>
              <v-text-field
                v-model="transactionDescription"
                label="Descrição"
              ></v-text-field>
            </v-col>
          </v-row>

        </v-form>
      </v-card>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="closeDialog">
          Fechar
        </v-btn>
        <v-btn  type="submit" color="green" text @click="submitForm">
          Criar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-video-input-component"></v-icon> &nbsp;
      Transactions

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        label="Search"
        single-line
        flat
        hide-details
        variant="solo-filled"
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>
    <v-data-table 
    v-model:items-per-page="itemsPerPage"
    v-model:search="search"
    :items="items"
    :headers="customHeaders"
    :loading="loading"
    :items-length="totalItems"
    @update:options="loadItems">
      <template v-slot:header.stock>
        <div class="text-end">Stock</div>
      </template>
      <template v-slot:header="{ header }">
      <thead>
        <tr>
          <th
            v-for="col in header"
            :key="col.value"
            :class="{ 'text-left': col.value === 'id' }"
          >
            {{ col.text }}
          </th>
        </tr>
      </thead>
    </template>
    </v-data-table>
  </v-card>

</template>
<script>
import io from 'socket.io-client';
import store from '../socketClient';
import {inject, provide} from 'vue'
import axios from 'axios';


  export default {
    inject:["socket", "toast"],
    data () {
      return {
        vcardDebit: '',
        vcardCredit:'',
        paymentMethods:[
          {value: "VCARD", title: 'Vcard'},
          {value: "MBWAY", title: 'MBWay'},
          {value: "PAYPAL", title: 'PayPal'},
          {value: 'MB', title: 'MB'},
          {value: 'IBAN', title: 'IBAN'},
          {value: 'VISA', title: 'Visa'}
        ],
        transactionValue: "",
        transactionType: "",
        paymentMethod: "",
        transactionTypes: [],
        categories: [],
        paymentReference: "",
        transactionCategory: "",
        transactionDescription: "",
        user: JSON.parse(localStorage.getItem('user')),
        dialog: false,
        search: '',
        items:[],
        loading: true,
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        customHeaders:[
        { title: 'Vcard Number', key: 'vcard', align: 'end' },
        { title: 'Date & time', key: 'datetime', align: 'end' },
        { title: 'Type', key: 'type', align: 'end' },
        { title: 'Value', key: 'value', align: 'end' },
        { title: 'Old balance (%)', key: 'old_balance', align: 'end' },
        { title: 'New Balance', key: 'new_balance', align: 'end' },
        { title: 'Payment Type', key: 'payment_type', align: 'end' },
        { title: 'Payment Reference', key: 'payment_reference', align: 'end' },
      ],
        breadCrumb: [
        {
          title: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard',
        },
        {
          title: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          title: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ],
      }
    },
    async mounted () {
      let user = JSON.parse(localStorage.getItem('user'))

      this.transactionTypes =  user.user_type === "A" ? [
          { value: 'C', title: 'Crédito' },
          { value: 'D', title: 'Débito' },
        ] :  [ 
          { value: 'D', title: 'Débito' },
        ]

      let token = localStorage.getItem('token')
      
      let items = user.user_type === "A" ? await axios.get(`/admin-transactions`,{   
         headers: {
        Authorization: `Bearer ${token}`,
    },}) :
      await axios.get(`/owners-transactions?vcardNumber=${this.user.username}` ,{   
         headers: {
        Authorization: `Bearer ${token}`,
    },});
      this.items = items.data.transactions
      this.totalItems = items.data.total
      this.loading = false

      if(user.user_type === 'V'){
        let response = await axios.get(`/get-all-categories?vcardNumber=${this.user.username}` ,{   
            headers: {
            Authorization: `Bearer ${token}`,
         },});

         let categories = response.data.categories.map(apiCategory => {
            return {
                value: apiCategory.id,
                title: apiCategory.name,
                // Adicione mais mapeamentos conforme necessário
            };
        });
         this.categories = categories
      }

    },
    methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async submitForm() {
      // Aqui você pode lidar com os dados do formulário, por exemplo, enviá-los para um servidor
      console.log("Dados do formulário:", {
        transactionValue: this.transactionValue,
        transactionType: this.transactionType,
        paymentMethod: this.paymentMethod,
        recipient: this.paymentReference,
        transactionCategory: this.transactionCategory,
        transactionDescription: this.transactionDescription,
      });

      if(this.transactionType === 'C'){
        if(this.paymentMethod === 'VCARD'){
          let token = localStorage.getItem('token')
          let vcardCredit = this.vcardCredit
          let transactionType = this.transactionType
          let reference = this.vcardDebit
          let value = this.transactionValue
          let paymentMethod = this.paymentMethod
                let body = {
                  vcard: vcardCredit,
                  type: transactionType,
                  value: value,
                  paymentType: paymentMethod,
                  paymentReference: reference
                }
          let response = axios.post(`/create-transaction` , body,{   
                    headers: {
                    Authorization: `Bearer ${token}`,
                },}).then(res => {
                  if(res.status === 403){
                    this.toast.error(res.data.message);
                  }
                  this.socket.emit('SendTransactionNotification', {
                    from: reference ,
                    to: vcardCredit,
                    value: value
                  });
                  this.toast.success("Transaction made with success");

                  this.resetForm();
              },
              err => {
                if(err?.response.status === 403){
                    this.toast.error(err?.response.data.message);
                  }
              })
        }else{
          let vcardCredit = this.vcardCredit
          let transactionType = this.transactionType
          let reference = this.paymentReference
          let value = this.transactionValue
          let paymentMethod = this.paymentMethod
          let response = this.$store.dispatch('debitTransaction', {paymentMethod,reference,value})
            .then( response => {
                if(response.status === 201){
                let token = localStorage.getItem('token')
                let body = {
                  vcard: vcardCredit,
                  type: transactionType,
                  value: value,
                  paymentType: paymentMethod,
                  paymentReference: reference
                }
                let response = axios.post(`/create-transaction` , body,{   
                    headers: {
                    Authorization: `Bearer ${token}`,
                },}).then(res => {
                  if(res.status === 403){
                    this.toast.error(res.data.message);
                  }
                  this.socket.emit('SendTransactionNotification', {
                    from: reference ,
                    to: vcardCredit,
                    value: value
                  });
                  this.toast.success("Transaction made with success");
                  this.resetForm();
                })
              }
            });
        }
      }else {
        if(this.paymentMethod === 'VCARD'){
          let token = localStorage.getItem('token')
          let vcardDebit = this.vcardDebit
          let transactionType = this.transactionType
          let reference = this.vcardDebit
          let value = this.transactionValue
          let paymentMethod = this.paymentMethod
          let transactionCategory = this.transactionCategory
          let transactionDescription = this.transactionDescription
                let body = {
                  vcard: vcardDebit,
                  type: transactionType,
                  value: value,
                  paymentType: paymentMethod,
                  paymentReference: reference,
                  category: transactionCategory,
                  description: transactionDescription
                }
          let response = axios.post(`/create-transaction` , body,{   
                    headers: {
                    Authorization: `Bearer ${token}`,
                },}).then(res => {
                  if(res.status === 403){
                    this.toast.error(res.data.message);
                  }
                  this.socket.emit('SendTransactionNotification', {
                    from: reference ,
                    to: vcardCredit,
                    value: value
                  });
                  this.toast.success("Transaction made with success");

                  this.resetForm();
              })
        }else{
          let vcardDebit = this.vcardDebit
          let transactionType = this.transactionType
          let reference = this.paymentReference
          let value = this.transactionValue
          let paymentMethod = this.paymentMethod
          let transactionCategory = this.transactionCategory
          let transactionDescription = this.transactionDescription
          let response = this.$store.dispatch('creditTransaction', {paymentMethod,reference,value})
            .then( response => {
                if(response.status === 201){
                let token = localStorage.getItem('token')
                let body = {
                  vcard: vcardDebit,
                  type: transactionType,
                  value: value,
                  paymentType: paymentMethod,
                  paymentReference: reference,
                  category: transactionCategory,
                  description: transactionDescription
                }
                let response = axios.post(`/create-transaction` , body,{   
                    headers: {
                    Authorization: `Bearer ${token}`,
                },}).then(res => {
                  if(res.status === 403){
                    this.toast.error(res.data.message);
                  }
                  this.socket.emit('UpdateBalanceEvent', {
                    to: vcardDebit,
                  });
                  this.toast.success("Transaction made with success");
                  this.resetForm();
                })
              }
            });
        }
      }

    this.socket.on('ReceivedTransactionNotification', (data) => {
      console.log('Mensagem recebida do servidor:', data);
// Faça algo com a mensagem, como exibir uma notificação
  });

    },
    resetForm() {
      this.vcardCredit = ''
      this.transactionValue = "";
      this.transactionType = "";
      this.paymentMethod = '';
      this.paymentReference = "";
      this.transactionCategory = "";
      this.transactionDescription = "";
    },
    async loadItems ({ page, itemsPerPage, sortBy }) {

        this.loading = true
        this.currentPage = page
        this.itemsPerPage = itemsPerPage
        let token = localStorage.getItem('token')
        let items = this.user.user_type === "A" ? await axios.get(`/admin-transactions`,{   
         headers: {
        Authorization: `Bearer ${token}`,
    },}) :
        await axios.get(`/owners-transactions?vcardNumber=${this.user.username}`,{   
         headers: {
        Authorization: `Bearer ${token}`,
    },});
        this.items = items.data.transactions
        this.totalItems = items.data.total
        this.loading = false
      },
      validarIBAN(valor) {
      const regexIBAN = /^[A-Z]{2}\d{23}$/;
      return regexIBAN.test(valor) || 'Formato de IBAN inválido';
    },
    validarVCARD(valor) {
      const regexVCARD = /^[9]\d{8}$/;
      return regexVCARD.test(valor) || 'Formato de VCARD inválido';
    },
    validarMBWAY(valor) {
      const regexMBWAY = /^[9]\d{8}$/;
      return regexMBWAY.test(valor) || 'Formato de MBWAY inválido';
    },
    validarPAYPAL(valor) {
      const regexPAYPAL = /^\S+@\S+\.\S+$/;
      return regexPAYPAL.test(valor) || 'Formato de Email inválido';
    },
    validarMB(valor) {
      const regexMB = /^\d{5}-\d{9}$/;
      return regexMB.test(valor) || 'Formato de Referencia Multibanco inválido';
    },
    validarVISA(valor) {
      const regexVISA = /^4\d{15}$/;
      return regexVISA.test(valor) || 'Formato de número VISA inválido';
    },
    obterRegrasDeValidacao(valor) {
      switch(this.paymentMethod){
        case 'IBAN': 
          return this.validarIBAN(valor)
        case 'MB': 
        return this.validarMB(valor)
        case 'PAYPAL': 
          return this.validarPAYPAL(valor)
        case 'MBWAY': 
          return this.validarMBWAY(valor)
        case 'VISA': 
          return this.validarVISA(valor)
        case 'VCARD': 
          return this.validarVCARD(valor)
        default: []
      } 
    },
  }

  }
</script>


<style lang="scss" scoped>
.breadCrumb{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  div{
    max-width: 250px;
  }
  button{
    max-width: 250px;
  }
}

.newTransaction{
    form{
    display: flex;
    flex-direction: column;
  }
}
</style>