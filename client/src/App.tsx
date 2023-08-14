// Import necessary modules and styles
import { useState, useEffect } from 'react';
import Sensor from './Sensor'; // Importing a component to display as a sensor item
import './App.css'; // Import the styles for this component
// @ts-ignore
import wifiOff from '/wifi-off.svg'

// Define the URL for the WebSocket server
const WEBSOCKET_URL = 'ws://localhost:5000';

// Define the structure of the sensor data using TypeScript interfaces
export interface SensorModal {
    id: string; // An identifier for each sensor
    name: string; // The name of the sensor
    connected: boolean; // Whether the sensor is currently connected
    unit: string; // The unit of measurement for the sensor data
    value: string; // The value reported by the sensor
}

// Define the properties that the Sensor component will receive
export interface SensorProps {
    sensor: SensorModal; // The sensor data
    onToggleConnection: (sensor: { id: string; connected: boolean }) => void; // Function to handle sensor connection toggles
}

// Define the main App component
function App() {
    // State management for showing connected sensors only
    const [showConnectedOnly, setShowConnectedOnly] = useState(false); // State to determine whether to show connected sensors only

    // State management for sensor data and WebSocket connection
    const [sensors, setSensors] = useState(new Map()); // State to store sensor data in a map
    const [socket, setSocket] = useState<WebSocket | null>(null); // State to store the WebSocket connection

    // Set up WebSocket connection and handle incoming sensor data
    useEffect(() => {
        const newSocket: WebSocket = new WebSocket(WEBSOCKET_URL); // Create a new WebSocket connection
        setSocket(newSocket); // Store the connection in the state

        newSocket.onmessage = (event: MessageEvent) => {
            const sensorData = JSON.parse(event.data); // Parse the incoming data as JSON
            updateSensorData(sensorData); // Call a function to update sensor data with the new information
        };

        // Clean up the WebSocket connection when the component is unmounted
        return () => newSocket.close();
    }, []);

    // Update sensor data in response to new information
    const updateSensorData = (data: SensorModal) => {
        setSensors(prevSensors => new Map(prevSensors).set(data.id, { ...prevSensors.get(data.id), ...data }));
    };

    // Toggle the connection status of a sensor
    const toggleSensorConnection = ({ id, connected }: SensorModal) => {
        const command = connected ? 'disconnect' : 'connect'; // Determine whether to connect or disconnect
        const message = { command, id }; // Prepare a message to send to the server

        // Send the message if the connection is open
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }

        // Update the local sensor data after sending the message
        const updatedSensor = { ...sensors.get(id), connected: !connected };
        setSensors(prevSensors => new Map(prevSensors).set(id, updatedSensor));
    };

    // Toggle the option to show only connected sensors
    const toggleShowConnected = () => {
        setShowConnectedOnly(!showConnectedOnly);
    };

    // Determine the list of sensors to display based on the filter option
    const connectedSensors = new Set(Array.from(sensors.values()).filter(sensor => sensor.connected).map(sensor => sensor.id));
    const filteredSensors = Array.from(sensors.values()).filter(sensor => !showConnectedOnly || connectedSensors.has(sensor.id));

    // Render the component
    return (
        <div className='container'>
            <header>
                <h1>IOT Sensors Dashboard</h1>

                <input
                    id='showConnectedOnly'
                    type='checkbox'
                    checked={showConnectedOnly}
                    onChange={toggleShowConnected}
                />
                <label htmlFor='showConnectedOnly'>
                    <img src={wifiOff} className='status' alt='Show Connected Only' />
                </label>
            </header>
            <div className='sensors-container'>
                {filteredSensors.map(sensor => (
                    <Sensor
                        key={sensor.id}
                        sensor={sensor}
                        onToggleConnection={toggleSensorConnection}
                    />
                ))}
            </div>
        </div>
    );
}

export default App; // Export the App component as the default export
