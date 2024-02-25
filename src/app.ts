import axios from "axios";
import { GOOGLE_API_KEY } from "../key";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
};

function searchAdressHandler(e: Event) {
    e.preventDefault();
    const enteredAddress = addressInput.value;

    axios
        .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
        .then((res) => {
            if (res.data.status !== "OK") {
                throw new Error("Could not fetch location!");
            }
            const coordinates = res.data.results[0].geometry.location;
            const map = new google.maps.Map(document.getElementById("map")!, {
                center: coordinates,
                zoom: 16,
            });

            new google.maps.Marker({ position: coordinates, map });
        })
        .catch((err) => alert(err.message));
}

form.addEventListener("submit", searchAdressHandler);
