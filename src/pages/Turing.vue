<!-- eslint-disable no-undef -->
<template>
  <!-- {{ machines }} -->
  <h1 class="flex justify-content-center">Maquina De Turing</h1>
  <!-- <br /> -->
  <div class="px-4">
  <div class="card">
    Alfabeto:{{ alfabeto }}<br />
    Estado Inicial:{{ estadoInicial }}<br />
    Estados:{{ estados }}<br />
    Estados Finais:{{ estadosFinais }}<br />
    <b>Estado Atual: {{ estadoAtual }}</b>
    <br />
    <b>{{ word }} - {{ wordIndex }}</b
      ><br />
      <!-- {{ word[wordIndex] }} -->
      <div class="formgroup-inline">
        <div class="field">
          <Button label="Uma transição" icon="pi pi-angle-right" iconPos="right" @click="oneStep"/>
        </div>
        <div class="field">
          <Button label="Transiçoes Automaticas" icon="pi pi-angle-double-right" iconPos="right" @click="allStep"/>
        </div>
        <div class="field">
          <Button label="REINICIAR" icon="pi pi-refresh" iconPos="right" @click="restart"/>
        </div>
      </div>

    
      <Tape :word="word" :wordIndex="wordIndex" :estadoAtual="estadoAtual"/>
    </div>
  </div>
      <!-- <SelectButton v-model="value1" :options="options" aria-labelledby="single" :disabled="true"/> -->
  
  <!-- <i class="pi pi-arrow-up"></i> -->
  <!-- <canvas id="draw"></canvas> -->
  <!-- <v-btn variant="outlined" @click="oneStep">Proximo Passo</v-btn> -->
  <!-- <v-btn variant="outlined" @click="allStep">Avançar Tudo</v-btn> -->
  <!-- <v-btn variant="outlined" @click="restart">Reiniciar</v-btn> -->
</template>

<script>
import TuringService from '../service/TuringService';
import Tape from '../components/Tape';

export default {
  name: 'HomeView',
  components: {
    Tape,
  },
  data() {
    return {
      turingService: null,
      machines: null,
      alfabeto: [],
      estados: [],
      estadoInicial: null,
      estadosFinais: [],
      estadoAtual: null,
      word: '_aabbcc_',
      wordCopy: '',
      wordIndex: 1,
      configKonva: {
        width: 200,
        height: 200,
      },
      value1: null,
      options : [],
    };
  },
  created() {
    this.turingService = new TuringService();
  },
  mounted() {
    this.turingService.getMachines().then((machines) => {
      // eslint-disable-next-line prefer-destructuring
      this.machines = machines[0];
      this.alfabeto = this.machines.alfabeto_entrada;
      this.estados = this.machines.estados;
      this.estadoInicial = this.machines.estado_inicial;
      this.estadosFinais = this.machines.estados_finais;
      this.estadoAtual = this.machines.estado_inicial;
      this.wordCopy = this.word;
    });
    this.drawTape();
  },
  methods: {
    drawTape(){
      this.options = [];
      for (let i = 0; i < this.word.length; i++) {
        this.options.push(this.word[i]);
      }
    },
    restart() {
      this.word = this.wordCopy;
      this.wordIndex = 1;
      this.estadoAtual = this.estadoInicial;
    },

    editWord(pos, letter) {
      const auxAnt = this.word.slice(0, pos);
      const auxPos = this.word.slice(pos + 1);
      this.word = auxAnt + letter + auxPos;
    },
    oneStep() {
      if (this.estadosFinais.indexOf(this.estadoAtual) !== -1) {
        console.log('Saiu');
      } else {
        const letterSearch = this.word[this.wordIndex];
        // eslint-disable-next-line no-unused-vars
        const transicoesEstdAtual = this.machines.transicoes[this.estadoAtual];
        const opTransicao = Object.keys(transicoesEstdAtual);

        const index = opTransicao.indexOf(letterSearch);
        const action = transicoesEstdAtual[opTransicao[index]];
        if (action == null) {
          console.log('Erro');
        }
        this.estadoAtual = action.destino;
        console.log(this.estadoAtual);

        this.editWord(this.wordIndex, action.gravar);
   
        if (action.direcao === 'D') {
          this.wordIndex += 1;
        } else if (this.wordIndex > 0) {
          this.wordIndex -= 1;
        }
      }
      this.drawTape();
    },
    allStep() {
      while (this.estadosFinais.indexOf(this.estadoAtual) === -1) {
        this.oneStep();
        // eslint-disable-next-line no-undef
        // this.wait();
        // console.log('teste');
        // setTimeout(this.fetchHole, 1000);
      }
    },
    wait() {
      // console.log('wait');
      setTimeout(() => {
        this.oneStep();
      }, 500);
    },
  },
};
</script>
