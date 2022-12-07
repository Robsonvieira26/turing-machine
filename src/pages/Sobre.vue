<template>
  <div class="card">
    <h5>Desenvolvedores</h5>
    <div v-for="i in devs" :key="i">
      <div
        class="flex align-items-stretch flex-wrap card-container green-container"
        style="min-height: 100px min-width: 100px "
      >
        <div
          class="align-self-center flex align-items-center justify-content-center font-bold text-white border-round m-2"
          style="min-width: 100px"
        >
          <Avatar icon="pi pi-user" class="mr-2" size="xlarge" shape="circle" />
        </div>
        <div
          class="align-self-center flex align-items-center justify-content-center font-bold text-white border-round m-2"
          style="min-width: 150px "
        >
          {{ i.nome }}
        </div>
        <div
          class="align-self-center flex align-items-center justify-content-center font-bold text-white border-round m-2"
          style="min-width: 100px"
        >
          <a :href="i.githubLink" target="blank" class="text-blue-500"
            >GitHub</a >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "sobre",
  data() {
    return {
      devs: [
        {
          nome: "Daniel Gonçalves",
          github: "DanielGoncalves666",
          githubLink: "https://github.com/DanielGoncalves666",
        },
        {
          nome: "Lucas Mattos Vieira",
          github: "LucasMattosVieira",
          githubLink: "https://github.com/Robsonvieira26",
        },
        {
          nome: "Robson Vieira",
          github: "Robsonvieira26",
          githubLink: "https://github.com/Robsonvieira26",
        },
      ],
    };
  },
};
</script>
