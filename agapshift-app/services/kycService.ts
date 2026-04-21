export const OnfidoService = {
  initializeWorkerVerification: async (userId: string) => {
    console.log('Initializing Onfido for Worker (OTP, ID, Selfie) - ID:', userId);
    // Mock API call to Onfido SDK
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, status: 'VERIFIED' });
      }, 1500);
    });
  },

  initializeBusinessVerification: async (businessId: string) => {
    console.log('Initializing Onfido for Business (DTI/SEC, Permits, TIN) - ID:', businessId);
    // Mock API call to Onfido SDK
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, status: 'VERIFIED' });
      }, 1500);
    });
  }
};
