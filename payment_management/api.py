from erpnext.setup.utils import get_exchange_rate
import frappe
from collections import defaultdict
from erpnext.accounts.doctype.payment_request.payment_request import (
    get_existing_payment_request_amount,
    get_amount,
)
from frappe.utils.data import flt
from frappe.utils import nowdate
import traceback



@frappe.whitelist()
def create_payment_request(selected_rows,company):
    response = {"error": [], "success": []}
    selected_rows = frappe.parse_json(selected_rows)
    grouped_by_supplier = defaultdict(list)
    for row in selected_rows:
        grouped_by_supplier[row.get("party")].append(row)
    company = frappe.get_doc("Company", company)
    bank_account = company.default_bank_account
    for party, rows in grouped_by_supplier.items():
        for row in rows:
            if (
                row.get("voucher_type") is None
                or row.get("voucher_no") is None
                or row.get("voucher_type") == "Journal Entry"
            ):
                continue


            existing_payment_request_amount = get_existing_payment_request_amount(
                row.get("voucher_type"), row.get("voucher_no")
            )
            
            ref_doc = frappe.get_doc(row.get("voucher_type"), row.get("voucher_no"))
            

            payment_request = frappe.get_doc(
                {
                    "doctype": "Payment Request",
                    "party": party,
                    "party_type": row.get("party_type"),
                    "payment_request_type": "Outward",
                    "party_type": row.get("party_type"),
                    "reference_doctype": row.get("voucher_type"),
                    "reference_name": row.get("voucher_no"),
                    "grand_total": get_amount(ref_doc, party),
                    "transaction_date":nowdate(),
                    "mode_of_payment":"E payment",
                    "bank_account": bank_account,
                }
            )
            payment_request.save()
            response["success"].append(
                f"""<p>Payment Request for <a href="/app/supplier/{party}">{party}</a> - 
                <a href="{ref_doc.get_url()}">{row.get('voucher_no')}</a> - 
                <a href="{payment_request.get_url()}">{payment_request.get('name')}</a> 
                has been created successfully.</p>
                """
            )
    return response


@frappe.whitelist()
def create_payment_entry(selected_rows,company):
    selected_rows = frappe.parse_json(selected_rows)
    grouped_by_supplier = defaultdict(list)
    response = {"error": [], "success": []}
    for row in selected_rows:
        if not row.get("voucher_no"):
            continue
        grouped_by_supplier[row["party"]].append(row)
    company = frappe.get_doc("Company", company)
    bank_account = company.default_bank_account
    for party, rows in grouped_by_supplier.items():
        references = []
        total_paid = 0
        account_currency = "USD"
        party_currency = "USD"

        for row in rows:
            total_paid += row["outstanding"]

            account_currency = row["account_currency"]
            party_currency = row["currency"]

            references.append(
                {
                    "total_amount": row["total_due"],
                    "outstanding_amount": row["outstanding"],
                    "allocated_amount": row["outstanding"],
                }
            )

        exchange_rate = get_exchange_rate(account_currency, party_currency)

        payment_entry = frappe.get_doc(
            {
                "payment_type": "Pay",
                "posting_date":nowdate(),
                "company": company.name,
                "mode_of_payment": "E payment",
                "reference_no": "RTGS",
                "reference_date":nowdate(),
                "party_type": row["party_type"],
                "party": party,
                "paid_from":company.default_bank_account,
                "paid_amount": total_paid,
                "received_amount": total_paid,
                "source_exchange_rate": exchange_rate or 1,
                "doctype": "Payment Entry",
                "paid_to": row["party_account"],
                "references": references,
                "cost_center": row.get("cost_center"),
            }
        )

        payment_entry.flags.ignore_mandatory = True
        try:
            payment_entry.insert()
            response["success"].append(
                f"""<p>Payment Entry for <a href="/app/supplier/{party}">{party}</a> - 
                <a href="{frappe.utils.get_url_to_form(row.get('voucher_type'),row.get('voucher_no'))}">{row.get('voucher_no')}</a>
                - <a href="{payment_entry.get_url()}">{payment_entry.get('name')}</a> 
                has been created successfully.</p>"""
            )
        except Exception as e:
            response["error"].append(str(e))
            frappe.log_error("Payment entry error payment management",traceback.format_exc())

    return response
