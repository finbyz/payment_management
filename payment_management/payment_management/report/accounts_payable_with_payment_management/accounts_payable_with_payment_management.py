# Copyright (c) 2024, FInbyz and contributors
# For license information, please see license.txt
from payment_management.payment_management.report.accounts_payable_with_payment_management.accounts_receivable import ReceivablePayableReport
import frappe

def execute(filters=None):
	args = {
		"account_type": "Payable",
		"naming_by": ["Buying Settings", "supp_master_name"],
	}
	return ReceivablePayableReport(filters).run(args)
