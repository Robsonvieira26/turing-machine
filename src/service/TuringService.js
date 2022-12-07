export default class TuringService {

  getMachines() {
    return fetch('data/Turing.json')
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getMachinesDuplo() {
    return fetch('data/TuringDuplo.json')
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
