<template>
  <div class="pt-5 px-5 pb-5">
    <Card>
      <!-- <template v-slot:title> Personal Information </template> -->
      <!-- <template v-slot:subtitle> Enter your personal information </template> -->
      <template v-slot:content>
        <div class="p-fluid">
          <div class="formgrid grid">
            <div class="field col">
              <label for="service">Informe qual serviço você precisa?</label>
              <Textarea id="service" rows="2" v-model="service"
                :class="{ 'p-invalid': validationErrors.service && submitted }" />
              <small v-show="validationErrors.service && submitted" class="p-error">É preciso informar o
                serviço solicitado</small>
            </div>
          </div>
        </div>

      </template>
      <template v-slot:footer>
        <div class="grid grid-nogutter justify-content-between">
          <Button label="Anterior" @click="prevPage()" icon="pi pi-angle-left" />
          <Button label="Proxima" @click="nextPage()" icon="pi pi-angle-right" iconPos="right" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  emits: ['next-page', 'prev-page'],
  data() {
    return {
      service: '',
      submitted: false,
      validationErrors: {},
    };
  },
  methods: {
    nextPage() {
      this.submitted = true;

      if (this.validateForm()) {
        this.$emit('next-page', { formData: { service: this.service }, pageIndex: 2 });
      }
    },
    prevPage() {
      this.$emit('prev-page', { pageIndex: 1 });
    },
    validateForm() {

      if (!this.service.trim()) this.validationErrors['service'] = true;
      else delete this.validationErrors['service'];



      return !Object.keys(this.validationErrors).length;
    }
  }
};
</script>
  