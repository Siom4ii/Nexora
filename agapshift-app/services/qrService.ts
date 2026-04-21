export const QRService = {
  generateOfflineSignedQR: async (workerId: string, jobId: string, action: 'CLOCK_IN' | 'CLOCK_OUT') => {
    console.log(`Generating offline QR for ${action}`);
    // Mocking a securely signed JWT payload that can be verified offline by the business
    const payload = JSON.stringify({
      workerId,
      jobId,
      action,
      timestamp: Date.now(),
      signature: 'mock_secure_hash_signature'
    });
    return `agapshift_qr:${btoa(payload)}`;
  },

  verifyScannedQR: async (qrData: string, expectedJobId: string) => {
    console.log('Verifying scanned QR code');
    if (!qrData.startsWith('agapshift_qr:')) return false;
    
    try {
      const payloadString = atob(qrData.split(':')[1]);
      const data = JSON.parse(payloadString);
      // Mock signature verification
      return data.jobId === expectedJobId && data.signature === 'mock_secure_hash_signature';
    } catch (e) {
      return false;
    }
  }
};
