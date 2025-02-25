// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.query_reports["Accounts Payable with Payment Management"] = {
	get_datatable_options(options) {
		options.checkboxColumn = true;
		return options;
	},

	filters: [
		{
			fieldname: "company",
			label: __("Company"),
			fieldtype: "Link",
			options: "Company",
			reqd: 1,
			default: frappe.defaults.get_user_default("Company"),
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},
		},
		{
			fieldname: "report_date",
			label: __("Posting Date"),
			fieldtype: "Date",
			default: frappe.datetime.get_today(),
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "finance_book",
			label: __("Finance Book"),
			fieldtype: "Link",
			options: "Finance Book",
		},
		{
			fieldname: "cost_center",
			label: __("Cost Center"),
			fieldtype: "Link",
			options: "Cost Center",
			get_query: () => {
				var company = frappe.query_report.get_filter_value("company");
				return {
					filters: {
						company: company,
					},
				};
			},
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},
		},
		{
			fieldname: "party_account",
			label: __("Payable Account"),
			fieldtype: "Link",
			options: "Account",
			get_query: () => {
				var company = frappe.query_report.get_filter_value("company");
				return {
					filters: {
						company: company,
						account_type: "Payable",
						is_group: 0,
					},
				};
			},
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},
		},
		{
			fieldname: "ageing_based_on",
			label: __("Ageing Based On"),
			fieldtype: "Select",
			options: "Posting Date\nDue Date\nSupplier Invoice Date",
			default: "Due Date",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "range1",
			label: __("Ageing Range 1"),
			fieldtype: "Int",
			default: "30",
			reqd: 1,
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "range2",
			label: __("Ageing Range 2"),
			fieldtype: "Int",
			default: "60",
			reqd: 1,
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "range3",
			label: __("Ageing Range 3"),
			fieldtype: "Int",
			default: "90",
			reqd: 1,
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "range4",
			label: __("Ageing Range 4"),
			fieldtype: "Int",
			default: "120",
			reqd: 1,
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "payment_terms_template",
			label: __("Payment Terms Template"),
			fieldtype: "Link",
			options: "Payment Terms Template",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "party_type",
			label: __("Party Type"),
			fieldtype: "Autocomplete",
			options: get_party_type_options(),
			on_change: function () {
				frappe.query_report.set_filter_value("party", "");
				frappe.query_report.toggle_filter_display(
					"supplier_group",
					frappe.query_report.get_filter_value("party_type") !== "Supplier"
				);
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},
		},
		{
			fieldname: "party",
			label: __("Party"),
			fieldtype: "MultiSelectList",
			get_data: function (txt) {
				if (!frappe.query_report.filters) return;

				let party_type = frappe.query_report.get_filter_value("party_type");
				if (!party_type) return;

				return frappe.db.get_link_options(party_type, txt);
			},
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "supplier_group",
			label: __("Supplier Group"),
			fieldtype: "Link",
			options: "Supplier Group",
			hidden: 1,
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "group_by_party",
			label: __("Group By Supplier"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},
			default: 1,

		},
		{
			fieldname: "due_entries",
			label: __("Due Entries"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},
			default: 1,
		},
		{
			fieldname: "based_on_payment_terms",
			label: __("Based On Payment Terms"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},
		},
		{
			fieldname: "show_remarks",
			label: __("Show Remarks"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "show_future_payments",
			label: __("Show Future Payments"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "for_revaluation_journals",
			label: __("Revaluation Journals"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "in_party_currency",
			label: __("In Party Currency"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
		{
			fieldname: "ignore_accounts",
			label: __("Group by Voucher"),
			fieldtype: "Check",
			on_change: function () {
				total_amount = 0;

				frappe.query_report.refresh().then(() => {
					unchecked_all_checkbox();
				}
				);

			},

		},
	],

	formatter: function (value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);
		if (data && data.bold) {
			value = value.bold();
		}
		return value;
	},

	refresh: function (report) {
		unchecked_all_checkbox();
	},

	onload: function (report) {
		frappe.run_serially([
			() => {
				report.page.add_inner_button(__("Accounts Payable Summary"), function () {
					var filters = report.get_values();
					frappe.set_route("query-report", "Accounts Payable Summary", { company: filters.company });
				});
			},
			() => {
				unchecked_all_checkbox();
			},
		]);
	},
};

erpnext.utils.add_dimensions("Accounts Payable with Payment Management", 9);

function get_party_type_options() {
	let options = [];
	frappe.db
		.get_list("Party Type", { filters: { account_type: "Payable" }, fields: ["name"] })
		.then((res) => {
			res.forEach((party_type) => {
				options.push(party_type.name);
			});
		});
	return options;
}

// write jquery that run on page load

var total_amount = 0;
function disable_checkbox_column() {
	frappe.query_report.data.forEach((row, index) => {
		if (!row.voucher_no || row.outstanding <= 0) {
			let node = `.dt-row.dt-row-${index}.vrow`;
			$(node).find("[type='checkbox']").prop("disabled", true);
		}
	});
	// Selecting with jQuery
	let all_checkbox = $(".dt-cell__content.dt-cell__content--header-0");
	all_checkbox = all_checkbox.find("[type='checkbox']")
	all_checkbox.off('change').change(function () {
		total_amount = 0;
		if (this.checked) {
			frappe.query_report.data.forEach((row, index) => {
				let node = `.dt-row.dt-row-${index}.vrow`;
				if (row.voucher_no != undefined && row.invoice_grand_total) {
					$(node).find("[type='checkbox']").prop("checked", true);
					total_amount += row.invoice_grand_total;
				}
				else {
					$(node).find("[type='checkbox']").prop("checked", false);
				}
			});
		}
		else {
			frappe.query_report.data.forEach((row, index) => {
				let node = `.dt-row.dt-row-${index}.vrow`;
				$(node).find("[type='checkbox']").prop("checked", false);
			});
		}
		let $totalElement = $('.total_amount_invoice');
		$totalElement.text(total_amount);
	}
	);

}

function set_card_total_amount(amount) {
	var style = document.createElement('style');
	style.innerHTML = '.flex_importnat_report{display: flex !important;}'
	document.getElementsByTagName('head')[0].appendChild(style);
	$(".report-summary").addClass('flex_importnat_report');
	var container = $(".report-summary");
	var card = $(`
			<div class="card" style="width: 18rem;">
				<div class="card-body">
					<h5 class="card-title">Total Amount</h5>
					<p class="card-text total_amount_invoice">${amount.toLocaleString('en-US')}</p>
				</div>
			</div>
			`);
	container.empty();
	container.append(card);
}
function unchecked_all_checkbox() {
	frappe.query_report.data.forEach((row, index) => {
		let node = `.dt-row.dt-row-${index}.vrow`;
		$(node).find("[type='checkbox']").prop("checked", false);
	});
	document.querySelectorAll(".dt-row--highlight").forEach((row) => {
		row.classList.remove("dt-row--highlight");
	}
	);
}

function listner_to_checkbox() {
	frappe.query_report.data.forEach((row, index) => {
		if (row.voucher_no) {
			let node = `.dt-row.dt-row-${index}.vrow`;
			let checkbox = $(node).find("[type='checkbox']");

			checkbox.off('change').on('change', (function () {
				if (this.checked) {
					total_amount += row.invoice_grand_total;
					if (total_amount < 0) {
						total_amount = 0
					}
					set_card_total_amount(total_amount);
				} else {
					total_amount -= row.invoice_grand_total;
					if (total_amount < 0) {
						total_amount = 0
					}
					set_card_total_amount(total_amount);
				}
			})
			);

		}
	});

}


$(function () {
	frappe.query_report.page.add_action_item('Create Payment Request', function () {
		const selected_rows = frappe.query_report.get_checked_items();
		if (selected_rows.length === 0) {
			frappe.msgprint(__("Please select at least one row to create payment request."));
			return;
		}
		frappe.call({
			method: 'payment_management.api.create_payment_request',
			args: {
				"selected_rows": selected_rows,
				"company": frappe.query_report.get_filter_value("company"),
			},
			callback: function (r) {
				if (r.message.success) {
					frappe.msgprint(r.message.success.join('<br>'));
					frappe.msgprint(r.message.error.join('<br>'));
				}
				else{
					frappe.msgprint(r.message.error.join('<br>'));
				}
			}
		});
	}, __("Action"));
	frappe.query_report.page.add_action_item('Create Payment Entry', function () {
		const selected_rows = frappe.query_report.get_checked_items();
		console.log('selected_rows', selected_rows);
		if (selected_rows.length === 0) {
			frappe.msgprint(__("Please select at least one row to create payment entry."));
			return;
		}
		frappe.call({
			method: 'payment_management.api.create_payment_entry',
			args: {
				"selected_rows": selected_rows,
				"company": frappe.query_report.get_filter_value("company"),
			},
			callback: function (r) {
				if (r.message.success) {
					frappe.msgprint(r.message.success.join('<br>'));
					frappe.msgprint(r.message.error.join('<br>'));
				}
				else{
					frappe.msgprint(r.message.error.join('<br>'));
				}
			}
		});
	}, __("Action"));

	setInterval(function () {
		try {
			disable_checkbox_column();
			set_card_total_amount(total_amount);
			listner_to_checkbox();
		} catch (error) {
			console.log(error);
		}
	}, 300);
	frappe.query_report.$chart.remove()

});


