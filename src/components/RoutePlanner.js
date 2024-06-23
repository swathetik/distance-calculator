import React, { useState } from "react";
import MapboxMap from "./MapboxMap";
import AutocompleteInput from "./AutocompleteInput";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 40%;
  box-sizing: border-box;
  position: relative; /* For positioning the Add stop button */
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  position: relative; /* For positioning the Add stop button */
`;

const CalculateButton = styled.button`
  margin: -10px 0 10px 0; /* Adjust the margin values as needed */
  padding: 15px 30px;
  background-color: #1b31a8;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  width: 160px;
  font-size: 18px;
  align-self: flex-end;
`;

const AddStopButton = styled.button`
  position: relative;
  bottom: 0;
  right: 0;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: transparent;
  color: Black;
  border: none;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
`;

const ResultBox = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ResultLine = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  font-style: "Open-sans", sans-serif;
  font-weight: lighter;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  .bold {
    font-weight: bold;
  }
`;

const DistanceText = styled.div`
  font-size: 24px;
  font-weight: bold;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
`;

const DistanceWord = styled.span`
  color: black;
`;

const CalculatedDistance = styled.span`
  color: #0079ff;
`;
const MapboxMapContainer = styled.div`
  position: inherit;
  flex: 0; /* Fill remaining space */
`;

const RoutePlanner = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [distance, setDistance] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [stops, setStops] = useState([]);

  const handleAddStop = () => {
    setStops([...stops, null]);
  };

  const handleSelectStop = (index, place) => {
    const newStops = [...stops];
    newStops[index] = place;
    setStops(newStops);
    updateRoute(origin, destination, newStops);
  };

  const handleDeleteStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
    updateRoute(origin, destination, newStops);
  };

  const updateRoute = (origin, destination, stops) => {
    if (!origin || !destination) return;

    const points = [
      origin.geometry.coordinates,
      ...stops.filter((stop) => stop).map((stop) => stop.geometry.coordinates),
      destination.geometry.coordinates,
    ];

    setWaypoints(points);
  };

  const handleRoute = () => {
    updateRoute(origin, destination, stops);
  };

  return (
    <Container>
      <FormContainer>
        <InputGroup>
          <h6 style={{ alignSelf: "flex-start", marginTop: "1px" }}>Origin</h6>
          <AutocompleteInput
            placeholder="Origin"
            onSelect={(place) => setOrigin(place)}
          />
          {stops.map((_, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <AutocompleteInput
                placeholder={`Stop ${index + 1}`}
                onSelect={(place) => handleSelectStop(index, place)}
              />
              <DeleteButton onClick={() => handleDeleteStop(index)}>
                Delete
              </DeleteButton>
            </div>
          ))}
          <AddStopButton onClick={handleAddStop}>Add stop</AddStopButton>
        </InputGroup>
        <h6 style={{ alignSelf: "flex-start", marginTop: "10px" }}>
          Destination
        </h6>
        <AutocompleteInput
          placeholder="Destination"
          onSelect={(place) => setDestination(place)}
        />
        <CalculateButton onClick={handleRoute}>Calculate</CalculateButton>
        {distance !== null && (
          <ResultBox>
            <DistanceText>
              <DistanceWord>Distance:</DistanceWord>
              <CalculatedDistance>{distance} kms</CalculatedDistance>
            </DistanceText>
          </ResultBox>
        )}
        {distance !== null && (
          <ResultLine>
            The distance between{" "}
            <span className="bold">{origin?.place_name}</span> and{" "}
            <span className="bold">{destination?.place_name}</span>{" "}
            {stops.length > 0 && (
              <>
                by the{" "}
                {stops.map((stop, index) => (
                  <span key={index} className="bold">
                    {stop?.place_name}
                    {index < stops.length - 1 && ", "}
                  </span>
                ))}{" "}
                stop
              </>
            )}{" "}
            is {distance} kms.
          </ResultLine>
        )}
      </FormContainer>
      <MapboxMapContainer>
        <MapboxMap waypoints={waypoints} onDistance={setDistance} />
      </MapboxMapContainer>
    </Container>
  );
};

export default RoutePlanner;
