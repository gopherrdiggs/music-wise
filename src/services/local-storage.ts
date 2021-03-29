class LocalStorageController {

  storage = window.localStorage;
  storageKeyPrefix: string = '';
  
  setLocalStoragePrefix(prefix) {

    this.storageKeyPrefix = prefix;
  }

  testForLocalStorage() {
    if (!this.storage) {
      throw "Local storage unavailable.";
    }
  }

  set(keySuffix: string, value: any) {
    try {
      this.testForLocalStorage();
      this.storage.setItem(this.storageKeyPrefix + keySuffix, JSON.stringify(value));
    }
    catch (error) {
      throw `Unable to store value in local storage: ${value} due to error:` + error.message;
    }
  }

  get(keySuffix: string) {
    try {
      this.testForLocalStorage();
      const item = this.storage.getItem(this.storageKeyPrefix + keySuffix);
      return JSON.parse(item);
    }
    catch (error) {
      throw `Unable to get value from local storage: ${this.storageKeyPrefix + keySuffix} due to error:` + error.message;
    }
  }

  clearSession(keyPrefix?: string) {
    try {
      let sessionKeys = Object.keys(window.sessionStorage);
      if (keyPrefix) {
        sessionKeys = sessionKeys.filter(k => k.startsWith(keyPrefix));
      }
      for (let key of sessionKeys) {
        window.sessionStorage.removeItem(key);
      }
    }
    catch (error) {
      throw `Unable to clear session storage due to error:` + error.message;
    }
  }

  getFromSession(keyPrefix: string) {
    try {
      let sessionKeys = Object.keys(window.sessionStorage);
      let key = sessionKeys.find(k => k.startsWith(keyPrefix));
      return window.sessionStorage.getItem(key);
    }
    catch (error) {
      throw `Unable to get value from session storage: ${keyPrefix} due to error:` + error.message;
    }
  }

  remove(keySuffix: string) {
    try {
      this.testForLocalStorage();
      this.storage.removeItem(this.storageKeyPrefix + keySuffix);
    }
    catch (error) {
      throw `Unable to remove value from local storage: ${this.storageKeyPrefix + keySuffix} due to error:` + error.message;
    }
  }
}

export const LocalStorageService = new LocalStorageController();
