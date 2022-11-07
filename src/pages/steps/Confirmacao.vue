<template>
  <div class="pt-5 px-5 pb-5">
    <Card>
      <template v-slot:title> Confirmação </template>
      <template v-slot:content>
        <h5>Indormações pessoais:</h5>
        <div class="grid">
          <div class="col-6">
            <label for="class">Nome: </label>
            <b>{{ formData.name ? formData.name : '-' }}</b>
          </div>
          <div class="col-6">
            <label for="Age">Telefone: </label>
            <b>{{ formData.phone ? formData.phone : '-' }}</b>
          </div>
          <div class="col-12">
            <label for="Age">Endereço: </label>
            <b>{{ formData.address ? formData.address : '-' }}</b>
          </div>
        </div>
        <Divider></Divider>
        <h5>Informações do veículo:</h5>
        <div class="grid">
          <div class="col-6">
            <label for="class">Ano do Veiculo: </label>
            <b>{{ formData.vehicleAge ? formData.vehicleAge : '-' }}</b>
          </div>
          <div class="col-6">
            <label for="class">Modelo do cabeçote: </label>
            <b>{{ formData.model ? formData.model : '-' }}</b>
          </div>
          <div class="col-12">
            <label for="class">Sintomas </label>
            <b>{{ formData.symptomsSelected ? formData.symptomsSelected : '-' }}</b>
          </div>
        </div>
        <Divider></Divider>
        <h5>Informações do serviço:</h5>
        <div class="col-12">
          <label for="class">Serviço Solicitado </label>
          <b>{{ formData.service ? formData.service : '-' }}</b>
        </div>

      </template>
      <template v-slot:footer>
        <div class="grid grid-nogutter justify-content-between">
          <Button label="Voltar" @click="prevPage()" icon="pi pi-angle-left" />
          <Button label="Finalizar" @click="complete()" icon="pi pi-check" iconPos="right" class="p-button-success" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  emits: ['prev-page', 'complete'],
  props: {
    formData: Object
  },
  methods: {
    prevPage() {
      this.$emit('prev-page', { pageIndex: 3 });
    },
    complete() {
      this.$emit('complete');
    }
  }
};
</script>
