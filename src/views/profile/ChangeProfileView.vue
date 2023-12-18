<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-form @submit.prevent="changePassword" ref="form" v-model="valid">
          <v-card class="mt-5">
            <v-card-title>
              <h3 class="mb-0">Change Password</h3>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="passwords.current_password"
                      label="Current Password"
                      type="password"
                      required
                  ></v-text-field>
                  <field-error-message :errors="errors" fieldName="current_password"></field-error-message>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="passwords.password"
                      label="New Password"
                      type="password"
                      required
                  ></v-text-field>
                  <field-error-message :errors="errors" fieldName="password"></field-error-message>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="passwords.password_confirmation"
                      label="Password Confirmation"
                      type="password"
                      required
                  ></v-text-field>
                  <field-error-message :errors="errors" fieldName="password_confirmation"></field-error-message>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn type="submit" :disabled="!valid" color="primary" class="px-5">Change Password</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
export default {
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
          disabled: false,
          href: 'profile',
        },
        {
          title: 'Change Password',
          disabled: false,
          href: 'changePassword',
        },
        {
          title: 'Change Profile Details',
          disabled: true,
          href: 'changeDetails',
        },
      ],
    };
  },
  methods: {
    saveProfile() {
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
