<template>
  <Toast />
  <div class="px-4">
    <div class="card">
      <div class="formgroup-inline">
        <div class="field">
          <Dropdown
            v-model="maquinaSelecionada"
            @change="showInfo(maquinaSelecionada.value)"
            :options="maquinas"
            optionLabel="name"
            placeholder="Selecione a maquina"
            :disabled="disabledDropdown"
          />
        </div>
        <div class="field">
          <InputText v-model="word" placeholder="Digite a palavra" />
        </div>
        <div class="field">
          <Button label="Iniciar maquina" @click="submitWord" />
        </div>
      </div>
      <div v-show="submitted == true">
        <div class="formgroup-inline">
          <div class="field">
            <Button
              label="Uma transição"
              icon="pi pi-angle-right"
              iconPos="right"
              @click="oneStep"
              :disabled="disabled"
            />
          </div>
          <div class="field">
            <Button
              label="Transiçoes Automaticas"
              icon="pi pi-angle-double-right"
              iconPos="right"
              @click="allStep"
              :disabled="disabled"
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
      <Tape
        v-show="submitted == true && maquinaSelecionada != null"
        :word="wordTape[0]"
        :wordIndex="wordIndex[0]"
        :estadoAtual="estadoAtual"
        :wordLength="wordTape[0].length"
      />
      <Tape
        v-show="submitted == true && maquinaSelecionada != null"
        :word="wordTape[1]"
        :wordIndex="wordIndex[1]"
        :estadoAtual="estadoAtual"
        :wordLength="wordTape[1].length"
      />
    </div>
  </div>
  <div v-show="submitted == true || maquinaSelecionada != null" class="px-4">
    <h1 class="flex justify-content-center">Informações</h1>
    <div class="card">
      <TabView>
        <TabPanel header="Informações Maquina">
          <div>
            Alfabeto: <b>{{ alfabeto }}</b
            ><br />
            Estado Inicial: <b>{{ estadoInicial }}</b
            ><br />
            Estados: <b>{{ estados }}</b
            ><br />
            Estados Finais: <b>{{ estadosFinais }}</b
            ><br />
            Símbolo Branco: <b>{{ branco }}</b
            ><br />
            <br />
          </div>
        </TabPanel>
        <TabPanel header="Transições Realizadas">
          <div v-if="transicoesRealizadas == 0">Sem Transiçoes Realizadas</div>
          <div v-for="i in transicoesRealizadas" :key="i">
            {{ i }}
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script>
import TuringService from "../service/TuringService";
import Tape from "../components/Tape";

