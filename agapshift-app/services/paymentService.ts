export const PaymentService = {
  depositEscrow: async (businessId: string, jobId: string, amount: number, method: 'GCASH' | 'MAYA' | 'CARD') => {
    console.log(`Holding ₱${amount} in escrow via ${method} for job ${jobId}`);
    return { success: true, transactionId: 'txn_' + Date.now() };
  },

  releasePayment: async (jobId: string, workerId: string, grossAmount: number) => {
    const commissionRate = 0.10; // 10% platform fee
    const netAmount = grossAmount * (1 - commissionRate);
    
    console.log(`Releasing funds. Gross: ₱${grossAmount}, Commission: ₱${grossAmount * commissionRate}, Net to Worker: ₱${netAmount}`);
    return { success: true, netAmount, payoutId: 'pay_' + Date.now() };
  },

  raiseDispute: async (jobId: string, reason: string) => {
    console.log(`Dispute raised for job ${jobId}. Escrow frozen. Reason: ${reason}`);
    return { success: true, status: 'FROZEN' };
  }
};
