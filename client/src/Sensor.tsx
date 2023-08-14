// Import React library and the SensorProps interface from the App.tsx file
import React from 'react';
import { SensorProps } from './App.tsx';
import './Sensor.css'; // Import the styles for this component
// @ts-ignore
import wifi from '/wifi.svg'
// @ts-ignore
import wifiOff from '/wifi-off.svg'

// Define a functional component named Sensor that receives sensor data and a function to toggle sensor connection
const Sensor: React.FC<SensorProps> = ({ sensor, onToggleConnection }) => {
    // Define a function to handle the button click to toggle sensor connection
    const handleToggle = (): void => {
        onToggleConnection(sensor); // Call the provided function to toggle sensor connection
    };

    // Render the component
    return (
        <div className={`sensor ${sensor.connected ? 'connected' : 'disconnected'}`}>
            <div className='header'>
                <h2>{sensor.name}</h2>
                <img src={sensor.connected ? wifi : wifiOff} className='status' alt={sensor.connected ? 'connected' : 'disconnected'} />
            </div>
            {sensor.value ? <p>Value: {sensor.value} {sensor.unit}</p> : <p>Not Connected</p>}
            <button onClick={handleToggle}>
                {sensor.connected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    );
};

export default Sensor; // Export the Sensor component as the default export

