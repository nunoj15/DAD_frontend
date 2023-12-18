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
      <v-banner-text>
        Name:
      </v-banner-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.name" disabled readonly>{{user.name}}</v-text-field>
        </v-col>
      </v-row>

      <v-banner-text>
        Email:
      </v-banner-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.email" disabled readonly>{{user.email}}</v-text-field>
        </v-col>
      </v-row>

      <v-banner-text>
        Username:
      </v-banner-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.name" disabled readonly>{{user.username}}</v-text-field>
        </v-col>
      </v-row>

      <v-banner-text>
        User type:
      </v-banner-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="profile.name" disabled readonly>{{user.user_type}}</v-text-field>
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
        confirmationCode: '',
        user_type:''
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
