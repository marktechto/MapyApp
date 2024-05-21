"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
class Workout {
  date = new Date();
  id = (new Date() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}
class Running extends Workout {
  constructor(coords, distance, duration, Cadence) {
    super(coords, distance, duration);
    this.Cadence = Cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          console.log("could not get current positon");
        }
      );
  }
  _loadMap(position) {
    //  const latitude = position.coords.latitude;
    // console.log(position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    console.log(`https://www.google.com/maps/@${latitude}${longitude}`);
    // console.log(this); in regular function the this key word is undifined
    // so pleased used Bind Method
    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on("click", this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }
  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);
    e.preventDefault();
    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    // check if data is valid
    // if workout is running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert("All inputs must be positive numbers");
      }
    }
    const workout = new Running([lat, lng]);

    // if workout is cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert("All inputs must be positive numbers");
      }
    }
    inputDuration.value =
      inputCadence.value =
      inputDistance.value =
      inputElevation.value =
        "";
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();
  }
}
const app = new App();
