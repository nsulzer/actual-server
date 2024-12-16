import CommerzbankCobadeff from '../commerzbank_cobadeff.js';

describe('CommerzbankCobadeff', () => {
  describe('#normalizeTransaction', () => {
    it('correctly extracts the payee and when not provided', () => {
      const transaction = {
        endToEndId: 'Euros-streep-c118-b0-t89',
        mandateId: 'Euros-streep-u1312',
        bookingDate: '2024-09-24',
        valueDate: '2024-09-24',
        transactionAmount: {
          amount: '-7.95',
          currency: 'EUR',
        },
        creditorName: 'Stichting Sevende Camer',
        remittanceInformationUnstructured:
          'Stichting Sevende Camer\\nSB incasso augustus 2024\\nEnd-to-End-Ref.:\\nEuros-streep-c118-b0-t89\\nMandatsref: Euros-streep-u1312\\nGläubiger-ID: NL11',
        remittanceInformationUnstructuredArray: [
          'Stichting Sevende Camer',
          'SB incasso augustus 2024',
          'End-to-End-Ref.: ',
          'Euros-streep-c118-b0-t89',
          'Mandatsref: Euros-streep-u1312',
          'Gläubiger-ID: NL11',
          'ZZZ080847240001',
          'SEPA-BASISLASTSCHRIFT wiederholend',
        ],
        remittanceInformationStructured:
          'Stichting Sevende Camer SB incasso augustus 2024 End-to-End-Ref.: Euros-streep-c118-b0-t89 Mandatsref: Euros-streep-u1312 Gläubiger-ID: NL11',
        internalTransactionId: '310abca4a1644830ef78c75fbd3946fa',
        payeeName: 'Stichting Sevende Camer',
        date: '2024-09-24',
      };

      const normalizedTransaction = CommerzbankCobadeff.normalizeTransaction(
        transaction,
        false,
      );

      expect(normalizedTransaction.remittanceInformationUnstructured).toEqual(
        'SB incasso augustus 2024 Gläubiger-ID: NL11',
      );
      expect(normalizedTransaction.payeeName).toEqual('My Payee Name');
    });
    it('correctly extracts the payee and when not provided', () => {
      const transaction = {
        endToEndId: '1037461720231',
        mandateId: '5DHJ224S7MKGE',
        bookingDate: '2024-10-11',
        valueDate: '2024-10-11',
        transactionAmount: {
          amount: '-10.99',
          currency: 'EUR',
        },
        creditorName: 'PayPal Europe S.a.r.l. et Cie S.C.A',
        remittanceInformationUnstructured:
          'Google Payment Irel and Limited, uw aankoop bij Google Payment Ireland Limited End-to-En',
        remittanceInformationUnstructuredArray: [
          'PayPal Europe S.a.r.l. et Cie S.C.A',
          '1037461720231/. Google Payment Irel',
          'and Limited, uw aankoop bij Google',
          'Payment Ireland Limited',
          'End-to-En',
          'd-Ref.: 1037461720231',
          'Mandatsref: 5DHJ224S7MKGE',
          'Gläubiger-ID:',
          'LU96ZZZ0000000000000000058',
          'SEPA-BASISLASTSCHRIFT wiederholend',
        ],
        remittanceInformationStructured:
          'PayPal Europe S.a.r.l. et Cie S.C.A 1037461720231/. Google Payment Irel and Limited, uw aankoop bij Google Payment Ireland Limited End-to-En',
        internalTransactionId: 'dac76f751cde2abdf37766d527b776b7',
        payeeName: 'Paypal Europe S.A.R.L. Et Cie S.C.A',
        date: '2024-10-11',
      };

      const normalizedTransaction = CommerzbankCobadeff.normalizeTransaction(
        transaction,
        false,
      );

      expect(normalizedTransaction.remittanceInformationUnstructured).toEqual(
        'SB incasso augustus 2024 Gläubiger-ID: NL11',
      );
      expect(normalizedTransaction.payeeName).toEqual('My Payee Name');
    });
    it('correctly extracts the payee and when not provided', () => {
      const transaction = {
        endToEndId: 'NOTPROVIDED',
        bookingDate: '2024-10-02',
        valueDate: '2024-10-02',
        transactionAmount: {
          amount: '-5',
          currency: 'EUR',
        },
        creditorName: 'Y. WOTTE',
        creditorAccount: {
          iban: 'DE64280698780007762300',
        },
        remittanceInformationUnstructured: 'GENODEF1KBL  SPOTIFY VON NIELS',
        remittanceInformationUnstructuredArray: [
          'Y. WOTTE',
          'GENODEF1KBL',
          'DE64280698780007762300',
          'SPOTIFY VON NIELS',
          'End-to-End-Ref.: NOTPROVIDED',
          'Dauerauftrag',
        ],
        remittanceInformationStructured:
          'Y. WOTTE GENODEF1KBL DE64280698780007762300 SPOTIFY VON NIELS End-to-End-Ref.: NOTPROVIDED Dauerauftrag',
        internalTransactionId: '9114ba5e514cfb68ec79690bca58e281',
        payeeName: 'Y. Wotte (DE64 XXX 2300)',
        date: '2024-10-02',
      };

      const normalizedTransaction = CommerzbankCobadeff.normalizeTransaction(
        transaction,
        false,
      );

      expect(normalizedTransaction.remittanceInformationUnstructured).toEqual(
        'SB incasso augustus 2024 Gläubiger-ID: NL11',
      );
      expect(normalizedTransaction.payeeName).toEqual('My Payee Name');
    });
  });
});
