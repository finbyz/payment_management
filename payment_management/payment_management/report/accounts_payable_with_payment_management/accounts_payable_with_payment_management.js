// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

const commonOnChange = () => {
	frappe.query_report.refresh().then(() => {
		unchecked_all_checkbox();
	});
};

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
			on_change: commonOnChange
		},
		{
			fieldname: "report_date",
			label: __("Posting Date"),
			fieldtype: "Date",
			default: frappe.datetime.get_today(),
			on_change: commonOnChange
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
			get_query: () => ({
				filters: {
					company: frappe.query_report.get_filter_value("company")
				}
			}),
			on_change: commonOnChange
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
			fieldname: "company_bank_account",
			label: __("Company Bank Account"),
			fieldtype: "Link", 
			options: "Bank Account",
			on_change: function () {
				updateBankBalanceCards();
			},
			get_query: () => {
				return {
					filters: [
						["is_company_account", "=", 1],
						["company", "is", "set"]
					]
				};
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
			"fieldname": "branch",
			"label": __("Branch"),
			"fieldtype": "Link",
			"options": "Branch"
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
			$(`.dt-row.dt-row-${index}.vrow [type='checkbox']`).prop("disabled", true);
		}
	});

	const all_checkbox = $(".dt-cell__content.dt-cell__content--header-0 [type='checkbox']");
	all_checkbox.off('change').on('change', function() {
		total_amount = 0;
		frappe.query_report.data.forEach((row, index) => {
			const checkbox = $(`.dt-row.dt-row-${index}.vrow [type='checkbox']`);
			if (this.checked && row.voucher_no && row.outstanding) {
				checkbox.prop("checked", true);
				total_amount += row.outstanding;
			} else {
				checkbox.prop("checked", false);
			}
		});
		set_card_total_amount(total_amount);
	});
}

async function updateBankBalanceCards() {
	const container = $(".report-summary");
	container.empty();

	// Add flex style
	if (!document.querySelector('.flex_importnat_report_style')) {
		const style = document.createElement('style');
		style.id = 'flex_importnat_report_style';
		style.innerHTML = '.flex_importnat_report{display: flex !important;}';
		document.head.appendChild(style);
	}
	container.addClass('flex_importnat_report');

	const createCard = (title, amount) => `
		<div class="card" style="width: 18rem; margin-right: 10px;">
			<div class="card-body">
				<h5 class="card-title">${title}</h5>
				<p class="card-text ${title.toLowerCase().replace(/\s+/g, '_')}">${amount.toLocaleString('en-US')}</p>
			</div>
		</div>
	`;

	const company_bank_account = frappe.query_report.get_filter_value("company_bank_account");
	
	if (company_bank_account) {
		const account_response = await frappe.db.get_value("Bank Account", company_bank_account, "account");
		const account = account_response.message.account;
		
		const response = await frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'GL Entry',
				filters: { account },
				fieldname: ['sum(debit) - sum(credit) as balance'],
			}
		});

		const bank_balance = response.message.balance || 0;
		const remaining_balance = bank_balance - total_amount;
		
		container.append(
			createCard("Bank Balance", bank_balance),
			createCard("Selected Amount", total_amount),
			createCard("Remaining Balance", remaining_balance)
		);
	} else {
		container.append(createCard("Selected Amount", total_amount));
	}
}

function set_card_total_amount(amount) {
	amount = Math.max(0, parseFloat(amount) || 0);
	$('.total_amount_invoice').text(amount.toLocaleString('en-US'));
	$('.selected_amount').text(amount.toLocaleString('en-US'));
	const company_bank_account = frappe.query_report.get_filter_value("company_bank_account");
	if (company_bank_account) {
		const bank_balance = parseFloat($('.bank_balance').text().replace(/,/g, '')) || 0;
		$('.remaining_balance').text((bank_balance - amount).toLocaleString('en-US'));
	}
}

function unchecked_all_checkbox() {
	$(".dt-row.vrow [type='checkbox']").prop("checked", false);
	$(".dt-row--highlight").removeClass("dt-row--highlight");
	total_amount = 0;
	set_card_total_amount(0);
}

function listner_to_checkbox() {
	frappe.query_report.data.forEach((row, index) => {
		if (!row.voucher_no) return;

		const checkbox = $(`.dt-row.dt-row-${index}.vrow [type='checkbox']`);
		checkbox.off('change').on('change', function() {
			total_amount += this.checked ? (row.outstanding || 0) : -(row.outstanding || 0);
			total_amount = Math.max(0, total_amount);
			set_card_total_amount(total_amount);
		});
	});
}

$(function() {
	const initializeReport = () => {
		frappe.query_report.page.add_action_item('Create Payment Request', async function() {
			const selected_rows = frappe.query_report.get_checked_items();
			if (selected_rows.length === 0) {
				frappe.msgprint(__("Please select at least one row to create payment request."));
				return;
			}

			const result = await frappe.call({
				method: 'payment_management.api.create_payment_request',
				args: {
					selected_rows,
					company: frappe.query_report.get_filter_value("company"),
				}
			});

			if (result.message.success) {
				frappe.msgprint([
					...result.message.success,
					...result.message.error
				].join('<br>'));
			} else {
				frappe.msgprint(result.message.error.join('<br>'));
			}
		}, __("Action"));

		frappe.query_report.page.add_action_item('Create Payment Entry', async function() {
			const selected_rows = frappe.query_report.get_checked_items();
			if (selected_rows.length === 0) {
				frappe.msgprint(__("Please select at least one row to create payment entry."));
				return;
			}

			const result = await frappe.call({
				method: 'payment_management.api.create_payment_entry',
				args: {
					selected_rows,
					company: frappe.query_report.get_filter_value("company"),
				}
			});

			if (result.message.success) {
				frappe.msgprint([
					...result.message.success,
					...result.message.error
				].join('<br>'));
			} else {
				frappe.msgprint(result.message.error.join('<br>'));
			}
		}, __("Action"));

		updateBankBalanceCards();

		const updateInterval = setInterval(() => {
			try {
				disable_checkbox_column();
				listner_to_checkbox();
			} catch (error) {
				console.error('Error updating checkboxes:', error);
			}
		}, 300);

		// Cleanup on page unload
		$(window).on('unload', () => clearInterval(updateInterval));
	};

	initializeReport();
	if (frappe.query_report.$chart) {
		frappe.query_report.$chart.remove();
	}
});


