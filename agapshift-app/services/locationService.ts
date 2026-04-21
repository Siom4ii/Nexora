export const LocationService = {
  requestPermissions: async () => {
    // Mock permission request
    return true;
  },

  getCurrentLocation: async () => {
    // Mock coordinates for Manila
    return { latitude: 14.5995, longitude: 120.9842 };
  },

  getNearbyJobs: async (radiusKm: number) => {
    // Mock data for distance-based filtering
    return [
      { id: '1', title: 'Barista (Morning Shift)', distance: 1.2, lat: 14.6000, lng: 120.9850, rate: '₱500/shift' },
      { id: '2', title: 'Warehouse Helper', distance: 2.5, lat: 14.6100, lng: 120.9900, rate: '₱600/shift' },
    ];
  },

  getNearbyWorkers: async (radiusKm: number) => {
    return [
      { id: '1', name: 'Juan Dela Cruz', distance: 0.5, rating: 4.8, skill: 'Barista' },
      { id: '2', name: 'Maria Santos', distance: 1.1, rating: 4.9, skill: 'Helper' },
    ];
  }
};
