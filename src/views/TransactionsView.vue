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
          color="red"
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
      <v-card-title class="headline">
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
        <v-btn color="blue darken-1" text @click="closeDialog">
          Fechar
        </v-btn>
        <v-btn  type="submit" color="blue darken-1" text @click="submitForm">
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
    <v-data-table v-model:search="search" :items="items">
      <template v-slot:header.stock>
        <div class="text-end">Stock</div>
      </template>

      <template v-slot:item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded>
          <v-img
            :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`"
            height="64"
            cover
          ></v-img>
        </v-card>
      </template>

      <template v-slot:item.rating="{ item }">
        <v-rating
          :model-value="item.rating"
          color="orange-darken-2"
          density="compact"
          size="small"
          readonly
        ></v-rating>
      </template>

      <template v-slot:item.stock="{ item }">
        <div class="text-end">
          <v-chip
            :color="item.stock ? 'green' : 'red'"
            :text="item.stock ? 'In stock' : 'Out of stock'"
            class="text-uppercase"
            label
            size="small"
          ></v-chip>
        </div>
      </template>
    </v-data-table>
  </v-card>

</template>
<script>
import io from 'socket.io-client';
import store from '../socketClient';
import {inject} from 'vue'

  export default {
    inject:["socket"],
    data () {
      return {
        transactionValue: "",
        transactionType: "debito",
        recipient: "",
        transactionCategory: "",
        transactionDescription: "",
        dialog: false,
        search: '',
        items: [
          {
            name: 'Nebula GTX 3080',
            image: '1.png',
            price: 699.99,
            rating: 5,
            stock: true,
          },
          {
            name: 'Galaxy RTX 3080',
            image: '2.png',
            price: 799.99,
            rating: 4,
            stock: false,
          },
          {
            name: 'Orion RX 6800 XT',
            image: '3.png',
            price: 649.99,
            rating: 3,
            stock: true,
          },
          {
            name: 'Vortex RTX 3090',
            image: '4.png',
            price: 1499.99,
            rating: 4,
            stock: true,
          },
          {
            name: 'Cosmos GTX 1660 Super',
            image: '5.png',
            price: 299.99,
            rating: 4,
            stock: false,
          },
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

    let userEmail = localStorage.getItem('user')

    

    this.socket.emit('SendTransactionNotification', {
      from: userEmail,
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