class BaseComponent {
  constructor() {
    if (this.constructor.name === 'BaseComponent') {
      throw new Error('Невозможно создать экземпляр абстрактного класса BaseComponent напрямую, только наследование');
    }
  }

  getProxyState(initialState) {
    return new Proxy(initialState, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, newValue) => {
        const oldValue = target[prop];
        target[prop] = newValue;

        if (oldValue !== newValue) {
          this.updateUI()
        }
        return true;
      },
    })
  }

  updateUI() {
    throw new Error('Необходимо реализовать метод updateUI')
  }
}

export default  BaseComponent;