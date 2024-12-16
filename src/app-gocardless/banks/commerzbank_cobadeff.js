import Fallback from './integration-bank.js';
import { amountToInteger, printIban } from '../utils.js';
import { formatPayeeName } from '../../util/payee-name.js';

/** @type {import('./bank.interface.js').IBank} */
export default {
  ...Fallback,

  institutionIds: ['COMMERZBANK_COBADEFF'],

  accessValidForDays: 179,

  normalizeAccount(account) {
    return {
      account_id: account.id,
      institution: account.institution,
      mask: account.iban.slice(-4),
      iban: account.iban,
      name: [account.name, printIban(account)].join(' '),
      official_name: account.product,
      type: 'checking',
    };
  },

  normalizeTransaction(transaction, _booked) {
    const payee = transaction.creditorName || transaction.debtorName || '';
    const endToEndRef = transaction.endToEndId || '';
    const iban = transaction.creditorAccount.iban;

    // console.debug('\n\nPayee is ', payee);
    // console.debug(
    //   '\ntransaction.remittanceInformationUnstructured is ',
    //   transaction.remittanceInformationUnstructured,
    // );

    const keywordsToRemove = [
      payee,
      endToEndRef,
      iban,
      '\\\\n',
      'Mandatsref:(| )\\S+',
      'Gläubiger-ID:(| )\\S+',
      'End-to-End-Ref.:',
      'NOTPROVIDED',
    ];
    const regex = new RegExp(keywordsToRemove.join('|'), 'g');
    console.debug(regex);
    transaction.remittanceInformationUnstructured =
      transaction.remittanceInformationUnstructured.replace(regex, '').trim();

    // transaction.remittanceInformationUnstructured =
    //   transaction.remittanceInformationUnstructured
    //     .replaceAll('\\n', '')
    //     .replaceAll(payee, '')
    //     .trim();
    // console.debug(
    //   '\ntransaction.remittanceInformationUnstructured is ',
    //   transaction.remittanceInformationUnstructured,
    // );
    // console.debug(
    //   '\ntransaction.remittanceInformationStructured is ',
    //   transaction.remittanceInformationStructured,
    // );

    return {
      ...transaction,
      payeeName: formatPayeeName(transaction),
      date: transaction.bookingDate,
    };
  },

  /**
   *  For COMMERZBANK_COBADEFF we don't know what balance was
   *  after each transaction so we have to calculate it by getting
   *  current balance from the account and subtract all the transactions
   *
   *  As a current balance we use `expected` balance type because it
   *  corresponds to the current running balance, whereas `interimAvailable`
   *  holds the remaining credit limit.
   */
  calculateStartingBalance(sortedTransactions = [], balances = []) {
    const currentBalance = balances.find(
      (balance) => 'expected' === balance.balanceType,
    );

    return sortedTransactions.reduce((total, trans) => {
      return total - amountToInteger(trans.transactionAmount.amount);
    }, amountToInteger(currentBalance.balanceAmount.amount));
  },
};
