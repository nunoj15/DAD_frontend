<template>
  <div class="breadCrumb">
    <v-breadcrumbs
      class=""
      :items="breadCrumb"
      divider="-"
    ></v-breadcrumbs>
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

  <v-dialog v-model="dialog" max-width="500px">
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
                v-model="transactionType"
                :items="transactionTypes"
                label="Tipo de Transação"
                required
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model="recipient"
                label="Referência de Pagamento"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model="transactionCategory"
                label="Categoria da Transação"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
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
    v-model:search="search"
    :items="items"
    :headers="customHeaders"
    :loading="loading"
    :items-per-page="itemsPerPage"
    :page.sync="currentPage"
    :total-items="totalItems"
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
import {inject} from 'vue'
import axios from 'axios';
  export default {
    inject:["socket"],
    data () {
      return {
        transactionValue: "",
        transactionType: "debito",
        recipient: "",
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

      let token = localStorage.getItem('token')
      if (axios && axios.defaults) {
        axios.defaults.headers.common.Authorization = 'Bearer ' + token;
      }
      let items = user.user_type === "A" ? await axios.get(`/admin-transactions/${this.currentPage}/${this.itemsPerPage}`) :
      await axios.get(`/owners-transactions?page=${this.currentPage}&itemsPerPage=${this.itemsPerPage}&vcardNumber=${this.user.username}`);
      this.items = items.data.transactions
      this.totalItems = items.data.total

    },
    methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    submitForm() {
      // Aqui você pode lidar com os dados do formulário, por exemplo, enviá-los para um servidor
      console.log("Dados do formulário:", {
        transactionValue: this.transactionValue,
        transactionType: this.transactionType,
        recipient: this.recipient,
        transactionCategory: this.transactionCategory,
        transactionDescription: this.transactionDescription,
      });

    let user = JSON.parse(localStorage.getItem('user'))

    

    this.socket.emit('SendTransactionNotification', {
      from: user.email,
      to:this.recipient,
      value: this.transactionValue
    });

    this.socket.on('ReceivedTransactionNotification', (data) => {
      console.log('Mensagem recebida do servidor:', data);
// Faça algo com a mensagem, como exibir uma notificação
  });

      // Você pode redefinir os campos do formulário após o envio, se necessário
      this.resetForm();
    },
    resetForm() {
      this.transactionValue = "";
      this.transactionType = "debito";
      this.recipient = "";
      this.transactionCategory = "";
      this.transactionDescription = "";
    },
    async loadItems ({ page, itemsPerPage, sortBy }) {

        this.loading = true
        this.currentPage = page
        this.itemsPerPage = itemsPerPage
        let items = this.user.user_type === "A" ? await axios.get(`/admin-transactions/${this.currentPage}/${this.itemsPerPage}`) :
        await axios.get(`/owners-transactions?page=${this.currentPage}&itemsPerPage=${this.itemsPerPage}&vcardNumber=${this.user.username}`);
        this.items = items.data.transactions
        this.totalItems = items.data.total
        this.loading = false
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