<template>
  <v-container>
    <v-form>
      <div class="breadCrumb">
        <v-breadcrumbs
            class=""
            :items="breadCrumb"
            divider="-"
        >

        </v-breadcrumbs>
      </div>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.name" disabled readonly>{{user.name}}</v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.email" disabled readonly>{{user.email}}</v-text-field>
        </v-col>
      </v-row>


    </v-form>
  </v-container>
</template>

<script>
export default {
  computed:{
     user(){
        return JSON.parse(localStorage.getItem('user'));
     }
  } ,
  data() {
    return {
      profile: {
        name: '',
        email: '',
        photo: '',
        confirmationCode: ''
      },
      breadCrumb: [
        {
          title: 'Account Details',
          disabled: true,
          href: 'profile',
        },
        {
          title: 'Change Password',
          disabled: false,
          href: 'changePassword',
        },
        {
          title: 'Change Profile Details',
          disabled: false,
          href: 'changeDetails',
        },
      ],
    };
  },
  methods: {
    saveProfile() {
      // Implemente a lógica para salvar o perfil (pode ser uma chamada API)
      console.log('Perfil salvo:', this.profile);
    },
  },
};
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
</style>
