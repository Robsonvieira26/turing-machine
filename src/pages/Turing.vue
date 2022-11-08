<!-- eslint-disable no-undef -->
<template>
  <!-- {{ machine }} -->
  <Toast />
  <h1 class="flex justify-content-center">Maquina De Turing</h1>
  <!-- <br /> -->
  <div class="px-4">
    <div class="card">
      <!-- Alfabeto:{{ alfabeto }}<br />
    Estado Inicial:{{ estadoInicial }}<br />
    Estados:{{ estados }}<br />
    Estados Finais:{{ estadosFinais }}<br />
    <b>Estado Atual: {{ estadoAtual }}</b>
    <br />
    <b>{{ word }} - {{ wordIndex }}</b
      ><br /> -->
      <!-- {{ word[wordIndex] }} -->

      <div class="formgroup-inline">
        <div class="field">
          <Dropdown
            v-model="maquinaSelecionada"
            :options="maquinas"
            optionLabel="name"
            placeholder="Selecione a maquina"
          />
        </div>
        <div class="field">
          <InputText v-model="word" placeholder="Digite a palavra" />
        </div>
        <div class="field">
          <Button label="Iniciar maquina" @click="subimitWord" />
        </div>
      </div>
      <div v-show="subimited == true">
        <div class="formgroup-inline">
          <div class="field">
            <Button
              label="Uma transição"
              icon="pi pi-angle-right"
              iconPos="right"
              @click="oneStep"
            />
          </div>
          <!-- <div class="field">
            <Button
              label="Transiçoes Automaticas"
              icon="pi pi-angle-double-right"
              iconPos="right"
              @click="allStep"
            />
          </div> -->
          <div class="field">
            <Button
              label="Reiniciar"
              icon="pi pi-refresh"
              iconPos="right"
              @click="restart"
            />
          </div>
        </div>
      </div>
      <!-- {{componentKey}} -->
      <Tape
        :word="wordTape"
        :wordIndex="wordIndex"
        :estadoAtual="estadoAtual"
        :wordLength="wordTape.length"
        :key="componentKey"
      />
    </div>
  </div>
</template>

<script>
import TuringService from "../service/TuringService";
import Tape from "../components/Tape";

export default {
  name: "HomeView",
  components: {
    Tape,
  },
  data() {
    return {
      componentKey: 0,

      //
      turingService: null,
      machines: null,
      machine: null,
      //Dados MT
      alfabeto: [],
      estados: [],
      estadoInicial: "",
      estadosFinais: [],
      estadoAtual: "",
      word: "",
      //Controle
      wordTemp: "",
      wordTape: "",
      wordCopy: "",
      wordIndex: 0,
      value1: null,
      subimited: false,
      maquinaSelecionada: null,
      maquinas: [
        { name: "aⁿbⁿcⁿ", value: 0 },
        { name: "Teste Prof 1", value: 1 },
      ],
    };
  },
  created() {
    this.turingService = new TuringService();
  },

  mounted() {
    this.turingService.getMachines().then((machines) => {
      this.machines = machines;
    });
  },
  methods: {
    mtAceita() {
      this.$toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "A cadeia foi aceita pela maquina",
        life: 3000,
      });
    },
    mtRejeita() {
      this.$toast.add({
        severity: "error",
        summary: "Erro",
        detail: "A cadeia foi rejeitada pela maquina",
        life: 3000,
      });
    },

    drawTape() {
      this.componentKey += 1;
      console.log(this.componentKey);
      this.wordTape = this.word;
      // this.sleep(2000);
    },
    forceRender() {
      console.log("forceRender");
      this.showTape = false;
      this.sleep(1000);
      this.showTape = true;
      // this.componentKey += 1;
    },

    selectMachine(index) {
      this.wordIndex = 0;
      if (index == 0) {
        this.wordIndex = 1;
      }
      this.machine = this.machines[index];
      this.alfabeto = this.machines[index].alfabeto_entrada;
      this.estados = this.machines[index].estados;
      this.estadoInicial = this.machines[index].estado_inicial;
      this.estadosFinais = this.machines[index].estados_finais;
      this.estadoAtual = this.machines[index].estado_inicial;
      this.wordCopy = this.word;
    },
    subimitWord() {
      if (this.word.length == 0) {
        this.$toast.add({
          severity: "info",
          summary: "Atenção",
          detail: "Digite uma palavra",
          life: 3000,
        });
        return;
      } else {
        if (this.maquinaSelecionada == null) {
          this.$toast.add({
            severity: "info",
            summary: "Atenção",
            detail: "Escolha uma Maquina de Turing",
            life: 3000,
          });
          return;
        } else {
          this.wordTape = this.word;
          this.subimited = true;
          this.selectMachine(this.maquinaSelecionada.value);
          this.drawTape();
        }
      }

      // console.log("Subimited");
      // console.log(this.machine.transicoes);
      // this.drawTape();
    },
    restart() {
      this.word = this.wordCopy;
      this.wordIndex = 1;
      this.estadoAtual = this.estadoInicial;
      this.drawTape();
    },

    editWord(pos, letter) {
      const auxAnt = this.word.slice(0, pos);
      const auxPos = this.word.slice(pos + 1);
      this.word = auxAnt + letter + auxPos;
    },

    oneStep() {
      if (this.estadosFinais.indexOf(this.estadoAtual) !== -1) {
        this.mtAceita();
        return;
      } else {
        const letterSearch = this.word[this.wordIndex];

        const transicoesEstdAtual = this.machine.transicoes[this.estadoAtual];
        const opTransicao = Object.keys(transicoesEstdAtual);

        const index = opTransicao.indexOf(letterSearch);
        const action = transicoesEstdAtual[opTransicao[index]];
        if (action == null) {
          this.mtRejeita();
          return;
        }
        this.estadoAtual = action.destino;
        console.log(this.estadoAtual);

        this.editWord(this.wordIndex, action.gravar);

        if (action.direcao === "D") {
          this.wordIndex += 1;
        } else if (this.wordIndex > 0) {
          this.wordIndex -= 1;
        }
      }
      this.drawTape();
    },
    async allStep() {
      // while (this.estadosFinais.indexOf(this.estadoAtual) === -1) {
      this.oneStep();
      this.forceRender();

      this.oneStep();
      this.forceRender();
      this.oneStep();
      this.forceRender();
      // this.oneStep();
      // this.sleep(2000);
      // }
    },
    sleep(milliseconds) {
      console.log("sleep");
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    },
  },
};
</script>
