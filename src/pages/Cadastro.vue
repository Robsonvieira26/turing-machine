<template>
    <div class="pt-5 px-5">
        <div class="card">
            <div class="card-container">

                <Steps class="block" :model="items" aria-label="Form Steps" />
            </div>
        </div>
    </div>


    <router-view v-slot="{ Component }" :formData="formObject" @prev-page="prevPage($event)"
        @next-page="nextPage($event)" @complete="complete">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view>





</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    label: 'Cliente',
                    to: '/'
                },
                {
                    label: 'Veiculo',
                    to: '/cadastro/veiculo'
                },
                {
                    label: 'Serviço',
                    to: '/cadastro/servico'
                },
                {
                    label: 'Confirmação',
                    to: '/cadastro/confirmacao'
                }
            ],
            formObject: {}
        };
    },
    methods: {
        nextPage(event) {
            for (let field in event.formData) {
                this.formObject[field] = event.formData[field];
            }
            this.$router.push(this.items[event.pageIndex + 1].to);
        },
        prevPage(event) {
            this.$router.push(this.items[event.pageIndex - 1].to);
        },
        complete() {
            this.$toast.add({ severity: 'success', summary: 'Order submitted', detail: 'Dear, ' + this.formObject.firstname + ' ' + this.formObject.lastname + ' your order completed.' });
        }
    },

};
</script>

<style scoped lang="scss">
::v-deep(b) {
    display: block;
}

::v-deep(.p-card-body) {
    padding: 2rem;
}
</style>