export default {
  name: "Duas Fitas",
  components: {
    Tape,
  },
  data() {
    return {
      disabled: false,
      disabledDropdown: false,
      //
      turingService: null,
      machines: null,
      machine: null,
      //Dados MT
      transicoesRealizadas: [],
      alfabeto: [],
      estados: [],
      estadoInicial: "",
      estadosFinais: [],
      estadoAtual: "",
      branco: "",
      word: "",
      //Controle
      wordTape: ["", ""],
      wordCopy: ["", ""],
      wordIndex: [0, 0],
      submitted: false,
      maquinaSelecionada: null,
      maquinas: [],
      maquinaCalculo: false,
    };
  },
  created() {
    this.turingService = new TuringService();
  },

  mounted() {
    this.turingService.getMachinesDuplo().then((machines) => {
      this.machines = machines;
      for (let mt in this.machines) {
        let line = {
          name: this.machines[mt].nome,
          value: mt,
        };
        this.maquinas.push(line);
      }
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
      this.disabled = true;
    },

    mtRejeita() {
      this.$toast.add({
        severity: "error",
        summary: "Erro",
        detail: "A cadeia foi rejeitada pela maquina",
        life: 3000,
      });
      this.disabled = true;
    },

    mtPara() {
      this.$toast.add({
        severity: "info",
        summary: "Parou",
        detail: "A maquina terminou o processamento da cadeia",
        life: 3000,
      });
      this.disabled = true;
    },
    warning() {
      this.$toast.add({
        severity: "erro",
        summary: "Erro",
        detail: "Algo deu errado!",
        life: 3000,
      });
      this.disabled = true;
    },

    drawTape() {
      this.wordTape[0] = this.wordCopy[0];
      this.wordTape[1] = this.wordCopy[1];
    },

    reiniciaFitas() {
      this.wordCopy[0] = this.branco + this.word;
      for (let i = 0; i <= 5; i++) {
        this.wordCopy[0] = this.wordCopy[0] + this.branco;
      }
      this.wordCopy[1] = this.branco;
      for (let i = 0; i < this.wordCopy[0].length - 1; i++) {
        this.wordCopy[1] = this.wordCopy[1] + this.branco;
      }
    },
    selectMachine(index) {
      this.showInfo(index);
      this.reiniciaFitas();
      if (this.machine.estadosFinais === []) {
        this.maquinaCalculo = true;
        console.log("maquina de calculo");
      }
    },
    showInfo(index) {
      this.machine = this.machines[index];
      this.wordIndex[0] = this.machine.posicao_inicial[0];
      this.wordIndex[1] = this.machine.posicao_inicial[1];
      this.alfabeto = this.machine.alfabeto_entrada;
      this.estados = this.machine.estados;
      this.estadoInicial = this.machine.estado_inicial;
      this.estadosFinais = this.machine.estados_finais;
      this.estadoAtual = this.machine.estado_inicial;
      this.branco = this.machine.simbolo_branco;
    },

    submitWord() {
      this.disabled = false;
      this.disabledDropdown = true;
      if (this.maquinaSelecionada == null) {
        // máquina não selecionada
        this.$toast.add({
          severity: "info",
          summary: "Atenção",
          detail: "Escolha uma Maquina de Turing",
          life: 3000,
        });
        return;
      } else {
        // máquina selecionada e palavra inserida
        this.wordTape[0] = this.wordCopy[0];
        this.wordTape[1] = this.wordCopy[1];
        this.submitted = true;
        this.selectMachine(this.maquinaSelecionada.value);
        this.transicoesRealizadas = [];
        this.drawTape();
      }
    },

    restart() {
      this.disabledDropdown = false;
      this.reiniciaFitas();
      this.estadoAtual = this.estadoInicial;
      this.submitted = false;
      this.transicoesRealizadas = [];
      this.disabled = false;
      this.maquinaCalculo = false;
      this.drawTape();
    },

    editWord(pos, letter, wordFlag) {
      if (wordFlag != 0 && wordFlag != 1) {
        this.warning();
      }
      const auxAnt = this.wordCopy[wordFlag].slice(0, pos);
      const auxPos = this.wordCopy[wordFlag].slice(pos + 1);
      this.wordCopy[wordFlag] = auxAnt + letter + auxPos;
    },

    oneStep() {
      if (this.estadosFinais.indexOf(this.estadoAtual) !== -1) {
        this.mtAceita();
        return 1;
      } else {
        // eslint-disable-next-line no-unused-vars
        const letterSearch =
          this.wordCopy[0][this.wordIndex[0]] +
          this.wordCopy[1][this.wordIndex[1]];
        // console.log("Leitura: " + letterSearch);
        const transicoesValidas = Object.keys(this.machine.transicoes);

        if (transicoesValidas.indexOf(this.estadoAtual) == -1) {
          if (this.maquinaCalculo) {
            this.mtPara();
            return 1;
          } else {
            this.mtRejeita();
            return -1;
          }
        }
        const transicoesEstdAtual = this.machine.transicoes[this.estadoAtual];
        const opTransicao = Object.keys(transicoesEstdAtual);
        // console.log(opTransicao);
        const index = opTransicao.indexOf(letterSearch);
        // console.log(index);
        const action = transicoesEstdAtual[opTransicao[index]];
        // console.log(action);

        if (action == null) {
          if (this.maquinaCalculo) {
            console.log("maquina de calculo Parou");
            this.mtPara();
            return 1;
          } else {
            this.mtRejeita();
            return -1;
          }
        }

        // Add Transição
        this.salvaTransicao(letterSearch, action);

        this.editWord(this.wordIndex[0], action["f1"].gravar, 0);
        this.editWord(this.wordIndex[1], action["f2"].gravar, 1);

        //Movimentação Fita 1
        if (action["f1"].direcao === "D") {
          this.wordIndex[0] += 1;
        } else if (action["f1"].direcao === "E" && this.wordIndex[0] > 0) {
          this.wordIndex[0] -= 1;
        } else if (action["f1"].direcao === "P") {
          // eslint-disable-next-line no-self-assign
          this.wordIndex[0] = this.wordIndex[0];
        }

        //Movimentação Fita 2
        if (action["f2"].direcao === "D") {
          this.wordIndex[1] += 1;
        } else if (action["f2"].direcao === "E" && this.wordIndex[1] > 0) {
          this.wordIndex[1] -= 1;
        } else if (action["f2"].direcao === "P") {
          // eslint-disable-next-line no-self-assign
          this.wordIndex[1] = this.wordIndex[1];
        }
      }
      this.drawTape();

      // return 0;
    },

    salvaTransicao(letterSearch, action) {
      const estadoSaida = this.estadoAtual;
      const simboloEntrada = [letterSearch[0], letterSearch[1]];
      //Segunda parte da transição
      const estadoDestino = action.destino;
      const direcao = [action["f1"].direcao, action["f2"].direcao];
      const simboloSaida = [action["f1"].gravar, action["f2"].gravar];

      const transicao =
        "δ(" +
        estadoSaida +
        "," +
        simboloEntrada[0] +
        "," +
        simboloEntrada[1] +
        ") = (" +
        estadoDestino +
        "," +
        simboloSaida[0] +
        "," +
        direcao[0] +
        "," +
        simboloSaida[1] +
        "," +
        direcao[1] +
        ")";
      this.transicoesRealizadas.push(transicao);
      this.estadoAtual = action.destino;
    },

    async allStep() {
      this.disabled = true;
      let tempo1 = performance.now();
      while (this.estadosFinais.indexOf(this.estadoAtual) === -1) {
        let retorno = this.oneStep();
        if (retorno === -1 || retorno === 1) return;

        // await this.sleep(500);
      }

      this.oneStep(); // força a mensagem de Aceite da palavra
      let tempo2 = performance.now();
      console.log(`Tempo execução: ${tempo2 - tempo1} ms`);
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>
