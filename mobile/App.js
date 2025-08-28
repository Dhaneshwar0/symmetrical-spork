import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import io from 'socket.io-client';

// IMPORTANT: Replace with your server's IP address.
// If running on an emulator, this is typically your computer's local IP.
// If running on a physical device, make sure it's on the same Wi-Fi network.
const SERVER_URL = 'http://YOUR_LOCAL_IP:3000';

export default function App() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [driverLocation, setDriverLocation] = useState(null);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const socket = io(SERVER_URL);

    socket.on('connect', () => {
      setStatus('Connected to server!');
      console.log('Connected with socket ID:', socket.id);

      // Simulate a driver sending location updates
      setInterval(() => {
        // In a real app, you would get this from the device's GPS
        const newLocation = {
          driverId: 'driver123',
          lat: region.latitude + (Math.random() - 0.5) * 0.01,
          lng: region.longitude + (Math.random() - 0.5) * 0.01,
        };
        socket.emit('driver:location', newLocation);
      }, 5000);
    });

    socket.on('driver:location:update', (data) => {
      console.log('Received driver location update:', data);
      setDriverLocation({ latitude: data.lat, longitude: data.lng });
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected from server.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver"
            description="Driver's current location"
          />
        )}
      </MapView>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 50,
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
  },
});
