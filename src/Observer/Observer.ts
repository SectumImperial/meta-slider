interface ValueObserverEntry {
  update(data: object): void;
}

interface Observers {
  [index: string]: ValueObserverEntry[]
}

abstract class Observer {
  private observers: Observers = {};

  public addSubscriber(event: string, observer: ValueObserverEntry): void {
    if (this.observers[event]) {
      const keys = this.observers[event];
      this.observers[event] = [...keys, observer];
    } else {
      this.observers[event] = [observer];
    }
  }

  public removeSubscriber(event: string, observer: ValueObserverEntry): void {
    this.observers[event].filter(obs => obs !== observer)
  }

  public emit(event: string, data: object): void {
    const observers = this.observers[event] || [];
    observers.forEach((observer) => observer.update(data))
  }
}

export default Observer;