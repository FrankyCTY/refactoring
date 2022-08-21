class CustomerData {
  constructor(data) {
    this._data = data;
  }

  get rawData() {
    return _.cloneDeep(this._data);
  }

  usage(customerID, year, month) {
    return this._data[customerID].usages[year][month];
  }

  setUsage(customerID, year, month, amount) {
    this._data[customerID].usages[year][month] = amount;
  }
}

function getCustomerData() {
  return customerData;
}
function getRawDataOfCustomers() {
  return customerData._data;
}
function setRawDataOfCustomers(arg) {
  customerData = new CustomerData(arg);
}

// Read
function compareUsage(customerID, laterYear, month) {
  const later = getCustomerData().rawData[customerID].usages[laterYear][month];
  const earlier =
    getCustomerData().rawData[customerID].usages[laterYear - 1][month];
  return { laterAmount: later, change: later - earlier };
}
