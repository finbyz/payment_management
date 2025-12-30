from erpnext.accounts.report.accounts_receivable.accounts_receivable import ReceivablePayableReport as _ReceivablePayableReport
import frappe
from frappe.query_builder import Criterion
from frappe.query_builder.functions import Date, Substring
from frappe import qb


class ReceivablePayableReport(_ReceivablePayableReport):
    def get_ple_entries(self):
        # get all the GL entries filtered by the given filters

        self.prepare_conditions()

        if self.filters.show_future_payments:
            self.qb_selection_filter.append(
                self.ple.posting_date.lte(self.filters.report_date)
                | (
                    (self.ple.voucher_no == self.ple.against_voucher_no)
                    & (Date(self.ple.creation).lte(self.filters.report_date))
                )
            )
        else:
            self.qb_selection_filter.append(self.ple.posting_date.lte(self.filters.report_date))

        ple = qb.DocType("Payment Ledger Entry")
        query = (
            qb.from_(ple)
            .select(
                ple.name,
                ple.account,
                ple.voucher_type,
                ple.voucher_no,
                ple.against_voucher_type,
                ple.against_voucher_no,
                ple.party_type,
                ple.cost_center,
                ple.party,
                ple.posting_date,
                ple.due_date,
                ple.account_currency,
                ple.amount,
                ple.amount_in_account_currency,
            )
            .where(ple.delinked == 0)
            .where(Criterion.all(self.qb_selection_filter))
            .where(Criterion.any(self.or_filters))
        )

        if self.filters.get("due_entries"):
            query = query.where((ple.due_date.lte(self.filters.get("report_date")) | (ple.due_date.isnull()) | (ple.due_date == '') ))


        if self.filters.get("show_remarks"):
            if remarks_length := frappe.db.get_single_value(
                "Accounts Settings", "receivable_payable_remarks_length"
            ):
                query = query.select(Substring(ple.remarks, 1, remarks_length).as_("remarks"))
            else:
                query = query.select(ple.remarks)

        if self.filters.get("group_by_party"):
            query = query.orderby(self.ple.party, self.ple.posting_date)
        else:
            query = query.orderby(self.ple.posting_date, self.ple.party)
        self.ple_entries = query.run(as_dict=True)

    def get_invoice_details(self):
        self.invoice_details = frappe._dict()
        report_date = self.filters.get('report_date')
        due_condition = f"and due_date <= '{report_date}'" if self.filters.get('due_entries') else ""
        pi_due_condition = (
            f"and ps.due_date <= '{report_date}'"
            if self.filters.get("due_entries")
            else ""
        )
        if self.account_type == "Receivable":
            # nosemgrep
            si_list = frappe.db.sql(
                f"""
                select name, due_date, po_no
                from `tabSales Invoice`
                where posting_date <= %s
                    and company = %s
                    and docstatus = 1
                    {due_condition}
            """,
                (self.filters.report_date, self.filters.company),
                as_dict=1,
            )
            for d in si_list:
                self.invoice_details.setdefault(d.name, d)

            # Get Sales Team
            if self.filters.show_sales_person:
                # nosemgrep
                sales_team = frappe.db.sql(
                    """
                    select parent, sales_person
                    from `tabSales Team`
                    where parenttype = 'Sales Invoice'
                """,
                    as_dict=1,
                )
                for d in sales_team:
                    self.invoice_details.setdefault(d.parent, {}).setdefault("sales_team", []).append(
                        d.sales_person
                    )

        if self.account_type == "Payable":
            # nosemgrep
            data = frappe.db.sql(
                f"""
                SELECT
                    pi.name,
                    ps.due_date,
                    ps.payment_term,
                    pi.bill_no,
                    pi.bill_date
                FROM `tabPurchase Invoice` pi
                INNER JOIN `tabPayment Schedule` ps
                    ON ps.parent = pi.name
                    AND ps.parenttype = 'Purchase Invoice'
                WHERE
                    pi.posting_date <= %s
                    AND pi.company = %s
                    AND pi.docstatus = 1
                    {pi_due_condition}
                """,
                (self.filters.report_date, self.filters.company),
                as_dict=1,
            )
            for pi in data:
                self.invoice_details.setdefault(pi.name, pi)

        # Invoices booked via Journal Entries
        # nosemgrep
        journal_entries = frappe.db.sql(
            f"""
            select name, due_date, bill_no, bill_date
            from `tabJournal Entry`
            where
                posting_date <= %s
                and company = %s
                and docstatus = 1 {due_condition}
        """,
            (self.filters.report_date, self.filters.company),
            as_dict=1,
        )

        for je in journal_entries:
            if je.bill_no:
                self.invoice_details.setdefault(je.name, je)

