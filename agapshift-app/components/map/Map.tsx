import React, { forwardRef } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const Map = forwardRef((props: any, ref: any) => {
  const { onRegionChangeComplete, initialRegion, ...rest } = props;

  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      onRegionChangeComplete={onRegionChangeComplete}
      {...rest}
    />
  );
});

export default Map;
