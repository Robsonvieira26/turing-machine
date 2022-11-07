export default class TuringService {
  // eslint-disable-next-line class-methods-use-this
  getMachines() {
    return fetch('data/Turing.json')
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
