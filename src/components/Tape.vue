<template>
<div class="card border-solid surface-border border-50 border-2 border-round">
  <div class="formgrid grid px-2">
    <div v-for="i in wordLength" :key="i" class="field col">
      <div class="field grid">
        <div class="border-solid surface-border border-50 border-2 border-round"> 
          <div class="col-2">
            {{wordLength==10 ? '_': word[i-1]}}
          </div>
        </div>
    </div>
    <div class="field grid">
        <div class="col-2">
          <div class="grid" v-show="i-1 == wordIndex">
          <div class="col-12 pl-2">
            <i class="pi pi-arrow-up"></i>
          </div>
          <div class="col-12 border-orange-500 surface-overlay border-1 border-round font-bold m-2 flex align-items-center justify-content-center" > 
              {{estadoAtual}}
          </div>
          </div>
        </div>
    </div>
    </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'Tape',
  props: {
    word: {
      type: String,
      default: '_',
      // required: true,
    },
    wordIndex: {
      type: Number,
      default: 1,
      // required: true,
    },
    estadoAtual: {
      type: String,
      default: 'q0',
      // required: true,
    },
    wordLength: {
      type: Number,
      default: 10,
      required: true,
    },
  },
  
}
</script>