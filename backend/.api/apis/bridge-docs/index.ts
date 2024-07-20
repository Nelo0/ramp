import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'bridge-docs/0.0.1 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Get the full list of all customers created on Bridge
   *
   * @summary Get all customers
   * @throws FetchError<401, types.GetCustomersResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomers(metadata?: types.GetCustomersMetadataParam): Promise<FetchResponse<200, types.GetCustomersResponse200>> {
    return this.core.fetch('/customers', 'get', metadata);
  }

  /**
   * Create a customer
   *
   * @throws FetchError<400, types.PostCustomersResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostCustomersResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostCustomersResponse500> Unexpected error. User may try and send the request again.
   */
  postCustomers(body: types.PostCustomersBodyParam, metadata?: types.PostCustomersMetadataParam): Promise<FetchResponse<201, types.PostCustomersResponse201>> {
    return this.core.fetch('/customers', 'post', body, metadata);
  }

  /**
   * Retrieve a customer object from the passed in customer ID
   *
   * @summary Get a single customer object
   * @throws FetchError<401, types.GetCustomersCustomeridResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetCustomersCustomeridResponse404> No resource found
   * @throws FetchError<500, types.GetCustomersCustomeridResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomerid(metadata: types.GetCustomersCustomeridMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridResponse200>> {
    return this.core.fetch('/customers/{customerID}', 'get', metadata);
  }

  /**
   * Update the customer object identified by the passed in customer ID. Note, this can
   * currently only be done to update information before a customer has been approved.
   *
   * @summary Update a single customer object
   * @throws FetchError<401, types.PutCustomersCustomeridResponse401> Missing or invalid API key
   * @throws FetchError<404, types.PutCustomersCustomeridResponse404> No resource found
   * @throws FetchError<500, types.PutCustomersCustomeridResponse500> Unexpected error. User may try and send the request again.
   */
  putCustomersCustomerid(body: types.PutCustomersCustomeridBodyParam, metadata: types.PutCustomersCustomeridMetadataParam): Promise<FetchResponse<200, types.PutCustomersCustomeridResponse200>> {
    return this.core.fetch('/customers/{customerID}', 'put', body, metadata);
  }

  /**
   * Delete a customer object from the passed in customer ID
   *
   * @summary Delete a single customer object
   * @throws FetchError<401, types.DeleteCustomersCustomeridResponse401> Missing or invalid API key
   * @throws FetchError<404, types.DeleteCustomersCustomeridResponse404> No resource found
   * @throws FetchError<500, types.DeleteCustomersCustomeridResponse500> Unexpected error. User may try and send the request again.
   */
  deleteCustomersCustomerid(metadata: types.DeleteCustomersCustomeridMetadataParam): Promise<FetchResponse<200, types.DeleteCustomersCustomeridResponse200>> {
    return this.core.fetch('/customers/{customerID}', 'delete', metadata);
  }

  /**
   * Get all External Accounts for a passed in customer.
   *
   * @summary Get all External Accounts
   * @throws FetchError<401, types.GetCustomersCustomeridExternalAccountsResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersCustomeridExternalAccountsResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridExternal_accounts(metadata: types.GetCustomersCustomeridExternalAccountsMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridExternalAccountsResponse200>> {
    return this.core.fetch('/customers/{customerID}/external_accounts', 'get', metadata);
  }

  /**
   * Create a new External Account
   *
   * @throws FetchError<400, types.PostCustomersCustomeridExternalAccountsResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostCustomersCustomeridExternalAccountsResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostCustomersCustomeridExternalAccountsResponse500> Unexpected error. User may try and send the request again.
   */
  postCustomersCustomeridExternal_accounts(body: types.PostCustomersCustomeridExternalAccountsBodyParam, metadata: types.PostCustomersCustomeridExternalAccountsMetadataParam): Promise<FetchResponse<201, types.PostCustomersCustomeridExternalAccountsResponse201>> {
    return this.core.fetch('/customers/{customerID}/external_accounts', 'post', body, metadata);
  }

  /**
   * Retrieve an External Account object (banks, debit cards etc) from the passed in customer
   * ID and External Account ID
   *
   * @summary Retrieve an External Account object
   * @throws FetchError<401, types.GetCustomersCustomeridExternalAccountsExternalaccountidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetCustomersCustomeridExternalAccountsExternalaccountidResponse404> No resource found
   * @throws FetchError<500, types.GetCustomersCustomeridExternalAccountsExternalaccountidResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridExternal_accountsExternalaccountid(metadata: types.GetCustomersCustomeridExternalAccountsExternalaccountidMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridExternalAccountsExternalaccountidResponse200>> {
    return this.core.fetch('/customers/{customerID}/external_accounts/{externalAccountID}', 'get', metadata);
  }

  /**
   * Add a beneficiary address to an account if it is missing
   *
   * @throws FetchError<400, types.PutCustomersCustomeridExternalAccountsExternalaccountidResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PutCustomersCustomeridExternalAccountsExternalaccountidResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PutCustomersCustomeridExternalAccountsExternalaccountidResponse500> Unexpected error. User may try and send the request again.
   */
  putCustomersCustomeridExternal_accountsExternalaccountid(body: types.PutCustomersCustomeridExternalAccountsExternalaccountidBodyParam, metadata: types.PutCustomersCustomeridExternalAccountsExternalaccountidMetadataParam): Promise<FetchResponse<200, types.PutCustomersCustomeridExternalAccountsExternalaccountidResponse200>> {
    return this.core.fetch('/customers/{customerID}/external_accounts/{externalAccountID}', 'put', body, metadata);
  }

  /**
   * Delete an External Account object from the passed in External Account ID
   *
   * @summary Delete a single External Account object
   * @throws FetchError<401, types.DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse404> No resource found
   * @throws FetchError<500, types.DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse500> Unexpected error. User may try and send the request again.
   */
  deleteCustomersCustomeridExternal_accountsExternalaccountid(metadata: types.DeleteCustomersCustomeridExternalAccountsExternalaccountidMetadataParam): Promise<FetchResponse<200, types.DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse200>> {
    return this.core.fetch('/customers/{customerID}/external_accounts/{externalAccountID}', 'delete', metadata);
  }

  /**
   * The page at the returned URL will guide the user through the Bridge Terms of Service
   * (ToS) acceptance flow. This can be used by existing customers to accept a new version of
   * the ToS.
   *
   * @summary Retrieve a hosted URL for ToS acceptance for an existing customer
   * @throws FetchError<401, types.GetCustomersCustomeridTosAcceptanceLinkResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersCustomeridTosAcceptanceLinkResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridTos_acceptance_link(metadata: types.GetCustomersCustomeridTosAcceptanceLinkMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridTosAcceptanceLinkResponse200>> {
    return this.core.fetch('/customers/{customerID}/tos_acceptance_link', 'get', metadata);
  }

  /**
   * The page at the returned URL will guide the user through a Bridge KYC flow. This can be
   * used by existing customers to provide additional KYC information required for certain
   * features or services that Bridge offers.
   *
   * For example, to enable an existing customer to use the `SEPA`/`Euro` services, they are
   * required to provide `proof of address`. An additional parameter, `endorsement=sepa`, can
   * be included to request a KYC link specifically for this purpose
   *
   * @summary Retrieve a hosted KYC Link for an existing customer
   * @throws FetchError<401, types.GetCustomersCustomeridKycLinkResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersCustomeridKycLinkResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridKyc_link(metadata: types.GetCustomersCustomeridKycLinkMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridKycLinkResponse200>> {
    return this.core.fetch('/customers/{customerID}/kyc_link', 'get', metadata);
  }

  /**
   * Get all active and completed transfers for a customer.
   *
   * @summary Get all transfers
   * @throws FetchError<401, types.GetCustomersCustomeridTransfersResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersCustomeridTransfersResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridTransfers(metadata: types.GetCustomersCustomeridTransfersMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridTransfersResponse200>> {
    return this.core.fetch('/customers/{customerID}/transfers', 'get', metadata);
  }

  /**
   * The URL endpoint returned will guide the user through a Bridge TOS flow. Signing this
   * acceptance flow is a requirement for creating customers.
   *
   * @summary Request a hosted URL for ToS acceptance for new customer creation
   * @throws FetchError<401, types.PostCustomersTosLinksResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostCustomersTosLinksResponse500> Unexpected error. User may try and send the request again.
   */
  postCustomersTos_links(metadata?: types.PostCustomersTosLinksMetadataParam): Promise<FetchResponse<201, types.PostCustomersTosLinksResponse201>> {
    return this.core.fetch('/customers/tos_links', 'post', metadata);
  }

  /**
   * Generate a Plaid Link token for a customer
   *
   * @throws FetchError<400, types.PostCustomersCustomeridPlaidLinkRequestsResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostCustomersCustomeridPlaidLinkRequestsResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostCustomersCustomeridPlaidLinkRequestsResponse500> Unexpected error. User may try and send the request again.
   */
  postCustomersCustomeridPlaid_link_requests(metadata: types.PostCustomersCustomeridPlaidLinkRequestsMetadataParam): Promise<FetchResponse<201, types.PostCustomersCustomeridPlaidLinkRequestsResponse201>> {
    return this.core.fetch('/customers/{customerID}/plaid_link_requests', 'post', metadata);
  }

  /**
   * Exchange Plaid public token for an access token
   *
   * @throws FetchError<400, types.PostPlaidExchangePublicTokenLinkTokenResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostPlaidExchangePublicTokenLinkTokenResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostPlaidExchangePublicTokenLinkTokenResponse500> Unexpected error. User may try and send the request again.
   */
  postPlaid_exchange_public_tokenLink_token(body: types.PostPlaidExchangePublicTokenLinkTokenBodyParam, metadata: types.PostPlaidExchangePublicTokenLinkTokenMetadataParam): Promise<FetchResponse<201, types.PostPlaidExchangePublicTokenLinkTokenResponse201>> {
    return this.core.fetch('/plaid_exchange_public_token/{link_token}', 'post', body, metadata);
  }

  /**
   * Get all transfers
   *
   * @throws FetchError<401, types.GetTransfersResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetTransfersResponse500> Unexpected error. User may try and send the request again.
   */
  getTransfers(metadata?: types.GetTransfersMetadataParam): Promise<FetchResponse<200, types.GetTransfersResponse200>> {
    return this.core.fetch('/transfers', 'get', metadata);
  }

  /**
   * Create a transfer
   *
   * @throws FetchError<400, types.PostTransfersResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostTransfersResponse401> Missing or invalid API key
   * @throws FetchError<403, types.PostTransfersResponse403> The transfer has failed due to an AML violation (anti-money laundering).  Reach out to
   * Bridge for more information
   * @throws FetchError<500, types.PostTransfersResponse500> Unexpected error. User may try and send the request again.
   */
  postTransfers(body: types.PostTransfersBodyParam, metadata?: types.PostTransfersMetadataParam): Promise<FetchResponse<201, types.PostTransfersResponse201>> {
    return this.core.fetch('/transfers', 'post', body, metadata);
  }

  /**
   * Retrieve a transfer object from the passed in transfer ID
   *
   * @summary Get a transfer
   * @throws FetchError<401, types.GetTransfersTransferidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetTransfersTransferidResponse404> No resource found
   * @throws FetchError<500, types.GetTransfersTransferidResponse500> Unexpected error. User may try and send the request again.
   */
  getTransfersTransferid(metadata: types.GetTransfersTransferidMetadataParam): Promise<FetchResponse<200, types.GetTransfersTransferidResponse200>> {
    return this.core.fetch('/transfers/{transferID}', 'get', metadata);
  }

  /**
   * Delete a transfer that was previously created. Must be in the awaiting_funds state.
   *
   * @summary Delete a transfer
   * @throws FetchError<401, types.DeleteTransfersTransferidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.DeleteTransfersTransferidResponse404> No resource found
   * @throws FetchError<500, types.DeleteTransfersTransferidResponse500> Unexpected error. User may try and send the request again.
   */
  deleteTransfersTransferid(metadata: types.DeleteTransfersTransferidMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/transfers/{transferID}', 'delete', metadata);
  }

  /**
   * Retrieve a all Prefunded Accounts
   *
   * @summary Get a list of all Prefunded Account
   * @throws FetchError<401, types.GetPrefundedAccountsResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetPrefundedAccountsResponse404> No resource found
   * @throws FetchError<500, types.GetPrefundedAccountsResponse500> Unexpected error. User may try and send the request again.
   */
  getPrefunded_accounts(): Promise<FetchResponse<200, types.GetPrefundedAccountsResponse200>> {
    return this.core.fetch('/prefunded_accounts', 'get');
  }

  /**
   * Retrieve a Prefunded Account
   *
   * @summary Get details for a specific Prefunded Account
   * @throws FetchError<401, types.GetPrefundedAccountsPrefundedaccountidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetPrefundedAccountsPrefundedaccountidResponse404> No resource found
   * @throws FetchError<500, types.GetPrefundedAccountsPrefundedaccountidResponse500> Unexpected error. User may try and send the request again.
   */
  getPrefunded_accountsPrefundedaccountid(metadata: types.GetPrefundedAccountsPrefundedaccountidMetadataParam): Promise<FetchResponse<200, types.GetPrefundedAccountsPrefundedaccountidResponse200>> {
    return this.core.fetch('/prefunded_accounts/{prefundedAccountID}', 'get', metadata);
  }

  /**
   * Retrieve the funding events and returns for a Prefunded Account
   *
   * @summary Get funding history of a Prefunded Account
   * @throws FetchError<401, types.GetPrefundedAccountsPrefundedaccountidHistoryResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetPrefundedAccountsPrefundedaccountidHistoryResponse404> No resource found
   * @throws FetchError<500, types.GetPrefundedAccountsPrefundedaccountidHistoryResponse500> Unexpected error. User may try and send the request again.
   */
  getPrefunded_accountsPrefundedaccountidHistory(metadata: types.GetPrefundedAccountsPrefundedaccountidHistoryMetadataParam): Promise<FetchResponse<200, types.GetPrefundedAccountsPrefundedaccountidHistoryResponse200>> {
    return this.core.fetch('/prefunded_accounts/{prefundedAccountID}/history', 'get', metadata);
  }

  /**
   * Create a Liquidation Address
   *
   * @throws FetchError<400, types.PostCustomersCustomeridLiquidationAddressesResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostCustomersCustomeridLiquidationAddressesResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostCustomersCustomeridLiquidationAddressesResponse500> Unexpected error. User may try and send the request again.
   */
  postCustomersCustomeridLiquidation_addresses(body: types.PostCustomersCustomeridLiquidationAddressesBodyParam, metadata: types.PostCustomersCustomeridLiquidationAddressesMetadataParam): Promise<FetchResponse<201, types.PostCustomersCustomeridLiquidationAddressesResponse201>> {
    return this.core.fetch('/customers/{customerID}/liquidation_addresses', 'post', body, metadata);
  }

  /**
   * Get Liquidation Addresses
   *
   * @summary Get all Liquidation Addresses for a customer
   * @throws FetchError<400, types.GetCustomersCustomeridLiquidationAddressesResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.GetCustomersCustomeridLiquidationAddressesResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersCustomeridLiquidationAddressesResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridLiquidation_addresses(metadata: types.GetCustomersCustomeridLiquidationAddressesMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridLiquidationAddressesResponse200>> {
    return this.core.fetch('/customers/{customerID}/liquidation_addresses', 'get', metadata);
  }

  /**
   * Retrieve a Liquidation Address for the specified Liquidation Address ID
   *
   * @summary Get a Liquidation Address
   * @throws FetchError<400, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse404> No resource found
   * @throws FetchError<500, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridLiquidation_addressesLiquidationaddressid(metadata: types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse200>> {
    return this.core.fetch('/customers/{customerID}/liquidation_addresses/{liquidationAddressID}', 'get', metadata);
  }

  /**
   * Update a Liquidation Address for the specified liquidation address ID
   *
   * @summary Update a Liquidation Address
   * @throws FetchError<400, types.PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse500> Unexpected error. User may try and send the request again.
   */
  putCustomersCustomeridLiquidation_addressesLiquidationaddressid(body: types.PutCustomersCustomeridLiquidationAddressesLiquidationaddressidBodyParam, metadata: types.PutCustomersCustomeridLiquidationAddressesLiquidationaddressidMetadataParam): Promise<FetchResponse<200, types.PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse200>> {
    return this.core.fetch('/customers/{customerID}/liquidation_addresses/{liquidationAddressID}', 'put', body, metadata);
  }

  /**
   * Get drain history of a Liquidation Address
   *
   * @summary Get drain history of a Liquidation Address
   * @throws FetchError<400, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridLiquidation_addressesLiquidationaddressidDrains(metadata: types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse200>> {
    return this.core.fetch('/customers/{customerID}/liquidation_addresses/{liquidationAddressID}/drains', 'get', metadata);
  }

  /**
   * Get the balance of a Liquidation Address
   *
   * @summary Get the balance of a Liquidation Address
   * @throws FetchError<400, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse500> Unexpected error. User may try and send the request again.
   */
  getCustomersCustomeridLiquidation_addressesLiquidationaddressidBalances(metadata: types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse200>> {
    return this.core.fetch('/customers/{customerID}/liquidation_addresses/{liquidationAddressID}/balances', 'get', metadata);
  }

  /**
   * Create a Virtual Account for the specified customer
   *
   * @summary Create a Virtual Account
   */
  postCustomersCustomeridVirtual_accounts(body: types.PostCustomersCustomeridVirtualAccountsBodyParam, metadata: types.PostCustomersCustomeridVirtualAccountsMetadataParam): Promise<FetchResponse<200, types.PostCustomersCustomeridVirtualAccountsResponse200>> {
    return this.core.fetch('/customers/{customerID}/virtual_accounts', 'post', body, metadata);
  }

  /**
   * List all Virtual Account objects for a customer
   *
   * @summary List Virtual Accounts
   */
  getCustomersCustomeridVirtual_accounts(metadata: types.GetCustomersCustomeridVirtualAccountsMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridVirtualAccountsResponse200>> {
    return this.core.fetch('/customers/{customerID}/virtual_accounts', 'get', metadata);
  }

  /**
   * Retrieve the Virtual Account object from the passed ID
   *
   * @summary Get a Virtual Account
   */
  getCustomersCustomeridVirtual_accountsVirtualaccountid(metadata: types.GetCustomersCustomeridVirtualAccountsVirtualaccountidMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridVirtualAccountsVirtualaccountidResponse200>> {
    return this.core.fetch('/customers/{customerID}/virtual_accounts/{virtualAccountID}', 'get', metadata);
  }

  /**
   * Update instructions for an existing Virtual Account
   *
   * @summary Update a Virtual Account
   */
  putCustomersCustomeridVirtual_accountsVirtualaccountid(body: types.PutCustomersCustomeridVirtualAccountsVirtualaccountidBodyParam, metadata: types.PutCustomersCustomeridVirtualAccountsVirtualaccountidMetadataParam): Promise<FetchResponse<200, types.PutCustomersCustomeridVirtualAccountsVirtualaccountidResponse200>> {
    return this.core.fetch('/customers/{customerID}/virtual_accounts/{virtualAccountID}', 'put', body, metadata);
  }

  /**
   * Deactivate a Virtual Account to prevent it from acceping new incoming transactions
   *
   * @summary Deactivate a Virtual Account
   */
  postCustomersCustomeridVirtual_accountsVirtualaccountidDeactivate(metadata: types.PostCustomersCustomeridVirtualAccountsVirtualaccountidDeactivateMetadataParam): Promise<FetchResponse<200, types.PostCustomersCustomeridVirtualAccountsVirtualaccountidDeactivateResponse200>> {
    return this.core.fetch('/customers/{customerID}/virtual_accounts/{virtualAccountID}/deactivate', 'post', metadata);
  }

  /**
   * Reactivate a previously deactivated Virtual Account
   *
   * @summary Reactivate a Virtual Account
   */
  postCustomersCustomeridVirtual_accountsVirtualaccountidReactivate(metadata: types.PostCustomersCustomeridVirtualAccountsVirtualaccountidReactivateMetadataParam): Promise<FetchResponse<200, types.PostCustomersCustomeridVirtualAccountsVirtualaccountidReactivateResponse200>> {
    return this.core.fetch('/customers/{customerID}/virtual_accounts/{virtualAccountID}/reactivate', 'post', metadata);
  }

  /**
   * History of activity for a Virtual Account
   *
   * @summary Virtual Account Activity
   */
  getCustomersCustomeridVirtual_accountsVirtualaccountidHistory(metadata: types.GetCustomersCustomeridVirtualAccountsVirtualaccountidHistoryMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridVirtualAccountsVirtualaccountidHistoryResponse200>> {
    return this.core.fetch('/customers/{customerID}/virtual_accounts/{virtualAccountID}/history', 'get', metadata);
  }

  /**
   * Create a Static Memo for the specified customer
   *
   * @summary Create a Static Memo
   */
  postCustomersCustomeridStatic_memos(body: types.PostCustomersCustomeridStaticMemosBodyParam, metadata: types.PostCustomersCustomeridStaticMemosMetadataParam): Promise<FetchResponse<200, types.PostCustomersCustomeridStaticMemosResponse200>> {
    return this.core.fetch('/customers/{customerID}/static_memos', 'post', body, metadata);
  }

  /**
   * List all Static Memo objects for a customer
   *
   * @summary List Static Memos
   */
  getCustomersCustomeridStatic_memos(metadata: types.GetCustomersCustomeridStaticMemosMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridStaticMemosResponse200>> {
    return this.core.fetch('/customers/{customerID}/static_memos', 'get', metadata);
  }

  /**
   * Retrieve the Static Memo object from the passed ID
   *
   * @summary Get a Static Memo
   */
  getCustomersCustomeridStatic_memosStaticmemoid(metadata: types.GetCustomersCustomeridStaticMemosStaticmemoidMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridStaticMemosStaticmemoidResponse200>> {
    return this.core.fetch('/customers/{customerID}/static_memos/{staticMemoID}', 'get', metadata);
  }

  /**
   * Update instructions for an existing Static Memo
   *
   * @summary Update a Static Memo
   */
  putCustomersCustomeridStatic_memosStaticmemoid(body: types.PutCustomersCustomeridStaticMemosStaticmemoidBodyParam, metadata: types.PutCustomersCustomeridStaticMemosStaticmemoidMetadataParam): Promise<FetchResponse<200, types.PutCustomersCustomeridStaticMemosStaticmemoidResponse200>> {
    return this.core.fetch('/customers/{customerID}/static_memos/{staticMemoID}', 'put', body, metadata);
  }

  /**
   * History of activity for a Static Memo
   *
   * @summary Static Memo Activity
   */
  getCustomersCustomeridStatic_memosStaticmemoidHistory(metadata: types.GetCustomersCustomeridStaticMemosStaticmemoidHistoryMetadataParam): Promise<FetchResponse<200, types.GetCustomersCustomeridStaticMemosStaticmemoidHistoryResponse200>> {
    return this.core.fetch('/customers/{customerID}/static_memos/{staticMemoID}/history', 'get', metadata);
  }

  /**
   * History of activity across all customers and Virtual Accounts
   *
   * @summary Virtual Account Activity Across All Customers
   */
  getVirtual_accountsHistory(metadata?: types.GetVirtualAccountsHistoryMetadataParam): Promise<FetchResponse<200, types.GetVirtualAccountsHistoryResponse200>> {
    return this.core.fetch('/virtual_accounts/history', 'get', metadata);
  }

  /**
   * Get fees that have been configured for supported products.
   *
   * @summary Get the configured fees
   * @throws FetchError<400, types.GetDeveloperFeesResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.GetDeveloperFeesResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetDeveloperFeesResponse500> Unexpected error. User may try and send the request again.
   */
  getDeveloperFees(): Promise<FetchResponse<200, types.GetDeveloperFeesResponse200>> {
    return this.core.fetch('/developer/fees', 'get');
  }

  /**
   * Update fees for supported products.
   *
   * @summary Update the configured fees
   * @throws FetchError<400, types.PostDeveloperFeesResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostDeveloperFeesResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostDeveloperFeesResponse500> Unexpected error. User may try and send the request again.
   */
  postDeveloperFees(body: types.PostDeveloperFeesBodyParam, metadata?: types.PostDeveloperFeesMetadataParam): Promise<FetchResponse<200, types.PostDeveloperFeesResponse200>> {
    return this.core.fetch('/developer/fees', 'post', body, metadata);
  }

  /**
   * Get the configured fee External Account.
   *
   * @summary Get the configured fee External Account
   * @throws FetchError<400, types.GetDeveloperFeeExternalAccountResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.GetDeveloperFeeExternalAccountResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetDeveloperFeeExternalAccountResponse500> Unexpected error. User may try and send the request again.
   */
  getDeveloperFee_external_account(): Promise<FetchResponse<200, types.GetDeveloperFeeExternalAccountResponse200>> {
    return this.core.fetch('/developer/fee_external_account', 'get');
  }

  /**
   * Configure a fee External Account.
   *
   * @summary Configure a fee External Account
   * @throws FetchError<400, types.PostDeveloperFeeExternalAccountResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostDeveloperFeeExternalAccountResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostDeveloperFeeExternalAccountResponse500> Unexpected error. User may try and send the request again.
   */
  postDeveloperFee_external_account(body: types.PostDeveloperFeeExternalAccountBodyParam, metadata?: types.PostDeveloperFeeExternalAccountMetadataParam): Promise<FetchResponse<201, types.PostDeveloperFeeExternalAccountResponse201>> {
    return this.core.fetch('/developer/fee_external_account', 'post', body, metadata);
  }

  /**
   * Generate the Links needs to complete KYC for an individual or business
   *
   * @throws FetchError<400, types.PostKycLinksResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostKycLinksResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostKycLinksResponse500> Unexpected error. User may try and send the request again.
   */
  postKyc_links(body: types.PostKycLinksBodyParam, metadata?: types.PostKycLinksMetadataParam): Promise<FetchResponse<200, types.PostKycLinksResponse200>> {
    return this.core.fetch('/kyc_links', 'post', body, metadata);
  }

  /**
   * Retrieve the full list of kyc links.
   *
   * @summary Get all KYC links.
   * @throws FetchError<401, types.GetKycLinksResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetKycLinksResponse404> No resource found
   * @throws FetchError<500, types.GetKycLinksResponse500> Unexpected error. User may try and send the request again.
   */
  getKyc_links(): Promise<FetchResponse<200, types.GetKycLinksResponse200>> {
    return this.core.fetch('/kyc_links', 'get');
  }

  /**
   * Retrieve the status of a KYC request from the passed in KYC link id
   *
   * @summary Check the status of a KYC link
   * @throws FetchError<401, types.GetKycLinksKyclinkidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.GetKycLinksKyclinkidResponse404> No resource found
   * @throws FetchError<500, types.GetKycLinksKyclinkidResponse500> Unexpected error. User may try and send the request again.
   */
  getKyc_linksKyclinkid(metadata: types.GetKycLinksKyclinkidMetadataParam): Promise<FetchResponse<200, types.GetKycLinksKyclinkidResponse200>> {
    return this.core.fetch('/kyc_links/{kycLinkID}', 'get', metadata);
  }

  /**
   * History of activity across all customers and Virtual Accounts
   *
   * @summary Static Memo Activity Across All Customers
   */
  getStatic_memosHistory(metadata?: types.GetStaticMemosHistoryMetadataParam): Promise<FetchResponse<200, types.GetStaticMemosHistoryResponse200>> {
    return this.core.fetch('/static_memos/history', 'get', metadata);
  }

  /**
   * Get the full list of active and disabled webhook endpoints configured on Bridge
   *
   * @summary Get all webhook endpoints
   * @throws FetchError<401, types.GetWebhooksResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetWebhooksResponse500> Unexpected error. User may try and send the request again.
   */
  getWebhooks(): Promise<FetchResponse<200, types.GetWebhooksResponse200>> {
    return this.core.fetch('/webhooks', 'get');
  }

  /**
   * Create a new webhook endpoint to receive events from Bridge. Webhook endpoints begin in
   * a disabled state and can be enabled with a PUT request. A maximum of 5 webhooks can be
   * active or disabled at one time.
   *
   * @summary Create a webhook endpoint
   * @throws FetchError<400, types.PostWebhooksResponse400> Request containing missing or invalid parameters.
   * @throws FetchError<401, types.PostWebhooksResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostWebhooksResponse500> Unexpected error. User may try and send the request again.
   */
  postWebhooks(body: types.PostWebhooksBodyParam, metadata?: types.PostWebhooksMetadataParam): Promise<FetchResponse<201, types.PostWebhooksResponse201>> {
    return this.core.fetch('/webhooks', 'post', body, metadata);
  }

  /**
   * Update the specified webhook object
   *
   * @summary Update a webhook
   * @throws FetchError<401, types.PutWebhooksWebhookidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.PutWebhooksWebhookidResponse404> No resource found
   * @throws FetchError<500, types.PutWebhooksWebhookidResponse500> Unexpected error. User may try and send the request again.
   */
  putWebhooksWebhookid(body: types.PutWebhooksWebhookidBodyParam, metadata: types.PutWebhooksWebhookidMetadataParam): Promise<FetchResponse<200, types.PutWebhooksWebhookidResponse200>> {
    return this.core.fetch('/webhooks/{webhookID}', 'put', body, metadata);
  }

  /**
   * Delete the specified webhook object. This webhook will no longer be accessible via API.
   *
   * @summary Delete a webhook
   * @throws FetchError<401, types.DeleteWebhooksWebhookidResponse401> Missing or invalid API key
   * @throws FetchError<404, types.DeleteWebhooksWebhookidResponse404> No resource found
   * @throws FetchError<500, types.DeleteWebhooksWebhookidResponse500> Unexpected error. User may try and send the request again.
   */
  deleteWebhooksWebhookid(metadata: types.DeleteWebhooksWebhookidMetadataParam): Promise<FetchResponse<200, types.DeleteWebhooksWebhookidResponse200>> {
    return this.core.fetch('/webhooks/{webhookID}', 'delete', metadata);
  }

  /**
   * List the next 10 events that will be delivered to the specified webhook.
   *
   * @summary List upcoming events
   * @throws FetchError<401, types.GetWebhooksWebhookidEventsResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetWebhooksWebhookidEventsResponse500> Unexpected error. User may try and send the request again.
   */
  getWebhooksWebhookidEvents(metadata: types.GetWebhooksWebhookidEventsMetadataParam): Promise<FetchResponse<200, types.GetWebhooksWebhookidEventsResponse200>> {
    return this.core.fetch('/webhooks/{webhookID}/events', 'get', metadata);
  }

  /**
   * Display the most recent logs for deliveries to the specified webhook.
   *
   * @summary View logs
   * @throws FetchError<401, types.GetWebhooksWebhookidLogsResponse401> Missing or invalid API key
   * @throws FetchError<500, types.GetWebhooksWebhookidLogsResponse500> Unexpected error. User may try and send the request again.
   */
  getWebhooksWebhookidLogs(metadata: types.GetWebhooksWebhookidLogsMetadataParam): Promise<FetchResponse<200, types.GetWebhooksWebhookidLogsResponse200>> {
    return this.core.fetch('/webhooks/{webhookID}/logs', 'get', metadata);
  }

  /**
   * Send an event to the specified webhook endpoint. This will not effect other events in
   * the delivery queue. This operation is possible for both active and disabled webhook
   * endpoints.
   *
   * @summary Send event
   * @throws FetchError<401, types.PostWebhooksWebhookidSendResponse401> Missing or invalid API key
   * @throws FetchError<500, types.PostWebhooksWebhookidSendResponse500> Unexpected error. User may try and send the request again.
   */
  postWebhooksWebhookidSend(body: types.PostWebhooksWebhookidSendBodyParam, metadata: types.PostWebhooksWebhookidSendMetadataParam): Promise<FetchResponse<200, types.PostWebhooksWebhookidSendResponse200>> {
    return this.core.fetch('/webhooks/{webhookID}/send', 'post', body, metadata);
  }

  /**
   * Returns the current exchange rate from the "from" currency to the "to" currency. This
   * data is backed by Morningstar, whom provides industry-trusted data. The exchange rate is
   * updated roughly every 30s. Note that as of this writing, Bridge does not offer a "quote"
   * by which a user can lock in a rate for a given amount of time. This is provided only as
   * a courtesy to estimate what you are likely to get in a subsequent transfer request that
   * involves currency exchange.
   * Note that as of 7/16/2024, only USD->EUR is supported.
   *
   *
   * @summary Get current exchange rate between two currencies.
   */
  getExchange_rates(metadata: types.GetExchangeRatesMetadataParam): Promise<FetchResponse<200, types.GetExchangeRatesResponse200>> {
    return this.core.fetch('/exchange_rates', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { DeleteCustomersCustomeridExternalAccountsExternalaccountidMetadataParam, DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse200, DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse401, DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse404, DeleteCustomersCustomeridExternalAccountsExternalaccountidResponse500, DeleteCustomersCustomeridMetadataParam, DeleteCustomersCustomeridResponse200, DeleteCustomersCustomeridResponse401, DeleteCustomersCustomeridResponse404, DeleteCustomersCustomeridResponse500, DeleteTransfersTransferidMetadataParam, DeleteTransfersTransferidResponse401, DeleteTransfersTransferidResponse404, DeleteTransfersTransferidResponse500, DeleteWebhooksWebhookidMetadataParam, DeleteWebhooksWebhookidResponse200, DeleteWebhooksWebhookidResponse401, DeleteWebhooksWebhookidResponse404, DeleteWebhooksWebhookidResponse500, GetCustomersCustomeridExternalAccountsExternalaccountidMetadataParam, GetCustomersCustomeridExternalAccountsExternalaccountidResponse200, GetCustomersCustomeridExternalAccountsExternalaccountidResponse401, GetCustomersCustomeridExternalAccountsExternalaccountidResponse404, GetCustomersCustomeridExternalAccountsExternalaccountidResponse500, GetCustomersCustomeridExternalAccountsMetadataParam, GetCustomersCustomeridExternalAccountsResponse200, GetCustomersCustomeridExternalAccountsResponse401, GetCustomersCustomeridExternalAccountsResponse500, GetCustomersCustomeridKycLinkMetadataParam, GetCustomersCustomeridKycLinkResponse200, GetCustomersCustomeridKycLinkResponse401, GetCustomersCustomeridKycLinkResponse500, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesMetadataParam, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse200, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse400, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse401, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidBalancesResponse500, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsMetadataParam, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse200, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse400, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse401, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidDrainsResponse500, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidMetadataParam, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse200, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse400, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse401, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse404, GetCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse500, GetCustomersCustomeridLiquidationAddressesMetadataParam, GetCustomersCustomeridLiquidationAddressesResponse200, GetCustomersCustomeridLiquidationAddressesResponse400, GetCustomersCustomeridLiquidationAddressesResponse401, GetCustomersCustomeridLiquidationAddressesResponse500, GetCustomersCustomeridMetadataParam, GetCustomersCustomeridResponse200, GetCustomersCustomeridResponse401, GetCustomersCustomeridResponse404, GetCustomersCustomeridResponse500, GetCustomersCustomeridStaticMemosMetadataParam, GetCustomersCustomeridStaticMemosResponse200, GetCustomersCustomeridStaticMemosStaticmemoidHistoryMetadataParam, GetCustomersCustomeridStaticMemosStaticmemoidHistoryResponse200, GetCustomersCustomeridStaticMemosStaticmemoidMetadataParam, GetCustomersCustomeridStaticMemosStaticmemoidResponse200, GetCustomersCustomeridTosAcceptanceLinkMetadataParam, GetCustomersCustomeridTosAcceptanceLinkResponse200, GetCustomersCustomeridTosAcceptanceLinkResponse401, GetCustomersCustomeridTosAcceptanceLinkResponse500, GetCustomersCustomeridTransfersMetadataParam, GetCustomersCustomeridTransfersResponse200, GetCustomersCustomeridTransfersResponse401, GetCustomersCustomeridTransfersResponse500, GetCustomersCustomeridVirtualAccountsMetadataParam, GetCustomersCustomeridVirtualAccountsResponse200, GetCustomersCustomeridVirtualAccountsVirtualaccountidHistoryMetadataParam, GetCustomersCustomeridVirtualAccountsVirtualaccountidHistoryResponse200, GetCustomersCustomeridVirtualAccountsVirtualaccountidMetadataParam, GetCustomersCustomeridVirtualAccountsVirtualaccountidResponse200, GetCustomersMetadataParam, GetCustomersResponse200, GetCustomersResponse401, GetCustomersResponse500, GetDeveloperFeeExternalAccountResponse200, GetDeveloperFeeExternalAccountResponse400, GetDeveloperFeeExternalAccountResponse401, GetDeveloperFeeExternalAccountResponse500, GetDeveloperFeesResponse200, GetDeveloperFeesResponse400, GetDeveloperFeesResponse401, GetDeveloperFeesResponse500, GetExchangeRatesMetadataParam, GetExchangeRatesResponse200, GetKycLinksKyclinkidMetadataParam, GetKycLinksKyclinkidResponse200, GetKycLinksKyclinkidResponse401, GetKycLinksKyclinkidResponse404, GetKycLinksKyclinkidResponse500, GetKycLinksResponse200, GetKycLinksResponse401, GetKycLinksResponse404, GetKycLinksResponse500, GetPrefundedAccountsPrefundedaccountidHistoryMetadataParam, GetPrefundedAccountsPrefundedaccountidHistoryResponse200, GetPrefundedAccountsPrefundedaccountidHistoryResponse401, GetPrefundedAccountsPrefundedaccountidHistoryResponse404, GetPrefundedAccountsPrefundedaccountidHistoryResponse500, GetPrefundedAccountsPrefundedaccountidMetadataParam, GetPrefundedAccountsPrefundedaccountidResponse200, GetPrefundedAccountsPrefundedaccountidResponse401, GetPrefundedAccountsPrefundedaccountidResponse404, GetPrefundedAccountsPrefundedaccountidResponse500, GetPrefundedAccountsResponse200, GetPrefundedAccountsResponse401, GetPrefundedAccountsResponse404, GetPrefundedAccountsResponse500, GetStaticMemosHistoryMetadataParam, GetStaticMemosHistoryResponse200, GetTransfersMetadataParam, GetTransfersResponse200, GetTransfersResponse401, GetTransfersResponse500, GetTransfersTransferidMetadataParam, GetTransfersTransferidResponse200, GetTransfersTransferidResponse401, GetTransfersTransferidResponse404, GetTransfersTransferidResponse500, GetVirtualAccountsHistoryMetadataParam, GetVirtualAccountsHistoryResponse200, GetWebhooksResponse200, GetWebhooksResponse401, GetWebhooksResponse500, GetWebhooksWebhookidEventsMetadataParam, GetWebhooksWebhookidEventsResponse200, GetWebhooksWebhookidEventsResponse401, GetWebhooksWebhookidEventsResponse500, GetWebhooksWebhookidLogsMetadataParam, GetWebhooksWebhookidLogsResponse200, GetWebhooksWebhookidLogsResponse401, GetWebhooksWebhookidLogsResponse500, PostCustomersBodyParam, PostCustomersCustomeridExternalAccountsBodyParam, PostCustomersCustomeridExternalAccountsMetadataParam, PostCustomersCustomeridExternalAccountsResponse201, PostCustomersCustomeridExternalAccountsResponse400, PostCustomersCustomeridExternalAccountsResponse401, PostCustomersCustomeridExternalAccountsResponse500, PostCustomersCustomeridLiquidationAddressesBodyParam, PostCustomersCustomeridLiquidationAddressesMetadataParam, PostCustomersCustomeridLiquidationAddressesResponse201, PostCustomersCustomeridLiquidationAddressesResponse400, PostCustomersCustomeridLiquidationAddressesResponse401, PostCustomersCustomeridLiquidationAddressesResponse500, PostCustomersCustomeridPlaidLinkRequestsMetadataParam, PostCustomersCustomeridPlaidLinkRequestsResponse201, PostCustomersCustomeridPlaidLinkRequestsResponse400, PostCustomersCustomeridPlaidLinkRequestsResponse401, PostCustomersCustomeridPlaidLinkRequestsResponse500, PostCustomersCustomeridStaticMemosBodyParam, PostCustomersCustomeridStaticMemosMetadataParam, PostCustomersCustomeridStaticMemosResponse200, PostCustomersCustomeridVirtualAccountsBodyParam, PostCustomersCustomeridVirtualAccountsMetadataParam, PostCustomersCustomeridVirtualAccountsResponse200, PostCustomersCustomeridVirtualAccountsVirtualaccountidDeactivateMetadataParam, PostCustomersCustomeridVirtualAccountsVirtualaccountidDeactivateResponse200, PostCustomersCustomeridVirtualAccountsVirtualaccountidReactivateMetadataParam, PostCustomersCustomeridVirtualAccountsVirtualaccountidReactivateResponse200, PostCustomersMetadataParam, PostCustomersResponse201, PostCustomersResponse400, PostCustomersResponse401, PostCustomersResponse500, PostCustomersTosLinksMetadataParam, PostCustomersTosLinksResponse201, PostCustomersTosLinksResponse401, PostCustomersTosLinksResponse500, PostDeveloperFeeExternalAccountBodyParam, PostDeveloperFeeExternalAccountMetadataParam, PostDeveloperFeeExternalAccountResponse201, PostDeveloperFeeExternalAccountResponse400, PostDeveloperFeeExternalAccountResponse401, PostDeveloperFeeExternalAccountResponse500, PostDeveloperFeesBodyParam, PostDeveloperFeesMetadataParam, PostDeveloperFeesResponse200, PostDeveloperFeesResponse400, PostDeveloperFeesResponse401, PostDeveloperFeesResponse500, PostKycLinksBodyParam, PostKycLinksMetadataParam, PostKycLinksResponse200, PostKycLinksResponse400, PostKycLinksResponse401, PostKycLinksResponse500, PostPlaidExchangePublicTokenLinkTokenBodyParam, PostPlaidExchangePublicTokenLinkTokenMetadataParam, PostPlaidExchangePublicTokenLinkTokenResponse201, PostPlaidExchangePublicTokenLinkTokenResponse400, PostPlaidExchangePublicTokenLinkTokenResponse401, PostPlaidExchangePublicTokenLinkTokenResponse500, PostTransfersBodyParam, PostTransfersMetadataParam, PostTransfersResponse201, PostTransfersResponse400, PostTransfersResponse401, PostTransfersResponse403, PostTransfersResponse500, PostWebhooksBodyParam, PostWebhooksMetadataParam, PostWebhooksResponse201, PostWebhooksResponse400, PostWebhooksResponse401, PostWebhooksResponse500, PostWebhooksWebhookidSendBodyParam, PostWebhooksWebhookidSendMetadataParam, PostWebhooksWebhookidSendResponse200, PostWebhooksWebhookidSendResponse401, PostWebhooksWebhookidSendResponse500, PutCustomersCustomeridBodyParam, PutCustomersCustomeridExternalAccountsExternalaccountidBodyParam, PutCustomersCustomeridExternalAccountsExternalaccountidMetadataParam, PutCustomersCustomeridExternalAccountsExternalaccountidResponse200, PutCustomersCustomeridExternalAccountsExternalaccountidResponse400, PutCustomersCustomeridExternalAccountsExternalaccountidResponse401, PutCustomersCustomeridExternalAccountsExternalaccountidResponse500, PutCustomersCustomeridLiquidationAddressesLiquidationaddressidBodyParam, PutCustomersCustomeridLiquidationAddressesLiquidationaddressidMetadataParam, PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse200, PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse400, PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse401, PutCustomersCustomeridLiquidationAddressesLiquidationaddressidResponse500, PutCustomersCustomeridMetadataParam, PutCustomersCustomeridResponse200, PutCustomersCustomeridResponse401, PutCustomersCustomeridResponse404, PutCustomersCustomeridResponse500, PutCustomersCustomeridStaticMemosStaticmemoidBodyParam, PutCustomersCustomeridStaticMemosStaticmemoidMetadataParam, PutCustomersCustomeridStaticMemosStaticmemoidResponse200, PutCustomersCustomeridVirtualAccountsVirtualaccountidBodyParam, PutCustomersCustomeridVirtualAccountsVirtualaccountidMetadataParam, PutCustomersCustomeridVirtualAccountsVirtualaccountidResponse200, PutWebhooksWebhookidBodyParam, PutWebhooksWebhookidMetadataParam, PutWebhooksWebhookidResponse200, PutWebhooksWebhookidResponse401, PutWebhooksWebhookidResponse404, PutWebhooksWebhookidResponse500 } from './types';
