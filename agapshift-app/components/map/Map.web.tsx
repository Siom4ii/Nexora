import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

// For Web, we use a simple interactive approach: 
// Clicking the map will jump the pin to that location.
const Map = forwardRef((props: any, ref: any) => {
  const { initialRegion, onLocationSelect } = props;
  const [region, setRegion] = useState(initialRegion);

  useImperativeHandle(ref, () => ({
    animateToRegion: (newRegion: any) => {
      setRegion(newRegion);
    },
  }));

  useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion);
    }
  }, [initialRegion?.latitude, initialRegion?.longitude]);

  // We use an interactive embed that allows much better visualization
  // And we'll rely on the Search Bar for high precision on web
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${region.longitude - 0.005}%2C${region.latitude - 0.005}%2C${region.longitude + 0.005}%2C${region.latitude + 0.005}&layer=mapnik&marker=${region.latitude}%2C${region.longitude}`;

  return (
    <View style={[styles.container, props.style]}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={mapUrl}
        style={{ border: 0 }}
      />
      {/* 
         On Web, since we can't easily drag the iframe-based pin, 
         we suggest users to click the "My Location" button or use the Search Bar
         for 100% accuracy.
      */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default Map;
