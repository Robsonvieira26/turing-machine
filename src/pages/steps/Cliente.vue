<template>
  <div class="pt-5 px-5 pb-5">
    <Card>
      <!-- <template v-slot:title> Personal Information </template> -->
      <!-- <template v-slot:subtitle> Enter your personal information </template> -->
      <template v-slot:content>
        <div class="p-fluid">
          <div class="formgrid grid">
            <div class="field col">
              <label for="name">Nome do Cliente</label>
              <InputText id="name" type="text" v-model="name"
                :class="{ 'p-invalid': validationErrors.name && submitted }" />
              <small v-show="validationErrors.name && submitted" class="p-error">É preciso informar o nome</small>

            </div>
            <div class="field col">
              <label for="phone">Telefone</label>
              <InputMask class="p-input-mask p-input-text" id="phone" mask="(99) 99999-9999" v-model="phone"
                :class="{ 'p-invalid': validationErrors.phone && submitted }" />
              <small v-show="validationErrors.phone && submitted" class="p-error">É preciso informar o telefone</small>
            </div>
          </div>

          <div class="field col-12">
            <label for="address">Endereço</label>
            <Textarea id="address" rows="2" v-model="address"
              :class="{ 'p-invalid': validationErrors.address && submitted }" />
            <small v-show="validationErrors.address && submitted" class="p-error">É preciso informar o endereço</small>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="grid grid-nogutter justify-content-between">
          <i></i>
          <Button label="Proxima" @click="nextPage()" icon="pi pi-angle-right" iconPos="right" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  emits: ['next-page'],
  data() {
    return {
      name: '',
      phone: '',
      address: '',
      submitted: false,
      validationErrors: {}
    };
  },
  methods: {
    nextPage() {
      this.submitted = true;

      if (this.validateForm()) {
        this.$emit('next-page', { formData: { name: this.name, phone: this.phone, address: this.address }, pageIndex: 0 });
      }
    },
    validateForm() {
      if (!this.name.trim()) this.validationErrors['name'] = true;
      else delete this.validationErrors['name'];

      if (!this.phone.trim()) this.validationErrors['phone'] = true;
      else delete this.validationErrors['phone'];

      if (!this.address.trim()) this.validationErrors['address'] = true;
      else delete this.validationErrors['address'];

      return !Object.keys(this.validationErrors).length;
    }
  }
};
</script>
  