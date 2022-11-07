<template>
  <div class="pt-5 px-5 pb-5">
    <Card>
      <!-- <template v-slot:title> Personal Information </template> -->
      <!-- <template v-slot:subtitle> Enter your personal information </template> -->
      <template v-slot:content>
        <div class="p-fluid">
          <div class="formgrid grid">
            <div class="field col">
              <label for="vehicleAge">Ano do Veiculo</label>
              <InputNumber id="vehicleAge" type="text" v-model="vehicleAge" :useGrouping="false" :min="1950" :max="2033"
                :class="{ 'p-invalid': validationErrors.vehicleAge && submitted }" />
              <small v-show="validationErrors.vehicleAge && submitted" class="p-error">É preciso informar o Ano do
                Veiculo</small>
            </div>
            <div class="field col">
              <label for="model">Modelo do cabeçote</label>
              <Textarea id="model" rows="1" v-model="model"
                :class="{ 'p-invalid': validationErrors.model && submitted }" />
              <small v-show="validationErrors.model && submitted" class="p-error">É preciso informar o Modelo do
                Cabeçote</small>
            </div>
          </div>
          <!-- Sintomas -->
          <div class="field">
            <label for="symptoms">Sintomas do Veiculo</label>

            <Dropdown v-model="symptomsSelected" :options="symptoms" optionLabel="name" class="p-mb-2"
              :class="{ 'p-invalid': validationErrors.symptomsSelected && submitted }" />
            <small v-show="validationErrors.symptomsSelected && submitted" class="p-error">É preciso informar o
              Sintoma</small>

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
      vehicleAge: "",
      model: '',
      symptomsSelected: {},
      submitted: false,
      validationErrors: {},
      symptoms: [
        { name: 'Aquecimento', value: 'Aquecimento' },
        { name: 'Ruído', value: 'Ruído' },
        { name: 'Perda de potência', value: 'Perda de potência' },
        { name: 'Luz de óleo acesa', value: 'Luz de óleo acesa' },
        { name: 'Misturou fluidos (água e óleo)', value: 'Misturou fluidos (água e óleo)' },
        { name: 'Rompimento de correia', value: 'Rompimento de correia' },
        { name: 'Calço hidráulico', value: 'Calço hidráulico' },
        { name: 'Outros', value: 'outros' }


        //  luz de óleo acesa, misturou de fluido(água e óleo), 
        // rompimento de correia, calço hidráulico
      ]

    };
  },
  methods: {
    nextPage() {
      this.submitted = true;
      if (this.validateForm()) {
        this.$emit('next-page', { formData: { vehicleAge: this.vehicleAge, model: this.model, symptomsSelected: this.symptomsSelected.value }, pageIndex: 1 });
      }
    },
    prevPage() {
      this.$emit('prev-page', { pageIndex: 1 });
    },
    validateForm() {
      if (!this.vehicleAge != '') this.validationErrors['vehicleAge'] = true;
      else delete this.validationErrors['vehicleAge'];

      if (!this.model.trim()) this.validationErrors['model'] = true;
      else delete this.validationErrors['model'];

      if (!this.symptomsSelected.value != '') {
        this.validationErrors['symptomsSelected'] = true;
        // console.log('teste')
      }
      else { delete this.validationErrors['symptomsSelected']; }

      return !Object.keys(this.validationErrors).length;
    }
  }
};
</script>
  