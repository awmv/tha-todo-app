<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="6">
            <h1>Sign Up</h1>
            <p class="text-medium-emphasis">
              Enter your details to get started
            </p>

            <VForm @submit.prevent="submit" class="mt-7">
              <div>
                <label class="label text-grey-darken-2" for="name">Name</label>
                <VTextField
                  :rules="[ruleRequired]"
                  v-model="name"
                  prepend-inner-icon="fluent:person-24-regular"
                  id="name"
                  name="name"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email"
                  >Email</label
                >
                <VTextField
                  :rules="[ruleRequired, ruleEmail]"
                  v-model="email"
                  type="email"
                  prepend-inner-icon="fluent:mail-24-regular"
                  id="email"
                  name="email"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password"
                  >Password</label
                >
                <VTextField
                  :rules="[ruleRequired, rulePassLen]"
                  type="password"
                  v-model="password"
                  prepend-inner-icon="fluent:password-20-regular"
                  id="password"
                  name="password"
                />
              </div>
              <div class="mt-5">
                <VBtn
                  type="submit"
                  block
                  min-height="45"
                  class="gradient primary"
                  >Create Account</VBtn
                >
              </div>
            </VForm>
            <p class="text-center text-caption mt-10">
              <span
                >Already have an account?
                <NuxtLink to="/" class="font-weight-bold text-primary"
                  >Sign In</NuxtLink
                ></span
              >
            </p>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
const name = ref("")
const email = ref("")
const password = ref("")

const { ruleEmail, rulePassLen, ruleRequired } = useFormRules()

const submit = async () => {}
</script>
