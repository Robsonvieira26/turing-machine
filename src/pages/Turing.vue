<!-- eslint-disable no-undef -->
<template>
  <!-- {{ machine }} -->
  <Toast />
  <h1 class="flex justify-content-center">Maquina De Turing</h1>
  <!-- <br /> -->
  <div class="px-4">
    <div class="card">
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
          <div class="field">
            <Button
              label="Transiçoes Automaticas"
              icon="pi pi-angle-double-right"
              iconPos="right"
              @click="allStep"
            />
          </div>
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
  <div v-show="subimited == true" class="px-4">
  <div claas="card">
    <h1 class="flex justify-content-center">Informações</h1>
    <Accordion>
      <AccordionTab header="Transições Realizadas">
        <!-- {{transicoesRealizadas}} -->
        <div v-for="i in transicoesRealizadas" :key="i">
          {{i}}
        </div>
      </AccordionTab>
      <AccordionTab header="Informações Maquina">
        <div>
          Alfabeto: <b>{{ alfabeto }}</b><br />
          Estado Inicial: <b>{{ estadoInicial }}</b><br />
          Estados: <b>{{ estados }}</b><br />
          Estados Finais: <b>{{ estadosFinais }}</b><br />
          Símbolo Branco: <b>{{ branco }}</b><br />
          <br />
        </div>
      </AccordionTab>
    </Accordion>
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
      transicoesRealizadas:[],
      alfabeto: [],
      estados: [],
      estadoInicial: "",
      estadosFinais: [],
      estadoAtual: "",
      branco: "",
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
        { name: "Teste Prof 2", value: 2},
        { name: "Teste Prof 3", value: 3},
        { name: "a^n b^m a^(n+m)", value: 4},
        { name: "Monus", value: 5},
      ],
      maquinaCalculo: false,
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

    mtPara() {
      this.$toast.add({
        severity: "info",
        summary: "Parou",
        detail: "A maquina terminou o processamento da cadeia",
        life: 3000,
      });
    },

    drawTape() {
      this.componentKey += 1;
      // console.log(this.componentKey);
      this.wordTape = this.wordCopy;
      // this.sleep(2000);
    },

    selectMachine(index) {
      this.wordIndex = 1;
      this.machine = this.machines[index];
      this.alfabeto = this.machine.alfabeto_entrada;
      this.estados = this.machine.estados;
      this.estadoInicial = this.machine.estado_inicial;
      this.estadosFinais = this.machine.estados_finais;
      this.estadoAtual = this.machine.estado_inicial;
      this.branco = this.machine.simbolo_branco;
      this.wordCopy = this.branco + this.word + this.branco + this.branco;
      if (this.machine.estadosFinais.length == 0) {
        this.maquinaCalculo = true;
      }
    },

    subimitWord() {
      if (this.word.length == 0) { // palavra não inserida
        this.$toast.add({
          severity: "info",
          summary: "Atenção",
          detail: "Digite uma palavra",
          life: 3000,
        });
        return;
      } else {
        if (this.maquinaSelecionada == null) { // máquina não selecionada
          this.$toast.add({
            severity: "info",
            summary: "Atenção",
            detail: "Escolha uma Maquina de Turing",
            life: 3000,
          });
          return;
        } else { // máquina selecionada e palavra inserida
          this.wordTape = this.wordCopy;
          this.subimited = true;
          this.selectMachine(this.maquinaSelecionada.value);
          this.transicoesRealizadas = [];
          this.drawTape();
        }
      }

      // console.log("Subimited");
      // console.log(this.machine.transicoes);
      // this.drawTape();
    },

    restart() {
      this.wordCopy = this.branco + this.word + this.branco + this.branco;
      this.wordIndex = 1;
      this.estadoAtual = this.estadoInicial;
      this.subimited = false;
      this.transicoesRealizadas = [];
      this.drawTape();
    },

    editWord(pos, letter) {
      const auxAnt = this.wordCopy.slice(0, pos);
      const auxPos = this.wordCopy.slice(pos + 1);
      this.wordCopy = auxAnt + letter + auxPos;
    },

    oneStep() {
      if (this.estadosFinais.indexOf(this.estadoAtual) !== -1) {
        this.mtAceita();
        return 1;
      } else {
        const letterSearch = this.wordCopy[this.wordIndex];

        const transicoesEstdAtual = this.machine.transicoes[this.estadoAtual];
        const opTransicao = Object.keys(transicoesEstdAtual);

        const index = opTransicao.indexOf(letterSearch);
        const action = transicoesEstdAtual[opTransicao[index]];
        
        if (action == null) {
          if (this.maquinaCalculo) {
            this.mtPara();
            return 1;
          } else {
            this.mtRejeita();
            return -1;
          }
        }

        //Add Transição
        this.salvaTransicao(letterSearch,action)

        this.editWord(this.wordIndex, action.gravar);

        if (action.direcao === "D") {
          this.wordIndex += 1;
        } else if (this.wordIndex > 0) {
          this.wordIndex -= 1;
        }
      }
      this.drawTape();

      return 0;
    },

    salvaTransicao(letterSearch,action){
        const estadoSaida = this.estadoAtual;
        const simboloEntrada = letterSearch;
        //Segunda parte da transição
        const estadoDestino = action.destino;
        const direcao = action.direcao;
        const simboloSaida = action.gravar;

        const transicao = "δ("+estadoSaida+","+simboloEntrada+") = ("+estadoDestino+","+simboloSaida+","+direcao+")";
        this.transicoesRealizadas.push(transicao);
        this.estadoAtual = action.destino;
        // console.log(transicao);
    },

    async allStep() {
      while(this.estadosFinais.indexOf(this.estadoAtual) === -1) {
        let retorno = this.oneStep();
        if( retorno === -1 ||  retorno === 1)
              return;

       await this.sleep(500);        
      }

      this.oneStep(); // força a mensagem de Aceite da palavra
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
};
</script>
